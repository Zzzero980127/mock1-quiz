/* 二模新增題型（第二批）：國文「二模常考知識」、英文第三冊「詞性與易混字（B3）」。依 110～114 學年度二模歷屆常考的知識點出題。 */
(function () {
  var Q = window.QUIZ_DATA || [];
  function subj(id) { return Q.filter(function (x) { return x.id === id; })[0]; }

  /* ================= 國文：二模常考知識 ================= */
  var C = subj('chi');
  if (C) {
    var kn = [
      ['字形', '「天賦異＿」的「＿」，正確用字是？', ['稟', '秉', '廩', '凜'], '天賦異稟：稟 = 承受（天生的資質）。'],
      ['字形', '「名列前＿」的「＿」，正確用字是？', ['茅', '矛', '毛', '貓'], '名列前茅：名次排在前面（茅，一種草，原指楚軍前鋒的茅旗）。'],
      ['字形', '「一＿作氣」的「＿」，正確用字是？', ['鼓', '股', '古', '蠱'], '一鼓作氣：出自《左傳》「夫戰，勇氣也。一鼓作氣」。'],
      ['字形', '「一碧萬＿」的「＿」，正確用字是？', ['頃', '傾', '項', '頂'], '一碧萬頃：形容湖水碧綠遼闊（頃 = 田地面積單位，這裡形容廣大）。出自〈岳陽樓記〉。'],
      ['字形', '「沙鷗＿集」的「＿」，正確用字是？', ['翔', '祥', '詳', '降'], '沙鷗翔集：沙洲上的鷗鳥時而飛翔、時而停集。出自〈岳陽樓記〉。'],
      ['字形', '「＿然開朗」的「＿」，正確用字是？', ['豁', '割', '嚇', '害'], '豁然開朗：形容由狹窄變得開闊明亮（〈桃花源記〉）。'],
      ['字形', '「挑＿」（用手指或工具把東西撥出來）的「＿」，正確用字是？', ['剔', '惕', '踢', '楊'], '挑剔：挑出、找缺點。'],
      ['字音', '下列哪一組字的讀音「相同」？', ['楫、輯', '誡、械', '惴、湍', '跫、踅'], '楫、輯同讀 ㄐㄧˊ；誡 ㄐㄧㄝˋ／械 ㄒㄧㄝˋ，惴 ㄓㄨㄟˋ／湍 ㄊㄨㄢ，跫 ㄑㄩㄥˊ／踅 ㄒㄩㄝˊ，都不同音。'],
      ['字音', '「皎」與下列哪一個字同音（ㄐㄧㄠˇ）？', ['狡', '較', '郊', '交'], '皎、狡同讀 ㄐㄧㄠˇ；較 ㄐㄧㄠˋ、郊與交 ㄐㄧㄠ。'],
      ['字音', '「妄自菲薄」的「菲」，讀音是？', ['ㄈㄟˇ', 'ㄈㄟ', 'ㄈㄟˊ', 'ㄈㄟˋ'], '妄自菲薄的菲讀 ㄈㄟˇ（輕視）；緋紅的「緋」讀 ㄈㄟ，不同音。'],
      ['字詞義', '「不以物喜，不以己悲」的「以」意思是？', ['因為', '使用', '用來', '作為'], '「以」＝因為（與〈燭之武退秦師〉「以其無禮於晉」同）。'],
      ['字詞義', '下列「以」的意思，何者與「不以物喜」相同？', ['以其無禮於晉', '以何物', '以記之', '以為東道主'], '以其無禮於晉＝因為；以何物＝使用；以記之＝用來；以為東道主＝作為。'],
      ['字詞義', '「乃重修岳陽樓」的「乃」意思是？', ['於是', '竟然', '你的', '才'], '「乃重修岳陽樓」＝於是重修；「乃不知有漢」的乃＝竟然（〈桃花源記〉）。'],
      ['字詞義', '「便扶向路」與「向之所欣」的「向」意思是？', ['之前的、先前的', '朝著', '方向', '一直'], '兩句的「向」都是「從前、先前的」。'],
      ['成語', '「折衝樽俎」的意思是？', ['在酒席間談判、以外交取勝', '在宴會上盡情飲酒', '用武力在酒席上取勝', '在祭典上獻酒'], '折衝樽俎：不用武力，在酒席間談判折服對方。'],
      ['成語', '「浮雲蔽日」比喻？', ['奸邪蒙蔽君主', '天氣晴朗', '雲霧瀰漫的山景', '歸隱山林'], '〈出師表〉等文中常用浮雲蔽日比喻小人蒙蔽君王。'],
      ['成語', '「鐘鳴鼎食」形容？', ['富貴奢華的生活', '生活儉樸', '人丁興旺', '祭祀隆重'], '鐘鳴鼎食：擊鐘奏樂、列鼎而食，形容富貴奢華；儉樸應用「食不重味」。']
    ];
    var knHard = [
      ['字形', '下列詞語，何者用字完全正確？', ['天賦異稟、名列前茅', '天賦異秉、名列前矛', '天賦異稟、名列前矛', '天賦異秉、名列前茅'], '天賦異稟（稟＝承受）、名列前茅（茅＝茅草旗）。'],
      ['字形', '下列詞語，何者用字完全正確？', ['一鼓作氣、一碧萬頃', '一股作氣、一碧萬頃', '一鼓作氣、一碧萬傾', '一鼓作器、一碧萬頃'], '一鼓作氣、一碧萬頃。'],
      ['字音', '下列各組「」中的字，讀音「完全相同」的是？', ['「楫」／「輯」', '「誡」／「械」', '「惴」／「湍」', '「跫」／「踅」'], '楫、輯同讀 ㄐㄧˊ，其他三組都不同音。'],
      ['字詞義', '下列各組「」中字詞，意義「相同」的是？', ['不「以」物喜／「以」其無禮於晉', '「以」記之／「以」為東道主', '「以」何物／「以」其無禮於晉', '不「以」物喜／「以」為東道主'], '「以」：不以物喜＝因為，以其無禮於晉＝因為；以記之＝用來；以為東道主＝作為；以何物＝使用。'],
      ['字詞義', '「乃重修岳陽樓」與「乃不知有漢」兩句的「乃」，依序是？', ['於是／竟然', '竟然／於是', '於是／於是', '竟然／竟然'], '前者承接事件「於是」；後者表出乎意料「竟然」。'],
      ['成語', '下列句子，「」中成語使用最恰當的是？', ['他在談判桌上「折衝樽俎」，不費一兵一卒就化解危機', '他在酒席上「折衝樽俎」，喝得酩酊大醉', '政府施政良好，國家「折衝樽俎」，政通人和', '小孩「折衝樽俎」，把玩具搶了回來'], '折衝樽俎＝在談判桌（酒席）上用外交手段取勝。']
    ];
    var knTc = [
      ['字形', '（仿統測）下列詞語，何者書寫正確？', ['一碧萬頃', '一碧萬傾', '一壁萬頃', '一碧萬項'], '一碧萬頃。'],
      ['成語', '（仿統測）「政通人和」適合用來形容？', ['政治清明、人民和樂', '家庭和睦', '朋友相處融洽', '天氣良好'], '政通人和用於政治：政事順利、人民和諧。'],
      ['字詞義', '（仿統測）「不以物喜」的「以」意思是？', ['因為', '拿來', '作為', '用'], '以＝因為。'],
      ['成語', '（仿統測）「鐘鳴鼎食」形容的是？', ['富貴奢華', '生活儉樸', '勤儉持家', '貧困潦倒'], '鐘鳴鼎食：富貴人家吃飯時擊鐘列鼎，形容奢華。']
    ];
    C.units.push({ name: '二模常考知識（字形字音字詞義成語）', m: 2, qs: kn, hard: knHard, tc: knTc });
  }

  /* ================= 英文：B3 詞性與易混字 ================= */
  var E = subj('eng');
  if (E) {
    var wf = [
      ['詞性變化', 'The ___ of the new highway has made travel much faster. (improve)', ['improvement', 'improve', 'improving', 'improved'], 'the ___ of 要名詞：improve → improvement（B3L6）。'],
      ['詞性變化', 'The students gave an excellent ___ on stage. (perform)', ['performance', 'perform', 'performing', 'performed'], 'an excellent 後面要名詞：performance（B3L6）。'],
      ['詞性變化', 'Her ___ to study abroad surprised everyone. (decide)', ['decision', 'decide', 'decided', 'decisive'], '所有格後要名詞：decision（B1L1，複習）。'],
      ['詞性變化', 'Tom showed deep ___ to the teacher who helped him. (grateful)', ['gratitude', 'grateful', 'gratefully', 'grate'], 'deep 後要名詞：grateful → gratitude（B3L5）。'],
      ['詞性變化', 'The ___ of the company was in 1990. (establish)', ['establishment', 'establish', 'established', 'establishing'], 'the ___ of 要名詞：establishment。'],
      ['詞性變化', 'He is a very ___ student; he always gets full marks. (intelligence)', ['intelligent', 'intelligence', 'intelligently', 'intellect'], '修飾名詞 student 要形容詞：intelligent（B3L2）。'],
      ['詞性變化', 'The speech was very ___ and encouraged many young people. (inspire)', ['inspirational', 'inspiration', 'inspire', 'inspired'], '主詞 speech 是事物，形容詞用 inspirational（B3L2）。'],
      ['詞性變化', 'The sales ___ at the department store helped me find a gift. (assist)', ['assistant', 'assist', 'assisted', 'assistance'], 'sales assistant 店員（B3L4）。'],
      ['詞性變化', 'She walked ___ down the stairs in a long dress. (elegant)', ['elegantly', 'elegant', 'elegance', 'more elegant'], '修飾動詞 walked 要副詞：elegantly（B3L5）。'],
      ['詞性變化', 'The ___ of the school was held in the gym. (organize)', ['organization', 'organize', 'organizing', 'organized'], 'the ___ of 要名詞：organization（B3L3）。'],
      ['-ing / -ed', 'The movie was so ___ that I wanted to leave. (embarrass)', ['embarrassing', 'embarrassed', 'embarrass', 'embarrassment'], '事物令人尷尬用 -ing；人感到尷尬用 -ed（B3L1）。'],
      ['-ing / -ed', 'Tom felt ___ when he forgot his lines on stage.', ['embarrassed', 'embarrassing', 'embarrass', 'embarrassment'], '人的感受用 -ed（B3L1）。'],
      ['-ing / -ed', 'The speaker was so ___ that everyone wanted to follow his example.', ['inspiring', 'inspired', 'inspire', 'inspiration'], '事物（演講者）令人鼓舞用 -ing。'],
      ['一字多義', 'We need to ___ the information to the manager as soon as possible.', ['convey', 'bounce', 'vanish', 'skip'], 'convey 表達、傳達（B3L2）。'],
      ['片語', 'The book fell on the floor. Please ___ and put it on the shelf.', ['pick it up', 'pick up it', 'picking it up', 'pick it to'], '片語動詞的受詞是代名詞時要放中間：pick it up。'],
      ['片語', 'The teacher asked us to ___ our papers to her. (交給)', ['hand in', 'hand out', 'take part in', 'put up'], 'hand in 交上；hand out 分發；hand over 把……交給……（B3）。'],
      ['片語', 'The festival will ___ in the park next month.', ['take place', 'come about', 'put an end to', 'get over'], 'take place 舉行；不能用被動。'],
      ['片語', 'In addition to ___ English, he also learns Japanese.', ['studying', 'study', 'studied', 'to study'], 'in addition to + N／Ving（除……之外還有）。'],
      ['片語', 'If you keep eating too much junk food, you will end up ___ sick.', ['feeling', 'to feel', 'feel', 'felt'], 'end up + Ving／介系詞片語：最終……（B3L6）。']
    ];
    var wfHard = [
      ['-ing / -ed', 'Which sentence is correct?', ['The speech was inspiring, so the students felt inspired.', 'The speech was inspired, so the students felt inspiring.', 'The speech was inspiring, so the students felt inspiring.', 'The speech was inspired, so the students felt inspired.'], '事物（speech）用 -ing；人的感受（felt）用 -ed。'],
      ['片語', 'Which sentence is correct?', ['She picked it up and put it in her bag.', 'She picked up it and put it in her bag.', 'She picked it for and put it in her bag.', 'She picked up it for her bag.'], '代名詞要放在 pick 和 up 中間。'],
      ['片語', 'Which sentence is correct?', ['The meeting will take place next Friday.', 'The meeting will be taken place next Friday.', 'The meeting will be taking place next Friday.', 'The meeting will taken place next Friday.'], 'take place 是不及物片語，不能用被動語態。'],
      ['詞性變化', 'The ___ of the problem was a great relief to everyone. (solve)', ['solution', 'solve', 'solved', 'solving'], '依句意與空格位置，名詞 solution（B1L4）。'],
      ['-ing / -ed', 'Which is correct?', ['The embarrassing story made her embarrassed.', 'The embarrassed story made her embarrassing.', 'The embarrassing story made her embarrassing.', 'The embarrassed story made her embarrassed.'], 'story 令人尷尬 → embarrassing；she 感到尷尬 → embarrassed。']
    ];
    var wfTc = [
      ['詞性變化', '（仿統測）Her ______ in the school play won the audience\'s hearts. (perform)', ['performance', 'perform', 'performing', 'performed'], '所有格後要名詞 performance。'],
      ['-ing / -ed', '（仿統測）The test result was ______, so Mary felt disappointed. (disappoint)', ['disappointing', 'disappointed', 'disappoint', 'disappointment'], 'result（事物）用 -ing；Mary（人）感到用 -ed。'],
      ['片語', '（仿統測）The workers will ______ a tent for the event.', ['put up', 'get on', 'look up', 'go on'], 'put up 搭建（帳篷、舞臺）；get on 上車，look up 抬頭看，go on 繼續。'],
      ['片語', '（仿統測）Passengers should ______ the train before it leaves.', ['get on', 'get off', 'get over', 'get along'], 'get on 上（車），get off 下，get over 克服。'],
      ['詞性變化', '（仿統測）The company\'s ______ of the new rule surprised its workers. (announce)', ['announcement', 'announce', 'announced', 'announcing'], 'the … of 之間為名詞：announcement。']
    ];
    E.units.push({ name: '詞性與易混字（B3）', m: 2, qs: wf, hard: wfHard, tc: wfTc });
  }
})();
