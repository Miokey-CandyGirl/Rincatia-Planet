<template>
  <div class="business-page">
    <div class="container">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">商务往来与合作</h1>
        <p class="page-subtitle">琳凯蒂亚星球 IP 开放多种商业合作模式，携手共创奇幻世界</p>
        <p class="page-university" style="font-size: 20px; font-weight: bold;">华田中央大学艾米商学院</p>
      </header>

      <!-- 导航标签 -->
      <nav class="business-nav">
        <button class="nav-tab" :class="{ active: activeTab === 'cooperation' }" @click="activeTab = 'cooperation'">
          <span class="tab-icon">🤝</span>
          <span class="tab-label">合作介绍</span>
        </button>
        <button class="nav-tab" :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">
          <span class="tab-icon">🛍️</span>
          <span class="tab-label">周边产品</span>
        </button>
        <button class="nav-tab" :class="{ active: activeTab === 'license' }" @click="activeTab = 'license'">
          <span class="tab-icon">📋</span>
          <span class="tab-label">授权信息</span>
        </button>
        <button class="nav-tab" :class="{ active: activeTab === 'contact' }" @click="activeTab = 'contact'">
          <span class="tab-icon">📬</span>
          <span class="tab-label">联系我们</span>
        </button>
      </nav>

      <!-- ==================== 合作介绍 ==================== -->
      <section v-if="activeTab === 'cooperation'" class="business-section">
        <h2 class="section-title">
          <span class="section-icon">🤝</span>商业合作模式
        </h2>
        <p class="section-desc">
          琳凯蒂亚星球作为《光线传奇》系列作品的宏大世界观 IP，拥有丰富的文化内容与视觉资产。
          我们开放多种商业合作模式，欢迎品牌方、创作者与合作伙伴共同探索琳凯蒂亚的无限可能。
        </p>
        <div class="cooperation-grid">
          <div class="cooperation-card">
            <span class="card-icon">🎨</span>
            <h3 class="card-title">品牌联名</h3>
            <p class="card-desc">与琳凯蒂亚 IP 进行品牌联名合作，推出联名产品、限定包装等，借助 IP 影响力提升品牌价值。</p>
          </div>
          <div class="cooperation-card">
            <span class="card-icon">📖</span>
            <h3 class="card-title">内容授权</h3>
            <p class="card-desc">授权使用琳凯蒂亚世界观、角色、故事等内容进行二次创作，包括小说、漫画、动画等衍生作品。</p>
          </div>
          <div class="cooperation-card">
            <span class="card-icon">🎮</span>
            <h3 class="card-title">游戏开发</h3>
            <p class="card-desc">基于琳凯蒂亚世界观进行游戏开发合作，涵盖手游、端游、桌游等多种游戏类型。</p>
          </div>
          <div class="cooperation-card">
            <span class="card-icon">🎬</span>
            <h3 class="card-title">影视改编</h3>
            <p class="card-desc">将《光线传奇》系列作品改编为动画、电影、电视剧等影视作品，共同打造视觉盛宴。</p>
          </div>
          <div class="cooperation-card">
            <span class="card-icon">👕</span>
            <h3 class="card-title">周边开发</h3>
            <p class="card-desc">授权开发琳凯蒂亚主题周边产品，包括服饰、文具、家居、饰品等多元化商品。</p>
          </div>
          <div class="cooperation-card">
            <span class="card-icon">🎓</span>
            <h3 class="card-title">教育合作</h3>
            <p class="card-desc">基于琳凯蒂亚语（田语）开展语言教育合作，开发教材、课程及线上学习平台。</p>
          </div>
        </div>
      </section>

      <!-- ==================== 周边产品 ==================== -->
      <section v-if="activeTab === 'products'" class="business-section">
        <h2 class="section-title">
          <span class="section-icon">🛍️</span>周边产品
        </h2>
        <p class="section-desc">
          琳凯蒂亚主题周边产品，将奇幻世界的魅力带入现实生活。每一件产品都承载着琳凯蒂亚的文化与故事。
        </p>
        <div class="product-grid">
          <div class="product-card">
            <div class="product-image">📖</div>
            <div class="product-info">
              <h3 class="product-name">琳凯蒂亚语入门教材</h3>
              <p class="product-desc">《现代琳凯蒂亚语 v26.5》系列教材，系统学习田语发音、词汇与语法。</p>
              <span class="product-price">¥29.00</span>
            </div>
          </div>
          <div class="product-card">
            <span class="product-badge">新品</span>
            <div class="product-image">🔮</div>
            <div class="product-info">
              <h3 class="product-name">星晶水晶球</h3>
              <p class="product-desc">琳凯蒂亚主题水晶球，内嵌双月交辉光效，精美摆件。</p>
              <span class="product-price">¥128.00</span>
            </div>
          </div>
          <div class="product-card">
            <div class="product-image">🏳️</div>
            <div class="product-info">
              <h3 class="product-name">琳凯蒂亚国旗徽章</h3>
              <p class="product-desc">琳凯蒂亚联邦共和国国旗金属徽章，精致烤漆工艺。</p>
              <span class="product-price">¥69.00</span>
            </div>
          </div>
          <div class="product-card">
            <span class="product-badge">热卖</span>
            <div class="product-image">📑</div>
            <div class="product-info">
              <h3 class="product-name">星法塔魔法书签</h3>
              <p class="product-desc">星法塔造型金属书签，镂空雕刻工艺，精致实用。</p>
              <span class="product-price">¥26.00</span>
            </div>
          </div>
          <div class="product-card">
            <div class="product-image">📓</div>
            <div class="product-info">
              <h3 class="product-name">双月交辉笔记本</h3>
              <p class="product-desc">金月与银月主题封面笔记本，内页印有田语字母表。</p>
              <span class="product-price">¥39.00</span>
            </div>
          </div>
          <div class="product-card">
            <div class="product-image">🌈</div>
            <div class="product-info">
              <h3 class="product-name">彩虹水晶手链</h3>
              <p class="product-desc">七色水晶手链，对应七颗彩虹水晶守护者，精美礼盒装。</p>
              <span class="product-price">¥88.00</span>
            </div>
          </div>
          <div class="product-card">
            <div class="product-image">🧸</div>
            <div class="product-info">
              <h3 class="product-name">妙可公主毛绒公仔</h3>
              <p class="product-desc">琳凯蒂亚公主妙可形象毛绒公仔，柔软亲肤面料。</p>
              <span class="product-price">¥279.00</span>
            </div>
          </div>
          <div class="product-card">
            <div class="product-image">🎴</div>
            <div class="product-info">
              <h3 class="product-name">角色收藏卡</h3>
              <p class="product-desc">《光线传奇》主要角色收藏卡套装，含角色介绍与能力值。</p>
              <span class="product-price">¥79.00</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== 授权信息 ==================== -->
      <section v-if="activeTab === 'license'" class="business-section">
        <h2 class="section-title">
          <span class="section-icon">📋</span>IP 授权信息
        </h2>
        <p class="section-desc">
          琳凯蒂亚星球 IP 包含《光线传奇》系列作品（彩虹水晶、星陨之战、归零审判）及衍生作品的全部著作权。
          我们提供灵活的授权方案，满足不同规模合作伙伴的需求。
        </p>
        <div class="license-grid">
          <div class="license-card">
            <h3 class="license-title">个人创作者授权</h3>
            <p class="license-desc">面向个人创作者的非商业性二次创作授权，包括同人作品、插画、短篇创作等。</p>
            <span class="license-term">授权期限：1年</span>
          </div>
          <div class="license-card">
            <h3 class="license-title">小型商业授权</h3>
            <p class="license-desc">面向小型工作室或独立品牌的商业授权，适用于小批量周边产品开发与销售。</p>
            <span class="license-term">授权期限：1-2年</span>
          </div>
          <div class="license-card">
            <h3 class="license-title">品牌联名授权</h3>
            <p class="license-desc">面向中大型品牌的联名合作授权，包括产品联名、主题空间、线下活动等。</p>
            <span class="license-term">授权期限：1-3年</span>
          </div>
          <div class="license-card">
            <h3 class="license-title">影视改编授权</h3>
            <p class="license-desc">面向影视制作公司的改编授权，包括动画、电影、电视剧等形式的改编制作。</p>
            <span class="license-term">授权期限：按项目协商</span>
          </div>
          <div class="license-card">
            <h3 class="license-title">游戏开发授权</h3>
            <p class="license-desc">面向游戏开发公司的游戏改编授权，可使用琳凯蒂亚世界观进行游戏创作。</p>
            <span class="license-term">授权期限：按项目协商</span>
          </div>
          <div class="license-card">
            <h3 class="license-title">教育出版授权</h3>
            <p class="license-desc">面向教育机构与出版社的授权，开发琳凯蒂亚语教材、学习资料等教育产品。</p>
            <span class="license-term">授权期限：2-5年</span>
          </div>
        </div>
      </section>

      <!-- ==================== 联系我们 ==================== -->
      <section v-if="activeTab === 'contact'" class="business-section">
        <h2 class="section-title">
          <span class="section-icon">📬</span>联系我们
        </h2>
        <p class="section-desc">
          如有商业合作意向，欢迎通过以下方式联系我们。我们将在收到信息后尽快与您取得联系。
        </p>
        <div class="contact-grid">
          <div class="contact-card">
            <span class="contact-icon">📧</span>
            <div class="contact-label">电子邮箱</div>
            <div class="contact-value">1778181360@qq.com</div>
          </div>
          <div class="contact-card">
            <span class="contact-icon">💬</span>
            <div class="contact-label">QQ 交流群</div>
            <div class="contact-value">515385616</div>
          </div>
          <div class="contact-card">
            <span class="contact-icon">🏫</span>
            <div class="contact-label">所属机构</div>
            <div class="contact-value">华田中央大学艾米商学院</div>
          </div>
          <div class="contact-card">
            <span class="contact-icon">🌐</span>
            <div class="contact-label">官方网站</div>
            <div class="contact-value">琳凯蒂亚星球官网</div>
          </div>
        </div>

        <!-- 合作意向表单 -->
        <div class="contact-form">
          <h3 class="form-title">提交合作意向</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">您的姓名 / 机构名称</label>
              <input class="form-input" type="text" placeholder="请输入姓名或机构名称" />
            </div>
            <div class="form-group">
              <label class="form-label">联系邮箱</label>
              <input class="form-input" type="email" placeholder="请输入联系邮箱" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">合作类型</label>
              <input class="form-input" type="text" placeholder="如：品牌联名、周边开发、内容授权等" />
            </div>
            <div class="form-group">
              <label class="form-label">联系电话</label>
              <input class="form-input" type="tel" placeholder="请输入联系电话（选填）" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">合作意向说明</label>
            <textarea class="form-textarea" placeholder="请详细描述您的合作意向、项目规模及预期目标..."></textarea>
          </div>
          <button class="form-submit" type="button">提交合作意向</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('cooperation')
</script>

<style>
@import '@/assets/styles/business.css';
</style>