<template>
  <div class="sub-page practice-page">
    <div class="page-header">
      <h2 class="sub-page-title">专项练习</h2>
      <p class="sub-page-desc">通过针对性练习巩固田语知识，涵盖发音、词汇、语法和翻译四大模块。</p>
      <a href="https://baike.baidu.com/item/%E7%90%B3%E5%87%AF%E8%92%82%E4%BA%9A%E8%AF%AD/66751047" target="_blank" class="baike-link" title="在百度百科查看琳凯蒂亚语">📖 在百度百科查看琳凯蒂亚语 →</a>
    </div>

    <!-- 练习统计 -->
    <div class="practice-stats" v-if="totalAnswered > 0">
      <div class="stat-item">
        <div class="stat-value">{{ totalAnswered }}</div>
        <div class="stat-label">今日练习</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ correctCount }}</div>
        <div class="stat-label">正确数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ correctRate }}%</div>
        <div class="stat-label">正确率</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ activeModeTitle }}</div>
        <div class="stat-label">当前模式</div>
      </div>
    </div>

    <!-- 练习模式选择 -->
    <div class="practice-modes" v-if="!activeMode">
      <div class="mode-card" v-for="mode in modes" :key="mode.id" @click="startMode(mode)">
        <div class="mode-icon">{{ mode.icon }}</div>
        <h3>{{ mode.title }}</h3>
        <p>{{ mode.desc }}</p>
        <span class="mode-count">{{ mode.count }} 题</span>
      </div>
    </div>

    <!-- 活跃练习 -->
    <div class="active-practice" v-if="activeMode">
      <!-- 返回按钮 -->
      <button class="btn-back" @click="activeMode = null">← 返回模式选择</button>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ currentQuestions.length }}</span>
      </div>

      <!-- 题目区域 -->
      <div class="question-card" v-if="currentQuestion">
        <div class="question-header">
          <span class="question-num">第 {{ currentIndex + 1 }} 题</span>
          <span class="question-type">{{ currentQuestion.typeLabel }}</span>
        </div>

        <!-- 选择题 -->
        <template v-if="currentQuestion.type === 'choice'">
          <div class="question-stem">{{ currentQuestion.question }}</div>
          <div class="question-options">
            <button
              v-for="(opt, idx) in currentQuestion.options"
              :key="idx"
              :class="getOptionClass(idx)"
              @click="selectOption(idx)"
              :disabled="answered"
            >{{ opt }}</button>
          </div>
        </template>

        <!-- 填空题 -->
        <template v-if="currentQuestion.type === 'fill'">
          <div class="question-stem">{{ currentQuestion.question }}</div>
          <div class="fill-area">
            <input
              v-model="userAnswer"
              type="text"
              :placeholder="currentQuestion.placeholder"
              class="fill-input"
              :disabled="answered"
              @keyup.enter="submitFill"
            />
            <button class="btn-submit" @click="submitFill" :disabled="answered || !userAnswer.trim()">提交</button>
          </div>
        </template>

        <!-- 反馈 -->
        <div class="feedback" v-if="answered" :class="{ correct: isCorrect, wrong: !isCorrect }">
          <span class="feedback-icon">{{ isCorrect ? '✅' : '❌' }}</span>
          <div class="feedback-text">
            <p v-if="isCorrect">回答正确！</p>
            <p v-else>回答错误。正确答案：<strong>{{ currentQuestion.answer }}</strong></p>
            <p class="feedback-explanation" v-if="currentQuestion.explanation">{{ currentQuestion.explanation }}</p>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="question-nav" v-if="answered">
        <button class="btn-nav" @click="prevQuestion" :disabled="currentIndex === 0">上一题</button>
        <button class="btn-nav btn-primary" @click="nextQuestion" v-if="currentIndex < currentQuestions.length - 1">下一题</button>
        <button class="btn-nav btn-finish" @click="finishMode" v-else>完成练习</button>
      </div>
    </div>

    <!-- 完成面板 -->
    <div class="finish-panel" v-if="showFinish">
      <div class="finish-icon">🎉</div>
      <h2>练习完成！</h2>
      <div class="finish-stats">
        <div class="finish-stat">
          <div class="finish-value">{{ correctCount }}</div>
          <div class="finish-label">正确</div>
        </div>
        <div class="finish-stat">
          <div class="finish-value">{{ totalAnswered - correctCount }}</div>
          <div class="finish-label">错误</div>
        </div>
        <div class="finish-stat">
          <div class="finish-value">{{ correctRate }}%</div>
          <div class="finish-label">正确率</div>
        </div>
      </div>
      <div class="finish-actions">
        <button class="btn-nav btn-primary" @click="retryMode">重新练习</button>
        <button class="btn-nav" @click="resetAll">返回模式选择</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeMode = ref(null)
const activeModeTitle = ref('')
const currentIndex = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const userAnswer = ref('')
const selectedOption = ref(-1)
const correctCount = ref(0)
const totalAnswered = ref(0)
const showFinish = ref(false)
const userAnswers = ref([])

const modes = ref([
  { id: 'pronunciation', icon: '🔊', title: '发音练习', desc: '听音辨字，掌握41个字母的标准发音与音节结构', count: 10 },
  { id: 'vocabulary', icon: '📝', title: '词汇练习', desc: '田语↔中文互译，巩固核心词汇和词根派生', count: 10 },
  { id: 'grammar', icon: '📐', title: '语法练习', desc: '示词、体貌、结语、句式专项训练', count: 10 },
  { id: 'translation', icon: '📖', title: '翻译练习', desc: '完整句子翻译，综合运用田语知识', count: 10 }
])

// ========== 发音练习题 ==========
const pronunciationQuestions = [
  { type: 'choice', typeLabel: '选择题', question: '田语字母 "ŝ" 的发音是什么？', options: ['[s]', '[ʂ] / [ɕ]', '[ʃ]', '[ts]'], answer: 1, explanation: 'ŝ 的发音是 [ʂ] 或 [ɕ]，类似汉语拼音的 sh。' },
  { type: 'choice', typeLabel: '选择题', question: '田语字母 "c" 的发音是什么？', options: ['[k]', '[s]', '[tsʰ] / [s]', '[tʃ]'], answer: 2, explanation: 'c 的发音是 [tsʰ] 或 [s]，类似汉语拼音的 c。' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个字母在词尾时不发音？', options: ['g', 'm', 'l', 'ŋ'], answer: 2, explanation: '尾音 l 在词尾时不发音，仅标记前面元音的发音方式。例如 bel 读作 [pe̞]。' },
  { type: 'choice', typeLabel: '选择题', question: '田语 "ŋ" 的发音是什么？', options: ['[n]', '[ŋ] (ng)', '[m]', '[ɲ]'], answer: 1, explanation: 'ŋ 的发音是 [ŋ]，类似英语 sing 中的 ng。' },
  { type: 'choice', typeLabel: '选择题', question: '田语共有多少个字母？', options: ['26个', '35个', '41个（26辅音+15元音）', '52个'], answer: 2, explanation: '田语共有41个字母，包括26个辅音和15个元音。' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个音节结构不属于田语的5种合法结构？', options: ['辅音+元音（如 wi）', '辅音+辅音+元音+辅音（如 plib）', '元音+尾音（如 el）', '纯辅音（如 n）'], answer: 1, explanation: '词尾不允许辅音连缀，plib 不是合法结构。田语词尾必须以元音或尾音结尾。' },
  { type: 'choice', typeLabel: '选择题', question: '田语 "g" 在词尾时的发音类型是什么？', options: ['爆破音', '顿音（不爆破）[k̚]', '不发音', '鼻音'], answer: 1, explanation: 'g 在词尾时为顿音 [k̚]，不爆破。例如 pag 读作 [pʰäk̚]。' },
  { type: 'choice', typeLabel: '选择题', question: '田语 "r" 在词尾时发什么音？', options: ['[r]（颤音）', '[ɚ]（卷舌音）', '不发音', '[l]'], answer: 1, explanation: 'r 在词尾时发卷舌音 [ɚ]，类似美式英语的 er。例如 per 读作 [pʰe̞ɚ]。' },
  { type: 'fill', typeLabel: '填空题', question: '田语 "caŋ" 的音节结构类型是：辅音 + 元音 + ______（填尾音类型）', answer: '尾音', placeholder: '请输入尾音类型...', explanation: 'caŋ 的结构是辅音（c）+ 元音（a）+ 尾音（ŋ），属于第⑤种音节结构。' },
  { type: 'fill', typeLabel: '填空题', question: '田语中 O 列元音包括 o、ō 和 ______（填字母）', answer: 'ô', placeholder: '请输入第三个O列元音...', explanation: 'O 列元音包括 o [ɑʊ̯]、ō [oʊ̯]（ou）和 ô [œ]（oe）。' }
]

// ========== 词汇练习题 ==========
const vocabularyQuestions = [
  { type: 'choice', typeLabel: '选择题', question: '"libo" 的中文意思是什么？', options: ['写', '书', '学习', '笔'], answer: 1, explanation: 'libo 是名词"书"，词根为 lib-，o 结尾表示名词。' },
  { type: 'choice', typeLabel: '选择题', question: '"bela" 的意思是"美丽的"，它的反义词是什么？', options: ['nebela', 'mubela', 'kebela', 'cebela'], answer: 1, explanation: '前缀 mu- 表示"正→负（反义）"，所以 mubela 意为"丑的"。' },
  { type: 'choice', typeLabel: '选择题', question: '"sosenio" 是什么意思？', options: ['学生', '学习', '学校', '学者'], answer: 2, explanation: 'sos-（学）+ -io（场所）= sosenio（学校），后缀 -io 表示场所。' },
  { type: 'choice', typeLabel: '选择题', question: '"libekiŋ" 是什么意思？', options: ['书', '写', '图书馆', '笔'], answer: 3, explanation: 'lib-（书/写）+ -kiŋ（工具）= libekiŋ（笔），后缀 -kiŋ 表示工具。' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个词是外来词？', options: ['libo', 'bela', 'ĉate', 'sose'], answer: 2, explanation: 'ĉate（聊天）来自英语 chat，是外来词。其他三个都是标准词根派生的。' },
  { type: 'choice', typeLabel: '选择题', question: '"dāske" 的中文意思是什么？', options: ['思考', '跑步', '喜欢', '睡觉'], answer: 2, explanation: 'dāske 意为"喜欢"（动词），词根 dāsk- 核心语义为"喜欢/爱"。' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个词是古有词（固有词）？', options: ['libo', 'ginmō', 'ĉokolito', 'soseo'], answer: 1, explanation: 'ginmō（加油）是古有词/固有词，不遵循标准词根的派生规则。' },
  { type: 'choice', typeLabel: '选择题', question: '"kebelejiar" 是什么意思？', options: ['美丽的', '使美丽', '美容院', '美容师'], answer: 3, explanation: 'ke-（使动）+ bel-（美）+ -jiar（职业者）= kebelejiar（美容师）。' },
  { type: 'fill', typeLabel: '填空题', question: '词根 "dorm-" 的核心语义是"睡/眠"，请写出"睡觉"的田语动词形式：______', answer: 'dorme', placeholder: '请输入田语...', explanation: 'dorme 是动词"睡觉"，e 结尾表示动词。' },
  { type: 'fill', typeLabel: '填空题', question: 'bel-（美）→ bela（美丽的）→ ______（丑的），请填写反义词', answer: 'mubela', placeholder: '请输入田语...', explanation: '前缀 mu- 表示反义，mubela = mu + bela = 丑的。' }
]

// ========== 语法练习题 ==========
const grammarQuestions = [
  { type: 'choice', typeLabel: '选择题', question: '"Wi wô elāle yo." 中 wô 是什么示词？', options: ['主语他发示词', '主语自发示词', '主语抽象示词', '宾语示词'], answer: 1, explanation: 'wô 是主语自发示词，表示有生命物主动施事。"我主动来了。"' },
  { type: 'choice', typeLabel: '选择题', question: '"Ŝi es bela yo." 属于哪种句子类型？', options: ['变化句 Σc', '关系句 Σr', '变化关系句 Σcr', '祈使句'], answer: 1, explanation: '使用系动词 es（是），连接主语和宾语，属于关系句 Σr = S + V + O。' },
  { type: 'choice', typeLabel: '选择题', question: '"libele" 中的 -le 是什么体词尾？', options: ['进行体', '结果体', '经验体', '计划体'], answer: 2, explanation: '-le 是经验体（正向），表示"曾做过"。libele 意为"写过"。' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个是宾语动态示词？', options: ['par', 'pon', 'wô', 'du'], answer: 1, explanation: 'pon 是宾语动态示词，用于传递/使役/受益对象。' },
  { type: 'choice', typeLabel: '选择题', question: '"Ko es bona meyo." 中 meyo 表达什么？', options: ['疑问', '感叹', '显而易见（陈述）', '愤怒'], answer: 2, explanation: 'me- 是前止词表示"显而易见"，yo 是后止词表示陈述语气。meyo = 显然如此。' },
  { type: 'choice', typeLabel: '选择题', question: '田语中"单动词原则"指的是什么？', options: ['一个词只能有一个意思', '一个标准句只能有一个核心述元', '一个动词只能有一个体词尾', '一个句子只能有一个动词'], answer: 1, explanation: '单动词原则是田语核心铁律——一个标准句中只能有一个核心述元。动词并列被禁止，需通过降级处理实现。' },
  { type: 'choice', typeLabel: '选择题', question: '"Win sakile handêga!" 中 handêga 表达什么情感？', options: ['愤怒', '疑问', '喜悦', '悲伤'], answer: 2, explanation: 'handê- 是前止词表示喜悦，ga 是后止词表示感叹。handêga = 太高兴了！' },
  { type: 'choice', typeLabel: '选择题', question: '以下哪个是述辅地点示词？', options: ['xu', 'ku', 'du', 'peyoŋ'], answer: 1, explanation: 'ku 是述辅地点示词，用于修饰动词的地点。xu 是时间，du 是普通述辅，peyoŋ 是方式。' },
  { type: 'fill', typeLabel: '填空题', question: '分句未完时使用的中顿后止词是 ______（填一个词）', answer: 'de', placeholder: '请输入中顿后止词...', explanation: 'de 是中顿后止词，分句未完时用 de，最后用 ga/yo/ne 收尾。例如：Hi parle de, hi hapele de, hi dormele yo.' },
  { type: 'fill', typeLabel: '填空题', question: '田语共有 ______ 个示词（填数字）', answer: '15', placeholder: '请输入数字...', explanation: '田语共有15个示词：3个主语示词 + 2个宾语示词 + 5个述辅示词 + 3个主宾辅示词 + 2个其他示词。' }
]

// ========== 翻译练习题 ==========
const translationQuestions = [
  { type: 'choice', typeLabel: '选择题', question: '"Hi dormelē yo." 的中文翻译是什么？', options: ['他正在睡觉。', '他睡着了。', '他睡过觉。', '他打算睡觉。'], answer: 1, explanation: 'dormelē 中 -lē 是结果体（正向），表示"已经做完"。所以是"他睡着了。"' },
  { type: 'choice', typeLabel: '选择题', question: '"我写过书" 的田语翻译是？', options: ['Wi libeze libo yo.', 'Wi libelē libo yo.', 'Wi libele libo yo.', 'Wi libege libo yo.'], answer: 2, explanation: 'libele 中 -le 是经验体（正向），表示"曾做过"。Wi libele libo yo. = 我写过书。' },
  { type: 'choice', typeLabel: '选择题', question: '"Libro ez dekowo." 的中文翻译是什么？', options: ['书在桌子上。', '桌子上有书。', '书不是桌子。', '书是桌子。'], answer: 0, explanation: 'ez 表示"在/有"，dekowo 是"桌子上"（deko + wo）。Libro ez dekowo. = 书在桌子上。' },
  { type: 'choice', typeLabel: '选择题', question: '"Wi dāske ni yo." 的中文翻译是什么？', options: ['我讨厌你。', '我喜欢你。', '我看见你。', '我认识你。'], answer: 1, explanation: 'dāske 意为"喜欢"（动词）。Wi dāske ni yo. = 我喜欢你。' },
  { type: 'choice', typeLabel: '选择题', question: '"Ŝi es belasā xovrino." 中 belasā 表示什么？', options: ['比较美', '一样美', '最美', '不太美'], answer: 2, explanation: '-sā 是最高级词尾，belasā 意为"最美的"。Ŝi es belasā xovrino. = 她是最美的女孩。' },
  { type: 'choice', typeLabel: '选择题', question: '"如果明天下雨，我就不去图书馆" 中"如果"的田语连词是？', options: ['sedo', 'gosi', 'rugo', 'vakan'], answer: 2, explanation: 'rugo 表示条件"如果"。Rugo togen xu yōge, wi neetoge libonio. = 如果明天下雨，我就不去图书馆。' },
  { type: 'choice', typeLabel: '选择题', question: '"Wi sōhutē kure ŝi\'p." 的中文翻译是什么？', options: ['我比她跑得快。', '我和她跑得一样快。', '我跑得最快。', '她跑得比我快。'], answer: 0, explanation: `sōhutē 中 -tē 是比较级，'p 是 par 的简写（比较基准）。Wi sōhutē kure ŝi'p. = 我比她跑得快。` },
  { type: 'choice', typeLabel: '选择题', question: '"Rēmide!" 的中文翻译是什么？', options: ['你好！', '再见！', '谢谢！', '加油！'], answer: 1, explanation: 'rēmide 是古有词（固有词），意为"再见，下次见"。' },
  { type: 'fill', typeLabel: '填空题', question: '"Wi pense gosi wi ez."（我思故我在）中，gosi 的意思是 ______', answer: '因此', placeholder: '请输入中文...', explanation: 'gosi 是因果连词，表示"因此"。Wi pense gosi wi ez. = 我思考，因此我存在 = 我思故我在。' },
  { type: 'fill', typeLabel: '填空题', question: '"Celon _____" 是田语中"请坐"的意思，请补全动词', answer: 'side', placeholder: '请输入田语...', explanation: 'celoŋ 是牵词"请"，side 是动词"坐"。Celon side! = 请坐！' }
]

const questionMap = {
  pronunciation: pronunciationQuestions,
  vocabulary: vocabularyQuestions,
  grammar: grammarQuestions,
  translation: translationQuestions
}

const modeTitleMap = {
  pronunciation: '发音练习',
  vocabulary: '词汇练习',
  grammar: '语法练习',
  translation: '翻译练习'
}

const currentQuestions = ref([])
const currentQuestion = computed(() => currentQuestions.value[currentIndex.value] || null)
const progressPercent = computed(() => currentQuestions.value.length > 0 ? ((currentIndex.value + 1) / currentQuestions.value.length) * 100 : 0)
const correctRate = computed(() => totalAnswered.value > 0 ? Math.round((correctCount.value / totalAnswered.value) * 100) : 0)

function startMode(mode) {
  activeMode.value = mode.id
  activeModeTitle.value = mode.title
  currentQuestions.value = [...questionMap[mode.id]]
  currentIndex.value = 0
  answered.value = false
  isCorrect.value = false
  userAnswer.value = ''
  selectedOption.value = -1
  correctCount.value = 0
  totalAnswered.value = 0
  showFinish.value = false
  userAnswers.value = new Array(currentQuestions.value.length).fill(null)
}

function selectOption(idx) {
  if (answered.value) return
  selectedOption.value = idx
  answered.value = true
  totalAnswered.value++
  isCorrect.value = idx === currentQuestion.value.answer
  if (isCorrect.value) correctCount.value++
  userAnswers.value[currentIndex.value] = { selected: idx, correct: isCorrect.value }
}

function submitFill() {
  if (answered.value || !userAnswer.value.trim()) return
  answered.value = true
  totalAnswered.value++
  const userAns = userAnswer.value.trim().toLowerCase()
  const correctAns = currentQuestion.value.answer.toLowerCase()
  isCorrect.value = userAns === correctAns
  if (isCorrect.value) correctCount.value++
  userAnswers.value[currentIndex.value] = { selected: userAnswer.value.trim(), correct: isCorrect.value }
}

function getOptionClass(idx) {
  if (!answered.value) return 'option-btn'
  if (idx === currentQuestion.value.answer) return 'option-btn correct'
  if (idx === selectedOption.value && !isCorrect.value) return 'option-btn wrong'
  return 'option-btn disabled'
}

function nextQuestion() {
  if (currentIndex.value < currentQuestions.value.length - 1) {
    currentIndex.value++
    answered.value = false
    isCorrect.value = false
    userAnswer.value = ''
    selectedOption.value = -1
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    const prev = userAnswers.value[currentIndex.value]
    if (prev) {
      answered.value = true
      isCorrect.value = prev.correct
      selectedOption.value = typeof prev.selected === 'number' ? prev.selected : -1
      userAnswer.value = typeof prev.selected === 'string' ? prev.selected : ''
    } else {
      answered.value = false
      isCorrect.value = false
      userAnswer.value = ''
      selectedOption.value = -1
    }
  }
}

function finishMode() {
  showFinish.value = true
}

function retryMode() {
  const modeId = activeMode.value
  activeMode.value = null
  showFinish.value = false
  setTimeout(() => {
    const mode = modes.value.find(m => m.id === modeId)
    if (mode) startMode(mode)
  }, 50)
}

function resetAll() {
  activeMode.value = null
  showFinish.value = false
  currentQuestions.value = []
  currentIndex.value = 0
  answered.value = false
  correctCount.value = 0
  totalAnswered.value = 0
  userAnswers.value = []
}
</script>