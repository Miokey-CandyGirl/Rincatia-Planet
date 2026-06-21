<template>
  <div class="sub-page">
    <div class="page-header">
      <h2 class="sub-page-title">彩虹水晶</h2>
      <p class="sub-page-desc">《光线传奇》第一部——七位守护者与彩虹水晶的奇幻冒险</p>
    </div>

    <!-- 页面内子导航 -->
    <div class="sub-nav-tabs">
      <button class="sub-nav-tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">故事概述</button>
      <button class="sub-nav-tab" :class="{ active: activeTab === 'episodes' }" @click="activeTab = 'episodes'">分集概述</button>
      <button class="sub-nav-tab" :class="{ active: activeTab === 'characters' }" @click="activeTab = 'characters'">人物志</button>
    </div>

    <!-- 故事概述 -->
    <section v-if="activeTab === 'overview'">
      <div class="story-overview">
        <p><span class="highlight">《光线传奇》（Light Legend）</span>是由中国作家林倾雨创作的一部长篇奇幻科幻小说，系列主体包含三部正传及多部衍生作品。</p>
        <p>小说的世界观建立在「地球」与「琳凯蒂亚」两个星球的宿命纠缠之上。地球一侧，是合肥老城鲜活具体的市井日常；琳凯蒂亚一侧，则是粉紫色天空下流淌着蜂蜜色溪流的梦幻异星。两个世界通过灵质、水晶与守护者的血脉紧密交织。</p>
        <p>故事的核心冲突，既源于琳凯蒂亚因星陨之战造就的长达八百年的内部政变阴谋，也指向宇宙深处更大的未知威胁。小说探讨了一个核心命题：当一个人的身体、身份与命运被彻底击碎后，如何在日常的爱与羁绊中重新拼合自己。</p>
      </div>

      <div class="section-card">
        <h3>📖 第一部《彩虹水晶》故事简介</h3>
        <div class="story-overview">
          <p>第一部《光线传奇之彩虹水晶》始于<span class="highlight">2015年8月25日</span>，合肥一中高二学生田野在小区楼下被两道来自外星的冰蓝与灰黑色光箭射中，体内潜藏的七颗彩虹水晶四散飞落，而他在琳凯蒂亚星球守护者「星使」的金光修复下，从一个18岁的少年变成约6岁的金发蓝眼女孩。</p>
          <p>这场离奇的变故彻底颠覆了田野的人生，他被迫以全新的身份<span class="highlight">「妙可」</span>重新面对世界，一边适应这具陌生的身体，一边踏上寻找散落水晶、唤醒同伴、对抗外星叛逆者的征途。</p>
          <p>第一部聚焦田野变身为妙可后的日常生活与重新成长，她从被家人接纳、被班主任薛老师以一道化学题认出、到中秋之夜在老家满月下获得短暂喘息。在这场跨越日常与奇幻的冒险中，妙可与儿时伙伴丽丽重逢，两人结伴踏上了收集七颗彩虹水晶、寻找同伴并将他们一一唤醒的旅程。</p>
          <p>第一部《彩虹水晶》致敬了《哈利·波特》和《魔卡少女樱》，是关于勇气、友谊与文化交融的奇幻冒险。它既有寻找神器的经典叙事，也有对身份认同、家庭羁绊与成长代价的细腻书写。</p>
        </div>
      </div>
    </section>

    <!-- 分集概述 -->
    <section v-if="activeTab === 'episodes'">
      <div class="section-card">
        <h3>📺 分集标题（共50集）</h3>
        <div class="world-card">
          <h3>适应篇</h3>
          <p><strong>第一集《彩虹落地的瞬间》</strong>——2015年8月25日下午，18岁少年田野被外星叛逆者的光箭射中，体内七颗彩虹水晶四散飞落，星使爷爷将其转化为约6岁的金发女孩。</p>
          <p><strong>第二集《微光里的适应》</strong>——田野在变身第二天苏醒，确认自己已变成金发蓝眼的新疆面孔小女孩，在母亲用往事安抚下重获依靠感，深夜被金色星光托入高空，穿越纯白空间抵达梦幻异星琳凯蒂亚。</p>
          <p><strong>第三集《当月空的星河闪耀时》</strong>——田野变身第三天，在父母陪同下登门拜访班主任薛老师，以化学题证明自己身份。田父以「妙可」之名——源自milky way的谐音——为她正式赐予新名字。</p>
        </div>
        <div class="world-card">
          <h3>人物拓展篇</h3>
          <p><strong>第四集《儿时伙伴的重逢》</strong>——变成六岁女孩的田妙可在星虹中学操场外偶遇童年挚友丽丽，丽丽在危急时刻觉醒星力。星帝星母在琳凯蒂亚水晶球中见证女儿归来。</p>
          <p><strong>第五集《在暴风雨中的少女》</strong>——2015年9月，少女梦云因中考失利与家庭决裂，被外星叛逆者拉拢。妙可与丽丽展开寻找，但梦云已在韩斌精心设计的虚荣中越陷越深。</p>
          <p><strong>第六集《故乡的明月》</strong>——在连绵阴雨二十五天后，妙可中秋与家人回到农村老家，在满月下获得短暂喘息。次日月全食时分，姐姐梦雪突然晕倒。</p>
        </div>
        <div class="world-card">
          <h3>后续篇章</h3>
          <p>世界观第一次拓宽篇（第七~十一集）、情感篇（第十二~十六集）、灾难篇（第十七~十九集）、儿时篇（第二十~二十四集）、微世界+星空篇（第二十五~二十六集）、古代篇（第二十七~三十一集）……共50集。</p>
        </div>
      </div>
    </section>

    <!-- 人物志 -->
    <section v-if="activeTab === 'characters'">
      <div class="section-card">
        <h3>👤 七位彩虹水晶守护者（第6代）</h3>
        <div class="character-grid">
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar hero">☀️</div>
              <div>
                <div class="character-name">田妙可（田野）</div>
                <div class="character-role">太阳（光）使者 · 红色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">预言中打破循环的核心人物，琳凯蒂亚公主。2015年8月25日正式觉醒。灵魂18岁，身体6岁，深金色卷曲长发，蓝色眼睛，额间有太阳印记。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar hero">⚡</div>
              <div>
                <div class="character-name">刘俊（俊哥）</div>
                <div class="character-role">电磁使者 · 绿色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">最早抵达地球的守护者，1990年转世，2008年首次觉醒。25岁，电力工程师，踏实靠谱，默默付出。梦雪的丈夫。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar hero">🌙</div>
              <div>
                <div class="character-name">田梦雪（露娜）</div>
                <div class="character-role">月光使者 · 黄色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">22岁，开朗体贴，田妙可的姐姐。2009年日全食觉醒被困，2015年中秋意识链接，唯一经历过长时间半觉醒状态的成员。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar hero">⭐</div>
              <div>
                <div class="character-name">丽丽（黛拉）</div>
                <div class="character-role">星星（星辰）使者 · 紫色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">15岁，星虹中学高一新生，妙可的童年挚友。2015年9月9日正式觉醒，觉醒后前往中国北方，是守护者阵营的核心成员。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar villain">💧</div>
              <div>
                <div class="character-name">韩斌（云雨/古劳奇）</div>
                <div class="character-role">水/气使者 · 青色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">17岁，合肥一中高二学生。2015年8月被外星叛逆者「古劳奇」附身，走向与守护者对立，是「走错路的自己人」。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar villain">⏳</div>
              <div>
                <div class="character-name">俊伟（时空/泰倍斯）</div>
                <div class="character-role">时空使者 · 蓝色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">18岁，无业游民。2015年8月被外星叛逆者「时空」附身，阴鸷冷酷，心机深沉，计划坐收渔翁之利抢夺七颗彩虹水晶。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar hero">🌪️</div>
              <div>
                <div class="character-name">蔡啸林</div>
                <div class="character-role">风尘使者 · 橙色水晶守护者</div>
              </div>
            </div>
            <div class="character-info">2016年正式登场，最后一位觉醒的守护者，补齐了七位守护者的完整阵营。</div>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h3>👤 主要配角</h3>
        <div class="character-grid">
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar neutral">👴</div>
              <div>
                <div class="character-name">星使爷爷</div>
                <div class="character-role">琳凯蒂亚星球守护者</div>
              </div>
            </div>
            <div class="character-info">须发皆白、身披流光银袍、手持木质法杖。在田野被光箭射中后及时出现，用金光修复其身体并转化为6岁女孩，是妙可的使命引导者。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar neutral">❤️</div>
              <div>
                <div class="character-name">白雪</div>
                <div class="character-role">田野女友</div>
              </div>
            </div>
            <div class="character-info">17岁，合肥一中高二学生，相貌可爱，温柔敏感，体内含红色水晶。擅长整理复习资料，对妙可的异常隐隐察觉却不敢相信。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar neutral">👨‍🏫</div>
              <div>
                <div class="character-name">薛老师</div>
                <div class="character-role">班主任</div>
              </div>
            </div>
            <div class="character-info">45岁，教龄22年，正直护短，理性务实。是第一个接纳田野变身真相的外人，承诺单独送卷、辅导学业，全力守护妙可的高考之路。</div>
          </div>
          <div class="character-card">
            <div class="character-header">
              <div class="character-avatar neutral">👨</div>
              <div>
                <div class="character-name">昊天</div>
                <div class="character-role">田野最好的兄弟</div>
              </div>
            </div>
            <div class="character-info">18岁，大大咧咧，重情重义，球技好。和妙可约定一起考上南京大学，球场铁三角之一。</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('overview')
</script>