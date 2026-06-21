<template>
  <div class="sub-page grammar-page">
    <div class="page-header">
      <h2 class="sub-page-title">语法学习</h2>
      <p class="sub-page-desc">系统学习琳凯蒂亚语语法体系，涵盖规则3（句式）至规则12（结语）。</p>
      <a href="https://baike.baidu.com/item/%E7%90%B3%E5%87%AF%E8%92%82%E4%BA%9A%E8%AF%AD/66751047" target="_blank" class="baike-link" title="在百度百科查看琳凯蒂亚语">📖 在百度百科查看琳凯蒂亚语 →</a>
    </div>

    <!-- 规则3：句式 -->
    <div class="section-card">
      <h3>规则3：句式（Sintako）</h3>

      <h4>3.1 句子范式</h4>
      <div class="formula-box">
        <p class="formula">Σ = [H] + S(α+s) + V(β+v) + O(γ+o) + [E] + P</p>
      </div>
      <div class="rule-table-wrap">
        <table class="rule-table">
          <thead><tr><th>符号</th><th>成分</th><th>定义</th></tr></thead>
          <tbody>
            <tr><td>H</td><td>领语</td><td>句首语用成分，承载强调或祈使</td></tr>
            <tr><td>S</td><td>主语</td><td>陈述动作变化或关系的对象</td></tr>
            <tr><td>α</td><td>主辅</td><td>主语内部的修饰语</td></tr>
            <tr><td>s</td><td>主元</td><td>主语的核心</td></tr>
            <tr><td>V</td><td>述语</td><td>表示主语的变化或主宾关系</td></tr>
            <tr><td>β</td><td>述辅</td><td>述语内部修饰语</td></tr>
            <tr><td>v</td><td>述元</td><td>述语的核心（动词）</td></tr>
            <tr><td>O</td><td>宾语</td><td>动作或关系所涉及的对象</td></tr>
            <tr><td>γ</td><td>宾辅</td><td>宾语内部的修饰语</td></tr>
            <tr><td>o</td><td>宾元</td><td>宾语的核心</td></tr>
            <tr><td>E</td><td>结语</td><td>句末语用成分，表达语气或情感</td></tr>
            <tr><td>P</td><td>标点</td><td>句末标点（. ! ?）</td></tr>
          </tbody>
        </table>
      </div>

      <h4>3.2 三种句子类型</h4>
      <div class="sub-section">
        <h5>变化句（Σc）— 不及物动词</h5>
        <div class="formula-box"><p class="formula">Σc = [H] + S + V + [E] + P</p></div>
        <div class="example-box">
          <p><strong><span class="rincatian-text">Hi dormelē yo.</span></strong> 他睡着了。</p>
          <p>结构：S(<span class="rincatian-text">Hi</span>) + V(<span class="rincatian-text">dormelē</span>) + E(<span class="rincatian-text">yo</span>)</p>
        </div>
        <p class="rule-note">判断标准：句中有没有宾语？没有宾语 → 变化句。位移动词后的终点名词不是宾语。</p>
      </div>

      <div class="sub-section">
        <h5>关系句（Σr）— 系动词 es/ez</h5>
        <div class="formula-box"><p class="formula">Σr = [H] + S + V + O + [E] + P</p></div>
        <div class="example-box">
          <p><strong><span class="rincatian-text">Ŝi es bela yo.</span></strong> 她是漂亮的。</p>
          <p><strong><span class="rincatian-text">Libro ez dekowo.</span></strong> 书在桌子上。</p>
        </div>
        <p class="rule-note">注意：田语形容词直接做述元时表示变化含义，表状态需用系动词 es 连接。</p>
      </div>

      <div class="sub-section">
        <h5>变化关系句（Σcr）— 及物动词</h5>
        <div class="formula-box"><p class="formula">Σcr = [H] + S + V + O + [E] + P</p></div>
        <div class="example-box">
          <p><strong><span class="rincatian-text">Wi libele libo yo.</span></strong> 我写过书。</p>
          <p>宾语五种类型：处置对象(par)、传递对象(pon)、使役对象(pon)、受益对象(pon)、比较基准(par)</p>
        </div>
      </div>

      <h4>3.4 重要概念</h4>
      <div class="rule-table-wrap">
        <table class="rule-table">
          <thead><tr><th>概念</th><th>说明</th><th>示例</th></tr></thead>
          <tbody>
            <tr><td>分句</td><td>由连词连接的两个及以上句子中的任意一个</td><td>Hi dormelē sedo wi nelibelē yo.</td></tr>
            <tr><td>词性短语</td><td>具有某一词性属性的短语</td><td>bela kabaho（名词性短语）</td></tr>
            <tr><td>子句</td><td>充当标准句中某一语法成分的句子</td><td>Wi mide hi'p kure.（宾语子句）</td></tr>
            <tr><td>单成分</td><td>一个成分由一个单词充任</td><td>Wi ces bona.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 规则4：示词 -->
    <div class="section-card">
      <h3>规则4：示词（Ŝicio）</h3>
      <p>示词是田语中最核心的语法系统，用以标明其前方成分在整个句子中的句法角色。田语共有<strong>15个示词</strong>，语序可自由调整而句意不变。</p>

      <div class="sub-section">
        <h5>主语示词（3个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>示词</th><th>简写</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>wô</td><td>'ô</td><td>主语自发（有生命物主动施事）</td><td>Wi wô elāle yo. 我主动来了。</td></tr>
              <tr><td>jio</td><td>'j</td><td>主语他发（无生命物/被动）</td><td>Eparlo jio haŋdole. 电话响了。</td></tr>
              <tr><td>lio</td><td>'l</td><td>主语抽象（概念/子句作主语）</td><td>Hapia lio es bona. 幸福是好的。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>宾语示词（2个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>示词</th><th>简写</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>par</td><td>'p</td><td>宾语静态（处置对象/比较基准/被动施动者）</td><td>Wi pagezē hi'p eslē puta. 我把他打肿了。</td></tr>
              <tr><td>pon</td><td>'pn</td><td>宾语动态（传递/使役/受益对象）</td><td>Wi pone hi'pn ezge libo. 我给他书。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>述辅示词（5个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>示词</th><th>简写</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>du</td><td>—</td><td>普通述辅（通用状语）</td><td>I bōyō linio ese du laveĉule... 一场大雨像线一样地...</td></tr>
              <tr><td>xu</td><td>—</td><td>述辅时间</td><td>Wi legen xu etole. 我昨天去了。</td></tr>
              <tr><td>ku</td><td>—</td><td>述辅地点</td><td>Wi sosenio ku elāle. 我从学校来的。</td></tr>
              <tr><td>peyoŋ</td><td>'py</td><td>述辅方式（工具/方式/原因）</td><td>XioẐaŋ fēlākiŋ'py eĉunēn. 小张坐飞机出差。</td></tr>
              <tr><td>poroŋ</td><td>'pr</td><td>目的示词</td><td>XioMiŋ mide libo poroŋ eto libonio. 小明去图书馆看书。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>主宾辅示词（3个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>示词</th><th>简写</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>da</td><td>'a</td><td>普通主宾辅（定语"…的"）</td><td>famile da voyo 回家的路</td></tr>
              <tr><td>xa</td><td>—</td><td>主宾辅时间</td><td>Togen xa luno. 明天的月亮。</td></tr>
              <tr><td>ka</td><td>—</td><td>主宾辅地点</td><td>Faminio ka mono. 家里的东西。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>其他示词（2个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>示词</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>am</td><td>关涉示词（关于/对…来说）</td><td>Ko mono am, wi mōje. 关于这件事，我不知道。</td></tr>
              <tr><td>li</td><td>句状语示词（修饰整个句子）</td><td>Caŋ li win perite libo. 我们都读书。</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则5：名词 -->
    <div class="section-card">
      <h3>规则5：名词（Nomo）</h3>
      <p>名词 = 名、动、形、副 +（集群词尾）+（方位词尾）。名词以 O 列元音（o, ō, ô）结尾为典型标志。</p>

      <div class="sub-section">
        <h5>5.1 集群词尾 -on</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>形式</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>名词原形</td><td>个体或类指</td><td>soseo 学生；in 人，人类</td></tr>
              <tr><td>名词 + -on</td><td>群体、若干</td><td>soseon 学生们；inon 人群，大众</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>5.2 方位词尾（6种方位关系 × 18个方位词）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>方位词尾</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>-wo</td><td>上</td><td>dekowo 桌子上</td></tr>
              <tr><td>-lu</td><td>下</td><td>dekoluwā 桌子下方悬浮（wā表示不接壤）</td></tr>
              <tr><td>-nē</td><td>内</td><td>supamaketonē 超市里</td></tr>
              <tr><td>-qin</td><td>前</td><td>pordoqin 门前</td></tr>
              <tr><td>-ayor</td><td>右</td><td>homoayor 房子的右边</td></tr>
              <tr><td>-elasï</td><td>东</td><td>tāyaŋ ez oelasï ku. 太阳从东边升起。</td></tr>
            </tbody>
          </table>
        </div>
        <div class="example-box">
          <p><strong><span class="rincatian-text">dekowo'j ez libo.</span></strong> 桌子上有书。（dekowo为主语，'j=jio）</p>
          <p><strong><span class="rincatian-text">libo'j ez dekowo.</span></strong> 书在桌子上。（dekowo为宾语）</p>
        </div>
      </div>
    </div>

    <!-- 规则6：动词 -->
    <div class="section-card">
      <h3>规则6：动词（Verbo）</h3>

      <div class="sub-section">
        <h5>6.1 趋向词尾（32个）— 动词的「向」</h5>
        <p>以 lā（来）和 to（去）为两极：</p>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>趋向词尾</th><th>组合趋向词尾</th></tr></thead>
            <tbody>
              <tr><td>-wo（上）</td><td>→ -wolā（上来）/ -woto（上去）</td></tr>
              <tr><td>-lu（下）</td><td>→ -lulā（下来）/ -luto（下去）</td></tr>
              <tr><td>-ĉu（出）</td><td>→ -ĉulā（出来）/ -ĉunēn（出去）</td></tr>
              <tr><td>-gaŋ/-o（回）</td><td>→ -gaŋlā/-olā（回来）/ -gaŋto/-oto（回去）</td></tr>
              <tr><td>-ke（过）</td><td>→ -kelā（过来）/ -keto（过去）</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>6.2 体词尾（9×2）— 动词的「体」</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>体名</th><th>正向体</th><th>逆向体</th><th>核心语义</th><th>举例</th></tr></thead>
            <tbody>
              <tr><td>一般体</td><td>原形（-e）</td><td>-en</td><td>默认/被动</td><td>lume 发光 / lumen 被发光</td></tr>
              <tr><td>计划体</td><td>-ge</td><td>-gen</td><td>打算做/被打算</td><td>lumege 计划发光</td></tr>
              <tr><td>起始体</td><td>-gē</td><td>-gēm</td><td>开始做/被开始</td><td>lumegē 开始发光</td></tr>
              <tr><td>进行体</td><td>-ze</td><td>-zen</td><td>正在做/被正在</td><td>lumeze 正在发光</td></tr>
              <tr><td>终止体</td><td>-zē</td><td>-zēm</td><td>恰好做完/被恰好</td><td>lumezē 恰好发光</td></tr>
              <tr><td>结果体</td><td>-lē</td><td>-lēm</td><td>已经做完/被动完成</td><td>lumelē 已完成发光</td></tr>
              <tr><td>经验体</td><td>-le</td><td>-len</td><td>曾做过/曾被做</td><td>lumele 发光过</td></tr>
              <tr><td>惯常体</td><td>-re</td><td>-ren</td><td>经常做/被经常</td><td>lumere 常发光</td></tr>
              <tr><td>短时体</td><td>-rē</td><td>-rēm</td><td>做一下/被做一下</td><td>lumerē 发一下光</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>6.3 系动词（2×6个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>类型</th><th>真值</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>es（是）</td><td>1</td><td>Ŝi es bela. 她是漂亮的。</td></tr>
              <tr><td>ese（像、可能）</td><td>0~1</td><td>Ko midu ese kabaho. 这看起来像只狗。</td></tr>
              <tr><td>nes（不是）</td><td>0</td><td>Ŝi nes bela. 她不漂亮。</td></tr>
              <tr><td>ez（在/有）</td><td>1</td><td>Libro ez dekowo. 书在桌子上。</td></tr>
              <tr><td>eze（可能在）</td><td>0~1</td><td>Hamigo eze lotor. 猫可能在床上。</td></tr>
              <tr><td>nez（不在）</td><td>0</td><td>Libro nez dekowo. 书不在桌子上。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>6.4 使役结构</h5>
        <div class="formula-box"><p class="formula">o kû o'pn + 宾语子句</p></div>
        <div class="example-box">
          <p><strong><span class="rincatian-text">Hi kû wi'pn parle ni'pn helpe hi'pn celoe Ẑaŋ medikejiar'pn elā.</span></strong></p>
          <p>他叫我让你帮他请张医生来看病。</p>
        </div>
      </div>

      <div class="sub-section">
        <h5>6.5 单动词原则</h5>
        <p>田语以<strong>单动词原则</strong>为核心铁律——一个标准句中只能有一个核心述元。动词并列被禁止，需通过降级处理（子句、分句、词性短语）实现。</p>
      </div>
    </div>

    <!-- 规则7：辅词 -->
    <div class="section-card">
      <h3>规则7：辅词（Modifo）</h3>
      <p>起修饰作用的词类。分为形容词（修饰体词）和副词（修饰动词、副词、形容词或整个句子）。</p>

      <div class="sub-section">
        <h5>7.2 比较词尾</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>等级</th><th>形容词词尾</th><th>副词词尾</th><th>用法</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>原级</td><td>-a/-i</td><td>-u/-li</td><td>基本性质</td><td>bela 美丽的；sōhu 快速地</td></tr>
              <tr><td>相同级</td><td>-ixo</td><td>-ixo</td><td>与…一样</td><td>Wi hâ ŝi es belaixo. 我和她都很美。</td></tr>
              <tr><td>比较级</td><td>-tē</td><td>-tē</td><td>比…更</td><td>Wi belatē ŝi'p. 我比她漂亮。</td></tr>
              <tr><td>最高级</td><td>-sā</td><td>-sā</td><td>最</td><td>Ŝi es belasā xovrino. 她是最美的女孩。</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则8：代词 -->
    <div class="section-card">
      <h3>规则8：代词（Qinnomo）</h3>

      <div class="sub-section">
        <h5>8.1 代词表</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>人称</th><th>单数</th><th>复数</th><th>物主单数</th><th>反身单数</th><th>敬型</th></tr></thead>
            <tbody>
              <tr><td>第一人称</td><td>wi</td><td>win</td><td>wia</td><td>wiẑi</td><td>wicâli</td></tr>
              <tr><td>第二人称</td><td>ni</td><td>nin</td><td>nia</td><td>niẑi</td><td>nicâli</td></tr>
              <tr><td>第三人称</td><td>hi/ŝi/ji/xi</td><td>hin/ŝin/jin/xin</td><td>hia/ŝia/jia/xia</td><td>hiẑi/ŝiẑi/jiẑi/xiẑi</td><td>hicâli/ŝicâli/...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>8.2 相关词表</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>田语</th><th>释义</th><th>田语</th><th>释义</th></tr></thead>
            <tbody>
              <tr><td>ko</td><td>这</td><td>go</td><td>那</td></tr>
              <tr><td>neko</td><td>什么</td><td>imē</td><td>某</td></tr>
              <tr><td>caŋ</td><td>全部</td><td>ezom</td><td>有的</td></tr>
              <tr><td>nezom</td><td>没有</td><td>koi</td><td>这个人</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则9：数词 -->
    <div class="section-card">
      <h3>规则9：数词（Numero）</h3>
      <p>田语数词为有限词，无词尾变化。基数词几乎全为单音节，通过词缀可派生。量名词非语法强制项，数词可直接修饰名词。数字组合遵循"高位在前，低位在后"的原则。</p>
      <div class="sub-section">
        <h5>数词构成（9种子类）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>子类</th><th>词缀</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>序数</td><td>di-</td><td>diun 第一</td></tr>
              <tr><td>倍数</td><td>-bām</td><td>nimbām 两倍</td></tr>
              <tr><td>分数</td><td>-ape-</td><td>nimapeun 二分之一</td></tr>
              <tr><td>概数</td><td>haŋ-</td><td>haŋdek 十来</td></tr>
              <tr><td>小数</td><td>do</td><td>un do nim 1.2</td></tr>
              <tr><td>频数</td><td>-gu</td><td>nimgū 两次</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 规则10：连词 -->
    <div class="section-card">
      <h3>规则10：连词（Kunio）</h3>
      <div class="rule-table-wrap">
        <table class="rule-table">
          <thead><tr><th>关系</th><th>连词</th><th>示例</th></tr></thead>
          <tbody>
            <tr><td>联合</td><td>hâ（和）、ole（而且）</td><td>piŋgō hâ pisâŋo 苹果和香蕉</td></tr>
            <tr><td>对立</td><td>sedo（但是）、vakan（虽然）</td><td>Vakan hi es juna, hi cenemōje. 虽然他年轻，但他很懂。</td></tr>
            <tr><td>因果</td><td>qavi（因为）、gosi（因此）</td><td>Wi pense gosi wi ez. 我思故我在。</td></tr>
            <tr><td>条件</td><td>rugo（如果）、oli（只要）</td><td>Rugo togen xu yōge, wi neetoge libonio. 如果明天下雨，我就不去图书馆。</td></tr>
            <tr><td>目的</td><td>porol（为了）、poron（以便）</td><td>Hi sōhu kure poron etole. 他快跑以便赶到。</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 规则11：领语 -->
    <div class="section-card">
      <h3>规则11：领语（Hedo）</h3>
      <p>领语是田语句首的语用成分，用以承载祈使语气或强调焦点。</p>

      <div class="sub-section">
        <h5>11.1 祈使句（牵词）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>牵词</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td>celoŋ</td><td>请</td></tr>
              <tr><td>nuden</td><td>禁止</td></tr>
              <tr><td>haden</td><td>建议</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>11.2 强调句</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>强调词</th><th>功能</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>ce</td><td>强调整句或主语</td><td>Ce ko es bona! 这真的很好！</td></tr>
              <tr><td>θi / θin</td><td>单/复数特指"就这个/就这些"</td><td>θi hi dose ko mono... 就他做了这件事...</td></tr>
            </tbody>
          </table>
        </div>
        <p class="rule-note">也可将需强调的语法成分连带其示词一并提至句首。示词始终伴随被标记成分，确保无论语序如何调整，句法角色清晰不变。</p>
      </div>
    </div>

    <!-- 规则12：结语 -->
    <div class="section-card">
      <h3>规则12：结语（Endo）</h3>
      <p>结语系统是田语最具创新性的特征之一，通过"前止词+后止词"的模块化组合，将说话者的情感梯度、确信程度、社交姿态等主观信息编码于句末。</p>

      <div class="sub-section">
        <h5>12.1 后止词（语气底座，3个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>后止词</th><th>语气</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>yo</td><td>陈述</td><td>Ko es bona yo. 这很好。</td></tr>
              <tr><td>ga</td><td>感叹</td><td>Win sakile handêga! 太好了！我们成功了！</td></tr>
              <tr><td>ne</td><td>疑问</td><td>Ni mōje ne? 你知道吗？</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>12.2 前止词（情感态度，100余个）</h5>
        <div class="rule-table-wrap">
          <table class="rule-table">
            <thead><tr><th>前止词</th><th>含义</th><th>示例</th></tr></thead>
            <tbody>
              <tr><td>te-</td><td>新动作</td><td>Ko es bona teyo. 这（刚发现）很好。</td></tr>
              <tr><td>me-</td><td>显而易见</td><td>Ko es bona meyo. 这显然很好。</td></tr>
              <tr><td>le-</td><td>已达状态</td><td>Ko es bona leyo. 这已经是好的了。</td></tr>
              <tr><td>ka-</td><td>夸张</td><td>Ko es bona kaga! 这也太好了吧！</td></tr>
              <tr><td>handê-</td><td>喜悦</td><td>Win sakile handêga! 我们成功了！太好了！</td></tr>
              <tr><td>nōn-</td><td>愤怒</td><td>Ko es mubela nōnga! 这太丑了！</td></tr>
              <tr><td>mi-</td><td>委婉可爱</td><td>Ko es ansa mio. 挺厉害的哦。（mi-使yo→o）</td></tr>
              <tr><td>so-</td><td>顿悟</td><td>A, ko es bona soyo! 啊，原来这很好啊！</td></tr>
              <tr><td>sē-</td><td>非常</td><td>Ko es sēbona sēyo. 这真是太好了。</td></tr>
              <tr><td>cā-</td><td>比预期晚</td><td>Hi elāle cāyo. 他才来。</td></tr>
              <tr><td>jô-</td><td>比预期早</td><td>Hi elāle jôyo. 他已经来了。</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sub-section">
        <h5>12.3 分句结语：中顿后止词 de</h5>
        <div class="example-box">
          <p><strong><span class="rincatian-text">Hi parle de, hi hapele de, hi dormele yo.</span></strong></p>
          <p>他说了，他笑了，他睡着了。</p>
          <p class="rule-note">分句未完时用 <span class="rincatian-text">de</span>，最后用 <span class="rincatian-text">ga</span>/<span class="rincatian-text">yo</span>/<span class="rincatian-text">ne</span> 收尾。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>