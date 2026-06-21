<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero">
      <!-- 漂浮元素 -->
      <div class="floating-elements">
        <div class="floating-crystal crystal-1"></div>
        <div class="floating-crystal crystal-2"></div>
        <div class="floating-crystal crystal-3"></div>
        <div class="magic-particle particle-1"></div>
        <div class="magic-particle particle-2"></div>
        <div class="magic-particle particle-3"></div>
      </div>

      <div class="hero-content">
        <div class="planet-container">
          <div class="planet">
            <div class="planet-ring"></div>
            <div class="planet-surface"></div>
          </div>
        </div>
        <div class="hero-text">
          <div class="hero-flag-display">
            <img src="/rincatian-flag.png" alt="琳凯蒂亚联邦共和国国旗" class="hero-flag">
            <div class="flag-description">琳凯蒂亚联邦共和国国旗</div>
          </div>
          <h1 class="hero-title">欢迎您来到琳凯蒂亚星球</h1>
          <p class="hero-subtitle">探索《光线传奇》中的宏大世界！</p>
          <p class="hero-description">
            在这颗被彩虹恒久包裹的星球上，每一处都流淌着魔法的气息；<br>
            银蓝色的铃铛树轻抚着流光云，双月在星法塔顶交织成彩虹光环。<br>
            让我们共同进入琳凯蒂亚的异星世界吧！
          </p>
          <div class="hero-buttons">
            <router-link to="/Rincatian" class="btn btn-primary">学习田语</router-link>
            <router-link to="/world" class="btn btn-secondary">探索世界</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 世界奇观 ==================== -->
    <section class="wonders-section home-section">
      <div class="container">
        <h2 class="section-title">琳凯蒂亚星球的奇妙之处</h2>
        <p class="section-subtitle">在这颗被彩虹恒久包裹的星球上，每一处都流淌着魔法的气息</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🌙</div>
            <h3>双月之光</h3>
            <p>银月如铜镜，金月似蜜浸，每月十五交叠成彩虹光环，照耀着这门古老的语言</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔮</div>
            <h3>星晶之语</h3>
            <p>语言如星晶山脉般透明纯净，每个音节都散发着七色彩霞的光芒</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌸</div>
            <h3>回声花田</h3>
            <p>如回声花般保存着古老的歌谣，每个词汇都承载着琳凯蒂亚的记忆</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 世界 ==================== -->
    <section class="world-section home-section">
      <div class="container">
        <h2 class="section-title">探索琳凯蒂亚世界</h2>
        <p class="section-subtitle">探索琳凯蒂亚星球壮丽的地理、悠久的历史与多元的种族文化</p>
        <div class="home-grid-4">
          <div class="home-grid-card" v-for="item in worldItems" :key="item.id">
            <div class="home-grid-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
        <div class="section-action">
          <router-link to="/world" class="btn btn-primary">探索世界全貌</router-link>
        </div>
      </div>
    </section>

    <!-- ==================== 田语 ==================== -->
    <section class="rincatian-section home-section">
      <div class="container">
        <h2 class="section-title">现代琳凯蒂亚语（田语）</h2>
        <p class="section-subtitle">琳凯蒂亚星球的语言，每个音节都流淌着魔法的气息</p>
        <div class="features-grid">
          <router-link to="/Rincatian/grammar" class="feature-card feature-card-link">
            <div class="feature-icon">📝</div>
            <h3>语法体系</h3>
            <p>田语拥有独特的语法结构，包括示词、体貌、结语，每一句都如诗歌般优美</p>
          </router-link>
          <router-link to="/Rincatian/vocabulary" class="feature-card feature-card-link">
            <div class="feature-icon">📚</div>
            <h3>词汇宝库</h3>
            <p>丰富的词汇系统，覆盖日常交流、魔法咒语、星象命名等各个领域</p>
          </router-link>
          <router-link to="/Rincatian/phonetics" class="feature-card feature-card-link">
            <div class="feature-icon">🔊</div>
            <h3>发音指南</h3>
            <p>41个字母，标准发音，点击即可听取，让每个音节都闪耀星晶的光芒</p>
          </router-link>
        </div>

        <!-- 每日一词（置于田语） -->
        <div class="daily-word-wrapper">
          <div class="daily-word-card" ref="dailyWordCard">
            <div class="daily-word-header">
              <h2>每日一词</h2>
              <span class="word-date">{{ formattedGregDate }}</span>
            </div>
            <div class="daily-word-content">
              <div class="word-main">
                <div class="word-linkaitiya">{{ currentWord.linkaitiya }}</div>
                <div class="word-pronunciation">{{ currentWord.pronunciation }}</div>
              </div>
              <div class="word-meaning">
                <div class="word-chinese">{{ currentWord.chinese }}</div>
                <span class="word-type">{{ currentWord.type }}</span>
              </div>
              <div class="word-example">
                <p class="example-linkaitiya">{{ currentWord.example }}</p>
                <p class="example-chinese">{{ currentWord.exampleChinese }}</p>
              </div>
            </div>
            <div class="daily-word-actions">
              <button class="btn btn-primary btn-small" @click="refreshWord">换一个</button>
              <router-link to="/dictionary" class="btn btn-outline btn-small">了解更多</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 商务 ==================== -->
    <section class="business-section home-section">
      <div class="container">
        <h2 class="section-title">一起进行影视化创作</h2>
        <p class="section-subtitle">琳凯蒂亚星球 IP 开放多种商业合作模式，共创魔法商业新纪元</p>
        <div class="product-showcase">
          <div class="product-card" v-for="product in products" :key="product.name">
            <div class="product-icon">{{ product.icon }}</div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.desc }}</p>
          </div>
        </div>
        <div class="section-action">
          <router-link to="/business" class="btn btn-primary">了解更多合作</router-link>
        </div>
      </div>
    </section>

    <!-- ==================== 社区 ==================== -->
    <section class="community-section home-section">
      <div class="container">
        <h2 class="section-title">社区活动与资源下载</h2>
        <p class="section-subtitle">加入琳凯蒂亚居民的行列，与全球学习者交流分享</p>
        <div class="community-highlights">
          <div class="community-stat-card" v-for="stat in communityStats" :key="stat.label">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
        <div class="community-preview">
          <div class="preview-card" v-for="topic in communityTopics" :key="topic.id">
            <div class="preview-icon">{{ topic.icon }}</div>
            <div class="preview-text">
              <h4>{{ topic.title }}</h4>
              <p>{{ topic.desc }}</p>
            </div>
          </div>
        </div>
        <div class="section-action">
          <router-link to="/community" class="btn btn-primary">进入社区</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTianCalendar } from '@/composables/useTianCalendar'

const router = useRouter()
const { tianDate, formattedDate } = useTianCalendar()

const dailyWordCard = ref(null)

// 每日一词数据
const dailyWords = [
  {
    linkaitiya: 'lātiŋ',
    pronunciation: '[lai ting]',
    chinese: '光，光线',
    type: '名词',
    example: 'lātiŋe lātiŋ！',
    exampleChinese: '释放光线！'
  },
  {
    linkaitiya: 'sēgā',
    pronunciation: '[sei gai]',
    chinese: '世界，星球',
    type: '名词',
    example: 'bela sēgā',
    exampleChinese: '美丽的星球'
  },
  {
    linkaitiya: 'bela',
    pronunciation: '[be la]',
    chinese: '美丽的',
    type: '形容词',
    example: 'bela nim luno',
    exampleChinese: '美丽的双月'
  },
  {
    linkaitiya: 'sose',
    pronunciation: '[so se]',
    chinese: '学习',
    type: '动词',
    example: 'wi sose Rincatian',
    exampleChinese: '我学习琳凯蒂亚语'
  },
  {
    linkaitiya: 'luno',
    pronunciation: '[lu no]',
    chinese: '月亮，月球',
    type: '名词',
    example: 'nim luno\'ô lātiŋe',
    exampleChinese: '双月闪耀'
  }
]

const currentWord = ref({ ...dailyWords[0] })

const formattedGregDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

function refreshWord() {
  const randomIndex = Math.floor(Math.random() * dailyWords.length)
  currentWord.value = { ...dailyWords[randomIndex] }
  if (dailyWordCard.value) {
    dailyWordCard.value.style.transform = 'scale(0.95)'
    setTimeout(() => { dailyWordCard.value.style.transform = 'scale(1)' }, 150)
  }
}

// 世界板块数据
const worldItems = [
  { id: 1, icon: '🌍', title: '世界观', desc: '一颗被彩虹恒久包裹的魔法星球，双月交叠，星晶山脉闪耀' },
  { id: 2, icon: '🏔️', title: '地理', desc: '星晶山脉、回声花田、铃铛森林…探索琳凯蒂亚的奇特地貌' },
  { id: 3, icon: '📜', title: '历史', desc: '从华田元年至今，历经星法塔建立、双月战争等重大事件' },
  { id: 4, icon: '👥', title: '种族', desc: '光线使者、星晶族、回声花灵…多元种族共存于这颗魔法星球' }
]

// 商务板块数据
const products = [
  { icon: '🎨', name: '品牌联名', desc: '与琳凯蒂亚星球 IP 进行品牌联名合作' },
  { icon: '📦', name: '周边产品', desc: '开发琳凯蒂亚主题的周边商品' },
  { icon: '📄', name: '内容授权', desc: '获取琳凯蒂亚世界观的授权使用' }
]

// 社区板块数据
const communityStats = [
  { value: '1,000+', label: '注册居民' },
  { value: '500+', label: '讨论帖子' },
  { value: '200+', label: '学习资源' }
]

const communityTopics = [
  { id: 1, icon: '💬', title: '学习交流', desc: '分享学习心得，讨论语法难点' },
  { id: 2, icon: '🎉', title: '文化活动', desc: '参与琳凯蒂亚节日庆典' },
  { id: 3, icon: '🌟', title: '创作分享', desc: '展示你的田语创作和翻译作品' }
]

const navigateTo = (path) => { if (path) router.push(path) }

onMounted(() => {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  currentWord.value = { ...dailyWords[dayOfYear % dailyWords.length] }
})
</script>