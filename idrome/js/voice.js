/**
 * iDrome — 语音处理模块
 * 步骤 8.3：按设计方案第 20 章实现
 *
 * 功能：
 * - VoiceRecognition 类 — 录音 + ASR 语音识别
 * - VoiceSynthesis 类 — TTS 语音合成（朗读）
 * - 安全架构：不持有豆包 API 密钥，通过 voice-proxy Edge Function 代理
 *
 * 交互：
 * - 录音按钮 → 红色脉冲动画（2s 循环）→ 停止后自动识别 → 填入输入框
 * - 朗读按钮 → 播放/暂停切换 → 朗读完成后自动恢复
 */

'use strict'

/**
 * 获取 Supabase 客户端
 */
function getSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase
  }
  return null
}

/**
 * 获取 voice-proxy 端点
 */
function getVoiceProxyUrl() {
  const supabaseUrl =
    (typeof window !== 'undefined' && window.IDROME_CONFIG?.supabaseUrl) ||
    'https://kbbtsurqznyyqfoaoutt.supabase.co'
  return `${supabaseUrl}/functions/v1/voice-proxy`
}

/**
 * 获取认证头
 */
async function getAuthHeaders() {
  const supabase = getSupabase()
  if (!supabase || !supabase.auth) {
    throw new Error('未登录 — Supabase 客户端未初始化')
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) {
    throw new Error('未登录或会话已过期')
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  }
}

/**
 * ArrayBuffer 转 Base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/* ============================================================
 * VoiceRecognition — 语音识别（ASR）
 * ============================================================ */

export class VoiceRecognition {
  constructor() {
    this.proxyUrl = getVoiceProxyUrl()
    this.mediaRecorder = null
    this.audioChunks = []
    this.isRecording = false
    this.onStateChange = null  // 回调：(isRecording: boolean)
    this.onResult = null       // 回调：(text: string)
    this.onError = null        // 回调：(error: Error)
  }

  /**
   * 开始录音
   * @returns {Promise<boolean>}
   */
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      // 检测浏览器支持的 MIME 类型（Safari 不支持 webm）
      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ].find(type => MediaRecorder.isTypeSupported(type)) || ''

      this.mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = (event) => {
        console.error('[Voice] 录音错误:', event.error)
        this.onError?.(new Error('录音设备出错'))
        this.stopRecording()
      }

      this.mediaRecorder.start(100)  // 每 100ms 收集一次数据
      this.isRecording = true
      this.onStateChange?.(true)

      console.log('[Voice] 录音已开始, MIME:', mimeType || '默认')
      return true
    } catch (err) {
      console.error('[Voice] 录音启动失败:', err)
      if (err.name === 'NotAllowedError') {
        throw new Error('麦克风权限未授予，请在浏览器设置中允许麦克风访问')
      }
      throw new Error('麦克风不可用: ' + err.message)
    }
  }

  /**
   * 停止录音
   */
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    this.isRecording = false
    this.onStateChange?.(false)
  }

  /**
   * 停止录音并识别
   * @returns {Promise<string>} 识别结果文本
   */
  async stopAndRecognize() {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      throw new Error('录音未开始或已停止')
    }

    return new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = async () => {
        try {
          // 释放麦克风
          if (this.mediaRecorder.stream) {
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
          }

          if (this.audioChunks.length === 0) {
            this.isRecording = false
            this.onStateChange?.(false)
            reject(new Error('未检测到音频数据，请重试'))
            return
          }

          const audioBlob = new Blob(this.audioChunks, {
            type: this.mediaRecorder.mimeType || 'audio/webm'
          })

          console.log('[Voice] 录音停止，音频大小:', (audioBlob.size / 1024).toFixed(1), 'KB')

          // 转换为 PCM 格式后发送识别请求
          const pcmData = await this.convertToPCM(audioBlob)
          const text = await this.recognize(pcmData)

          this.isRecording = false
          this.onStateChange?.(false)
          this.onResult?.(text)
          resolve(text)
        } catch (err) {
          this.isRecording = false
          this.onStateChange?.(false)
          this.onError?.(err)
          reject(err)
        }
      }

      this.stopRecording()
    })
  }

  /**
   * 取消录音
   */
  cancelRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
      this.mediaRecorder.stop()
    }
    this.audioChunks = []
    this.isRecording = false
    this.onStateChange?.(false)
  }

  /**
   * 调用豆包 ASR API（通过 voice-proxy Edge Function 代理）
   * 前端发送 PCM 音频数据，Edge Function 使用 DOUBAO_API_KEY 调用豆包 ASR
   */
  async recognize(pcmBuffer) {
    // 将 PCM 数据转为 Base64 发送给 Edge Function
    const audioBase64 = arrayBufferToBase64(pcmBuffer)

    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        action: 'asr',
        audio: audioBase64,
        format: 'pcm',
        rate: 16000
      })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || `语音识别失败: ${response.status}`)
    }

    const result = await response.json()
    if (!result.text) {
      throw new Error('未识别到语音内容，请重试')
    }
    return result.text
  }

  /**
   * 音频格式转换 (WebM/Opus → PCM Int16)
   * 使用 AudioContext 进行解码和重采样
   */
  async convertToPCM(audioBlob) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    })

    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // 重采样到 16000Hz
      const offlineCtx = new OfflineAudioContext(
        1,
        Math.ceil(audioBuffer.duration * 16000),
        16000
      )
      const source = offlineCtx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(offlineCtx.destination)
      source.start()
      const renderedBuffer = await offlineCtx.startRendering()

      // 转换为 PCM Int16
      const pcmData = new Int16Array(renderedBuffer.length)
      const channelData = renderedBuffer.getChannelData(0)
      for (let i = 0; i < channelData.length; i++) {
        pcmData[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32768))
      }

      return pcmData.buffer
    } finally {
      audioContext.close()
    }
  }
}

/* ============================================================
 * VoiceSynthesis — 语音合成（TTS）
 * ============================================================ */

export class VoiceSynthesis {
  constructor() {
    this.proxyUrl = getVoiceProxyUrl()
    this.currentAudio = null
    this.isPlaying = false
    this.isPaused = false
    this.onStateChange = null  // 回调：(state: 'playing' | 'paused' | 'stopped')
    this.audioCache = new Map()  // 文本 → Base64 音频缓存
  }

  /**
   * 朗读文本
   * @param {string} text - 要朗读的文本
   * @param {object} options - 可选参数
   * @param {string} options.speaker - 音色 ID
   * @param {number} options.speed - 语速 0.5-2.0（默认 1.0）
   */
  async speak(text, options = {}) {
    if (!text || !text.trim()) {
      throw new Error('朗读文本不能为空')
    }

    // 停止当前播放
    this.stop()

    try {
      // 检查缓存
      const cacheKey = `${text.slice(0, 100)}_${options.speaker || 'default'}_${options.speed || 1.0}`
      let audioBase64 = this.audioCache.get(cacheKey)

      if (!audioBase64) {
        // 通过 voice-proxy Edge Function 代理调用豆包 TTS
        const response = await fetch(this.proxyUrl, {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: JSON.stringify({
            action: 'tts',
            text: text,
            speaker: options.speaker || 'zh_female_vv_jupiter_bigtts',
            speed: options.speed || 1.0
          })
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.error || `TTS 合成失败: ${response.status}`)
        }

        const result = await response.json()
        audioBase64 = result.audio
        if (!audioBase64) {
          throw new Error('TTS 返回空音频数据')
        }

        // 缓存（最多缓存 20 条）
        if (this.audioCache.size < 20) {
          this.audioCache.set(cacheKey, audioBase64)
        }
      }

      // 播放 Base64 编码的 MP3 音频
      await this.playBase64(audioBase64)
    } catch (err) {
      this.isPlaying = false
      this.isPaused = false
      this.onStateChange?.('stopped')
      throw err
    }
  }

  /**
   * 暂停朗读
   */
  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause()
      this.isPlaying = false
      this.isPaused = true
      this.onStateChange?.('paused')
    }
  }

  /**
   * 继续朗读
   */
  resume() {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play()
      this.isPlaying = true
      this.isPaused = false
      this.onStateChange?.('playing')
    }
  }

  /**
   * 停止朗读
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio.onended = null
      this.currentAudio.onerror = null
      this.currentAudio = null
    }
    this.isPlaying = false
    this.isPaused = false
    this.onStateChange?.('stopped')
  }

  /**
   * 切换播放/暂停
   */
  toggle() {
    if (this.isPlaying) {
      this.pause()
    } else if (this.isPaused) {
      this.resume()
    }
  }

  /**
   * 播放 Base64 音频（MP3 格式）
   */
  async playBase64(base64Data) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(`data:audio/mp3;base64,${base64Data}`)

      audio.onplay = () => {
        this.isPlaying = true
        this.isPaused = false
        this.onStateChange?.('playing')
      }

      audio.onended = () => {
        this.isPlaying = false
        this.isPaused = false
        this.currentAudio = null
        this.onStateChange?.('stopped')
        resolve()
      }

      audio.onerror = (e) => {
        this.isPlaying = false
        this.isPaused = false
        this.currentAudio = null
        this.onStateChange?.('stopped')
        reject(new Error('音频播放失败: ' + (e.message || '未知错误')))
      }

      this.currentAudio = audio
      audio.play().catch(reject)
    })
  }

  /**
   * 清除音频缓存
   */
  clearCache() {
    this.audioCache.clear()
  }

  /** 可选音色列表 */
  static SPEAKERS = {
    vv:      { id: 'zh_female_vv_jupiter_bigtts',    desc: '活泼灵动女声' },
    xiaohe:  { id: 'zh_female_xiaohe_jupiter_bigtts', desc: '甜美活泼女声（台湾口音）' },
    yunzhou: { id: 'zh_male_yunzhou_jupiter_bigtts',   desc: '清爽沉稳男声' },
    xiaotian:{ id: 'zh_male_xiaotian_jupiter_bigtts',  desc: '清爽磁性男声' },
    tim:     { id: 'en_male_tim_uranus_bigtts',        desc: '美式英语男声' },
    dacey:   { id: 'en_female_dacey_uranus_bigtts',    desc: '美式英语女声' }
  }
}

// 默认导出单例
export const voiceRecognition = new VoiceRecognition()
export const voiceSynthesis = new VoiceSynthesis()