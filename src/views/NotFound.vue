<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>页面未找到</h1>
        <p>你似乎迷失在了琳凯蒂亚星球的某个角落...</p>
        <p class="sub-text">这颗星球很大，也许你想回到熟悉的地方？</p>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex; align-items: center; justify-content: center;
  min-height: calc(100vh - 200px);
}
.not-found-content { text-align: center; }
.error-code {
  font-size: 120px; font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.not-found-content h1 { color: #fff; margin-bottom: 12px; }
.not-found-content p { color: #aaa; margin-bottom: 8px; }
.sub-text { color: #666; font-size: 14px; margin-bottom: 24px; }
</style>