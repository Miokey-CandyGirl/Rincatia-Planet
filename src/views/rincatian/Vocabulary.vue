<template>
  <div class="sub-page vocabulary-page">
    <div class="page-header">
      <h2 class="sub-page-title">词汇查询</h2>
      <p class="sub-page-desc">搜索琳凯蒂亚语词汇，支持田语↔中文双向查询，涵盖规则2、2-1、2-2、2-3。</p>
      <a href="https://baike.baidu.com/item/%E7%90%B3%E5%87%AF%E8%92%82%E4%BA%9A%E8%AF%AD/66751047" target="_blank" class="baike-link" title="在百度百科查看琳凯蒂亚语">📖 在百度百科查看琳凯蒂亚语 →</a>
    </div>

    <!-- 搜索框 -->
    <div class="vocab-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="输入田语或中文关键词搜索..."
        class="search-input"
        @input="onSearch"
      />
      <span class="search-icon">🔍</span>
    </div>

    <!-- 分类筛选 -->
    <div class="vocab-filters">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- 词汇列表 -->
    <div class="vocab-list" v-if="filteredWords.length > 0">
      <div class="vocab-card" v-for="word in filteredWords" :key="word.id">
        <div class="vocab-main"><span class="rincatian-text">{{ word.rincatian }}</span></div>
        <div class="vocab-pron"><span class="phonetic-text">{{ word.pronunciation }}</span></div>
        <div class="vocab-meaning">{{ word.chinese }}</div>
        <span class="vocab-type">{{ word.type }}</span>
      </div>
    </div>
    <div v-else-if="searchQuery" class="empty-state">
      未找到匹配「{{ searchQuery }}」的词汇，请尝试其他关键词
    </div>

    <!-- 规则2：词语分类 -->
    <div class="section-card">
      <h3>规则2：词语分类（Vorto）</h3>
      <p>田语词语按<strong>数量</strong>分为有限词与无限词两大类，按<strong>来源</strong>分为古有词、外来词与标准词三类。</p>

      <h4>2.1 有限词与无限词</h4>
      <div class="rule-table-wrap">
        <table class="rule-table">
          <thead><tr><th>类型</th><th>包含词类</th><th>特征</th></tr></thead>
          <tbody>
            <tr><td>有限词</td><td>代词、数词、连词、示词、抒情词</td><td>封闭类，无词尾变化，不参与词根派生</td></tr>
            <tr><td>无限词</td><td>名词、动词、形容词、副词、声叹词</td><td>开放类，有词尾变化，源自2000词根表</td></tr>
          </tbody>
        </table>
      </div>
      <p class="rule-note">有限词不遵循无限词的词尾变化规则。例如 caŋ 作为整体代词，可直接修饰名词（caŋ woriso 所有烦恼），无需添加形容词词性词缀。</p>

      <h4>2.2 外来词、古有词与标准词</h4>
      <div class="rule-table-wrap">
        <table class="rule-table">
          <thead><tr><th>类型</th><th>说明</th><th>示例</th></tr></thead>
          <tbody>
            <tr><td>外来词</td><td>依田语语音规则转写的外语借词，语意可能变化</td><td>ĉate v.聊天（←英语 chat）</td></tr>
            <tr><td>古有词</td><td>固定短语或固有词（类似汉语成语）</td><td>ginmō n.加油；gaŋdyodene 说的也是</td></tr>
            <tr><td>标准词</td><td>田语规定且固定的2000个词根</td><td>nomo n.姓名；nome v.命名</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 词语再分类 -->
    <div class="section-card">
      <h4>2.2 词语的再分类</h4>

      <div class="sub-section">
        <h5>动词分类（5种）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>类型</th><th>说明</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>位移动词</td><td>有物理位移或具体动作</td><td>eto 前往，tabe 吃</td></tr>
              <tr><td>心理动词</td><td>从具体动词抽象出的心理活动</td><td>dāske 喜欢，pense 思考</td></tr>
              <tr><td>系动词</td><td>连接主语与宾语，表判断或存在</td><td>es 是，ez 有/在</td></tr>
              <tr><td>形容动词</td><td>形容词+体词尾，表"变成"</td><td>putize 正在变紫</td></tr>
              <tr><td>名动词</td><td>名词+体词尾，表"成为"</td><td>sensejiarlē 成为教师</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>名词分类</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>类型</th><th>说明</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>普通名词</td><td>需名词词性词缀（除古有词）</td><td>libo 书，sosenio 学校</td></tr>
              <tr><td>量名词</td><td>表示计量单位</td><td>foyo 次，peco 片</td></tr>
              <tr><td>专属名词</td><td>无需名词词性词缀</td><td>ẐaŋXioHôŋ 张晓航</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>词尾系统</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>词尾类型</th><th>附着对象</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>集群词尾 -on</td><td>名词</td><td>表"们、群"</td><td>soseon 学生们</td></tr>
              <tr><td>方位词尾</td><td>名词</td><td>构成空间名词</td><td>dekowo 桌子上</td></tr>
              <tr><td>趋向词尾</td><td>动词</td><td>表位移方向</td><td>elā 来，eto 去</td></tr>
              <tr><td>体词尾</td><td>动词</td><td>表动作时间状态</td><td>libele 写过，libelē 写完了</td></tr>
              <tr><td>比较词尾</td><td>辅词</td><td>表比较等级</td><td>belatē 更美，belasā 最美</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>构词法公式</h5>
        <div class="formula-box">
          <p class="formula">单词 =（前缀）+ 词根/派生词 +（后缀）</p>
        </div>
        <p>词根数量唯一，前缀、后缀、派生词数量不限。词缀为构词范畴，非语法标记。</p>
        <div class="example-box">
          <p><strong>示例：</strong>bel-（美）→ bela（美丽的）→ mubela（丑的）→ kebele（使美丽）→ kebelenio（美容院）→ kebelejiar（美容师）</p>
        </div>
      </div>
    </div>

    <!-- 规则2-1：词缀 -->
    <div class="section-card">
      <h3>规则2-1：词缀（Afikso）</h3>

      <div class="sub-section">
        <h5>级别前缀（5个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>前缀</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>pō-</td><td>特低</td><td>pōbela 极丑的</td></tr>
              <tr><td>p-</td><td>低</td><td>pbela 不太美的</td></tr>
              <tr><td>c-</td><td>一般</td><td>cbela 普通的</td></tr>
              <tr><td>b-</td><td>高</td><td>bbela 很美的</td></tr>
              <tr><td>bō-</td><td>特高</td><td>bōbela 极美的</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>通用前缀（13个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>前缀</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>mu-</td><td>正→负（反义）</td><td>mubela 丑的（←bela 美）</td></tr>
              <tr><td>ne-</td><td>否定</td><td>netabe 不吃</td></tr>
              <tr><td>ke-</td><td>使动</td><td>kebele 使美丽</td></tr>
              <tr><td>he-</td><td>自动</td><td>hepure 自洁</td></tr>
              <tr><td>rē-</td><td>重复</td><td>rēlibe 重写</td></tr>
              <tr><td>ce-</td><td>强调</td><td>cebela 非常美</td></tr>
              <tr><td>sam-</td><td>相互</td><td>samhelpe 互相帮助</td></tr>
              <tr><td>fin-</td><td>完成</td><td>finlibe 写完</td></tr>
              <tr><td>dis-</td><td>分离</td><td>dispone 分发</td></tr>
              <tr><td>kon-</td><td>共同</td><td>konvinke 说服</td></tr>
              <tr><td>pol-</td><td>多</td><td>poltabe 多吃</td></tr>
              <tr><td>bjol-</td><td>努力</td><td>bjollibe 努力写</td></tr>
              <tr><td>yol-</td><td>容易</td><td>yollibe 容易写</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>名词前缀（5个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>前缀</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>p-</td><td>小</td><td>plibo 小册子</td></tr>
              <tr><td>b-</td><td>大</td><td>blibo 大书</td></tr>
              <tr><td>e-</td><td>电</td><td>epulokiŋ 电风扇</td></tr>
              <tr><td>ma-</td><td>母/女</td><td>makabaho 母狗</td></tr>
              <tr><td>pa-</td><td>父/男</td><td>pakabaho 公狗</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>名词后缀（16个，部分）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>后缀</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>-io</td><td>场所</td><td>sosenio 学校，libonio 图书馆</td></tr>
              <tr><td>-jiar</td><td>职业者</td><td>sensejiar 教师，medikejiar 医生</td></tr>
              <tr><td>-om</td><td>集合</td><td>fiŝom 鱼类，soseom 文具</td></tr>
              <tr><td>-kiŋ</td><td>工具</td><td>libekiŋ 笔，pulokiŋ 扇子</td></tr>
              <tr><td>-vrino</td><td>女性</td><td>xovrino 女孩</td></tr>
              <tr><td>-vrulo</td><td>男性</td><td>xovrulo 男孩</td></tr>
              <tr><td>-ar</td><td>人</td><td>sosejiar 学者</td></tr>
              <tr><td>-oujo</td><td>容器</td><td>liboujo 书包</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>词性后缀（5个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>词性</th><th>典型词尾</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>名词</td><td>O列元音（-o, -ō, -ô）</td><td>libo 书</td></tr>
              <tr><td>动词</td><td>E列元音（-e, -ē, -ê）</td><td>libe 写</td></tr>
              <tr><td>形容词</td><td>A列 / -i</td><td>puti 紫色的</td></tr>
              <tr><td>副词</td><td>U列 / -li</td><td>sōhu 快速地</td></tr>
              <tr><td>声叹词</td><td>-h</td><td>kilāh 闪耀的样子（拟态）</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则2-2：扩展词 -->
    <div class="section-card">
      <h3>规则2-2：扩展词（Etendovorto）</h3>

      <div class="sub-section">
        <h5>古有词（固定短语/固有词）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>田语</th><th>释义</th><th>类型</th></tr></thead>
            <tbody>
              <tr><td>ginmō</td><td>加油</td><td>固有词</td></tr>
              <tr><td>gaŋdyodene</td><td>说的也是</td><td>固有短语</td></tr>
              <tr><td>Milkēlio</td><td>美丽可爱的地方（琳凯蒂亚语固有词）</td><td>固有词</td></tr>
              <tr><td>rēmide</td><td>再见，下次见</td><td>固有词</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>外来词示例</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>田语</th><th>词性</th><th>释义</th><th>来源</th></tr></thead>
            <tbody>
              <tr><td>ĉate</td><td>v.</td><td>聊天</td><td>英语 chat</td></tr>
              <tr><td>ĉokolito</td><td>n.</td><td>巧克力</td><td>英语 chocolate</td></tr>
              <tr><td>piŋgō</td><td>n.</td><td>苹果</td><td>英语 apple（转写）</td></tr>
              <tr><td>pisâŋo</td><td>n.</td><td>香蕉</td><td>英语 banana（转写）</td></tr>
              <tr><td>supamaketo</td><td>n.</td><td>超市</td><td>英语 supermarket</td></tr>
              <tr><td>Êmelika</td><td>n.</td><td>美国</td><td>英语 America</td></tr>
              <tr><td>Jōŋgûg</td><td>n.</td><td>中国</td><td>汉语「中国」</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则2-3：标准词表 -->
    <div class="section-card">
      <h3>规则2-3：标准词表（Normvortlisto）</h3>
      <p class="rule-note">无限标准词表是田语词汇系统的核心，共收录 <strong>2000 个</strong>词根。每个词根为一个语义内核，通过添加不同词缀，可派生出整个语义家族。词根承载核心语义，元音词尾决定词性，前缀和后缀扩展语义维度。</p>

      <div class="vocab-list">
        <div class="vocab-card" v-for="word in standardWords" :key="word.id">
          <div class="vocab-main"><span class="rincatian-text">{{ word.root }}</span></div>
          <div class="vocab-pron">核心：{{ word.core }}</div>
          <div class="vocab-meaning">{{ word.derive }}</div>
          <span class="vocab-type">#{{ word.id }}</span>
        </div>
      </div>

      <div class="show-more" v-if="!showAllWords">
        <button class="btn-more" @click="showAllWords = true">显示更多标准词根（共2000个，此处展示前40个）</button>
      </div>
      <div class="vocab-list" v-if="showAllWords">
        <div class="vocab-card" v-for="word in extendedWords" :key="'e'+word.id">
          <div class="vocab-main"><span class="rincatian-text">{{ word.root }}</span></div>
          <div class="vocab-pron">核心：{{ word.core }}</div>
          <div class="vocab-meaning">{{ word.derive }}</div>
          <span class="vocab-type">#{{ word.id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeCategory = ref('全部')
const showAllWords = ref(false)

const categories = ['全部', '名词', '动词', '形容词', '副词', '代词', '连词', '数词', '词缀']

const vocabulary = ref([
  { id: '1', rincatian: 'sose', pronunciation: '[so se]', chinese: '学习', type: '动词' },
  { id: '2', rincatian: 'libo', pronunciation: '[li bo]', chinese: '书', type: '名词' },
  { id: '3', rincatian: 'libe', pronunciation: '[li be]', chinese: '写；书写；记录', type: '动词' },
  { id: '4', rincatian: 'bela', pronunciation: '[bei la]', chinese: '美丽的', type: '形容词' },
  { id: '5', rincatian: 'pulo', pronunciation: '[pu lo]', chinese: '羽毛', type: '名词' },
  { id: '6', rincatian: 'pule', pronunciation: '[pu le]', chinese: '扇动；扑打', type: '动词' },
  { id: '7', rincatian: 'ŝelo', pronunciation: '[ʂe lo]', chinese: '贝壳', type: '名词' },
  { id: '8', rincatian: 'ŝele', pronunciation: '[ʂe le]', chinese: '花费；消费', type: '动词' },
  { id: '9', rincatian: 'tabo', pronunciation: '[ta bo]', chinese: '食物', type: '名词' },
  { id: '10', rincatian: 'tabe', pronunciation: '[ta be]', chinese: '吃', type: '动词' },
  { id: '11', rincatian: 'fiŝo', pronunciation: '[fi ʂo]', chinese: '鱼', type: '名词' },
  { id: '12', rincatian: 'mide', pronunciation: '[mi de]', chinese: '看见；观看', type: '动词' },
  { id: '13', rincatian: 'solto', pronunciation: '[sol to]', chinese: '盐', type: '名词' },
  { id: '14', rincatian: 'solti', pronunciation: '[sol ti]', chinese: '咸的', type: '形容词' },
  { id: '15', rincatian: 'elo', pronunciation: '[e lo]', chinese: '电', type: '名词' },
  { id: '16', rincatian: 'windo', pronunciation: '[win do]', chinese: '风', type: '名词' },
  { id: '17', rincatian: 'lātiŋ', pronunciation: '[lai tiŋ]', chinese: '光，光线', type: '名词' },
  { id: '18', rincatian: 'tāri', pronunciation: '[ta ri]', chinese: '星星', type: '名词' },
  { id: '19', rincatian: 'luno', pronunciation: '[lu no]', chinese: '月亮，月球', type: '名词' },
  { id: '20', rincatian: 'sēgā', pronunciation: '[sei gai]', chinese: '世界，星球', type: '名词' },
  { id: '21', rincatian: 'māri', pronunciation: '[ma ri]', chinese: '魔法', type: '名词' },
  { id: '22', rincatian: 'tōla', pronunciation: '[to la]', chinese: '说话，讲述', type: '动词' },
  { id: '23', rincatian: 'wi', pronunciation: '[wi]', chinese: '我', type: '代词' },
  { id: '24', rincatian: 'tu', pronunciation: '[tu]', chinese: '你', type: '代词' },
  { id: '25', rincatian: 'nim', pronunciation: '[nim]', chinese: '二，两个', type: '数词' },
  { id: '26', rincatian: 'e', pronunciation: '[e]', chinese: '和，与', type: '连词' },
  { id: '27', rincatian: 'dāske', pronunciation: '[dais ke]', chinese: '喜欢', type: '动词' },
  { id: '28', rincatian: 'pense', pronunciation: '[pen se]', chinese: '思考', type: '动词' },
  { id: '29', rincatian: 'dorme', pronunciation: '[dor me]', chinese: '睡觉', type: '动词' },
  { id: '30', rincatian: 'kure', pronunciation: '[ku re]', chinese: '跑', type: '动词' },
  { id: '31', rincatian: 'sōhu', pronunciation: '[sou hu]', chinese: '快速地', type: '副词' },
  { id: '32', rincatian: 'bona', pronunciation: '[bo na]', chinese: '好的', type: '形容词' },
  { id: '33', rincatian: 'mubela', pronunciation: '[mu bei la]', chinese: '丑的', type: '形容词' },
  { id: '34', rincatian: 'hapia', pronunciation: '[ha pi a]', chinese: '幸福的', type: '形容词' },
  { id: '35', rincatian: 'puti', pronunciation: '[pu ti]', chinese: '紫色的', type: '形容词' },
  { id: '36', rincatian: 'nomo', pronunciation: '[no mo]', chinese: '姓名', type: '名词' },
  { id: '37', rincatian: 'nome', pronunciation: '[no me]', chinese: '命名', type: '动词' },
  { id: '38', rincatian: 'kabaho', pronunciation: '[ka ba ho]', chinese: '狗', type: '名词' },
  { id: '39', rincatian: 'famile', pronunciation: '[fa mi le]', chinese: '回家', type: '动词' },
  { id: '40', rincatian: 'voyo', pronunciation: '[vo yo]', chinese: '路', type: '名词' },
  { id: '41', rincatian: 'caŋ', pronunciation: '[tsaŋ]', chinese: '所有；全部', type: '代词' },
  { id: '42', rincatian: 'parle', pronunciation: '[par le]', chinese: '说', type: '动词' },
  { id: '43', rincatian: 'page', pronunciation: '[pa ge]', chinese: '打', type: '动词' },
  { id: '44', rincatian: 'kû', pronunciation: '[ku]', chinese: '让；使', type: '动词' },
  { id: '45', rincatian: 'pone', pronunciation: '[po ne]', chinese: '给；传递', type: '动词' },
  { id: '46', rincatian: 'povi', pronunciation: '[po vi]', chinese: '能够', type: '形容词' },
  { id: '47', rincatian: 'heroi', pronunciation: '[he roi]', chinese: '勇敢的', type: '形容词' },
  { id: '48', rincatian: 'mōje', pronunciation: '[mou je]', chinese: '知道', type: '动词' },
  { id: '49', rincatian: 'yunā', pronunciation: '[yu nai]', chinese: '年轻的', type: '形容词' },
  { id: '50', rincatian: 'hōse', pronunciation: '[hou se]', chinese: '非常（程度）', type: '副词' }
])

const standardWords = ref([
  { id: '1', root: 'sos-', core: '学', derive: 'sose v.学习 | soseo n.学生 | sosejiar n.学者 | sosenio n.学校' },
  { id: '2', root: 'lib-', core: '书[写]', derive: 'libo n.书 | libe v.写 | plibo n.小册子 | libekiŋ n.笔' },
  { id: '3', root: 'bel-', core: '美[丽、丑]', derive: 'bela adj.美丽的 | belo n.美丽的事物 | mubela adj.丑的' },
  { id: '4', root: 'pul-', core: '羽[扇]', derive: 'pulo n.羽毛 | pule v.扇动 | pulokiŋ n.扇子' },
  { id: '5', root: 'ŝel-', core: '贝[钱]', derive: 'ŝelo n.贝壳 | ŝele v.花费 | ŝelemō n.费用' },
  { id: '6', root: 'tab-', core: '食[吃]', derive: 'tabo n.食物 | tabe v.吃 | tabonio n.小吃店' },
  { id: '7', root: 'fiŝ-', core: '鱼[渔]', derive: 'fiŝo n.鱼 | fiŝom n.鱼类 | fiŝe v.捕鱼' },
  { id: '8', root: 'mid-', core: '见[看、眼]', derive: 'mide v.看见 | mido n.眼睛 | rēmide 再见' },
  { id: '9', root: 'solt-', core: '盐[咸]', derive: 'solto n.盐 | solti adj.咸的' },
  { id: '10', root: 'el-', core: '电', derive: 'elo n.电 | ele v.电 | ewindo n.吹风机' },
  { id: '11', root: 'wind-', core: '风[窗]', derive: 'windo n.风 | windō n.窗户 | winde v.刮风' },
  { id: '12', root: 'dorm-', core: '睡[眠]', derive: 'dorme v.睡觉 | dormo n.睡眠 | dormonio n.卧室' },
  { id: '13', root: 'kur-', core: '跑[奔]', derive: 'kure v.跑 | kuro n.跑步 | sōhukure 快跑' },
  { id: '14', root: 'hapi-', core: '幸福[快乐]', derive: 'hapia adj.幸福的 | hapio n.幸福 | muhapia adj.不幸的' },
  { id: '15', root: 'dāsk-', core: '喜欢[爱]', derive: 'dāske v.喜欢 | dāsko n.爱好 | cedāske v.非常喜欢' },
  { id: '16', root: 'pens-', core: '思考[想]', derive: 'pense v.思考 | penso n.思想 | pensom n.思想体系' },
  { id: '17', root: 'nom-', core: '名[称]', derive: 'nomo n.姓名 | nome v.命名 | nomeo n.命名（事）' },
  { id: '18', root: 'lāt-', core: '光[亮]', derive: 'lātiŋ n.光 | lāte v.发光 | lātia adj.光明的' },
  { id: '19', root: 'tār-', core: '星[辰]', derive: 'tāri n.星星 | tāro n.星辰 | tāria adj.星光的' },
  { id: '20', root: 'lun-', core: '月[亮]', derive: 'luno n.月亮 | lune v.像月亮 | lunia adj.月光的' }
])

const extendedWords = ref([
  { id: '21', root: 'mag-', core: '大[巨]', derive: 'maga adj.大的 | mago n.巨大之物 | mage v.变大' },
  { id: '22', root: 'mik-', core: '小[微]', derive: 'mika adj.小的 | miko n.微小之物 | mike v.变小' },
  { id: '23', root: 'bōn-', core: '好[善]', derive: 'bōna adj.好的 | bōno n.善事 | bōne v.改善' },
  { id: '24', root: 'mal-', core: '坏[恶]', derive: 'mala adj.坏的 | malo n.恶事 | male v.恶化' },
  { id: '25', root: 'nov-', core: '新[鲜]', derive: 'nova adj.新的 | novo n.新事物 | nove v.更新' },
  { id: '26', root: 'old-', core: '旧[老]', derive: 'olda adj.旧的 | oldo n.旧物 | olde v.变旧' },
  { id: '27', root: 'hāg-', core: '高[上]', derive: 'hāga adj.高的 | hāgo n.高处 | hāge v.升高' },
  { id: '28', root: 'bas-', core: '低[下]', derive: 'basa adj.低的 | baso n.低处 | base v.降低' },
  { id: '29', root: 'long-', core: '长[久]', derive: 'longa adj.长的 | longo n.长度 | longe v.延长' },
  { id: '30', root: 'kort-', core: '短[暂]', derive: 'korta adj.短的 | korto n.短物 | kortu adv.短暂地' },
  { id: '31', root: 'fort-', core: '强[力]', derive: 'forta adj.强的 | forto n.力量 | forte v.加强' },
  { id: '32', root: 'febl-', core: '弱[软]', derive: 'febla adj.弱的 | feblo n.弱点 | feble v.变弱' },
  { id: '33', root: 'rik-', core: '富[有]', derive: 'rika adj.富的 | riko n.财富 | rike v.致富' },
  { id: '34', root: 'povr-', core: '穷[贫]', derive: 'povra adj.穷的 | povro n.贫困 | povre v.变穷' },
  { id: '35', root: 'pur-', core: '净[洁]', derive: 'pura adj.干净的 | puro n.洁净 | pure v.打扫' },
  { id: '36', root: 'sord-', core: '脏[污]', derive: 'sorda adj.脏的 | sordo n.污垢 | sorde v.弄脏' },
  { id: '37', root: 'varm-', core: '暖[热]', derive: 'varma adj.暖的 | varmo n.温暖 | varme v.变暖' },
  { id: '38', root: 'frid-', core: '冷[寒]', derive: 'frida adj.冷的 | frido n.寒冷 | fride v.变冷' },
  { id: '39', root: 'jun-', core: '年轻[少]', derive: 'juna adj.年轻的 | juno n.青年 | june v.变年轻' },
  { id: '40', root: 'sen-', core: '老[年长]', derive: 'sena adj.老的 | seno n.老人 | sene v.变老' }
])

const filteredWords = computed(() => {
  let result = vocabulary.value
  if (activeCategory.value !== '全部') {
    result = result.filter(w => w.type === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(w =>
      w.rincatian.toLowerCase().includes(q) ||
      w.chinese.includes(q) ||
      w.pronunciation.toLowerCase().includes(q)
    )
  }
  return result
})

function onSearch() {
  // 搜索实时响应
}
</script>