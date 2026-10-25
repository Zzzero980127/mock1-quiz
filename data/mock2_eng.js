/* 二模新增（英文）：英文 III 單字片語（B3）＋二模文法。單元加在英文科最後，m:2 表示二模才出現。 */
(function () {
  var S = (window.QUIZ_DATA || []).filter(function (x) { return x.id === 'eng'; })[0];
  if (!S) return;
  S.desc2 = '英文 I～III';

  var VOCAB = {
    'B3L1': "culture|文化,cultural|文化的,valuable|寶貴的,value|價值,survive|倖存,fond|快樂美好的；喜愛的,greeting|問候,grab|抓取,cheek|臉頰,embarrassing|令人尷尬的,embarrass|使……感到尷尬,bounce|彈起；反彈,gesture|用手勢或動作表示,gesture|手勢；示意動作（n.）,pat|輕輕拍打,immediately|立刻,vanish|（突然地）消失,holy|神聖的,schedule|日程表,skip|省略；跳過,panic|驚慌,panic|驚慌（n.）,embrace|欣然接受；擁抱,except for|除……之外（不包括）,pick… up|把……撿起來；接送,look around|環顧四周,hand… over|把……交給……,get used to|習慣,first of all|首先,on the contrary|相反地",
    'B3L2': "entertain|使娛樂,entertainment|娛樂,convey|表達,request|要求,request|要求；請求（v.）,passion|熱愛,establish|創立；建立,failure|失敗,overcome|克服,character|角色；人物,career|事業；職業,inspirational|鼓舞人心的,inspiration|鼓舞人心的人事物,intelligence|聰明才智,intelligent|聰明的,identity|身分,expose|揭露,attitude|態度,appearance|外表,prove|證明,effort|努力,fulfill|實現,in addition to|除……之外,in other words|換句話說,pay off|有所回報,take… seriously|認真看待……,in turn|相應地,put… into…|投入（時間、心思等）",
    'B3L3': "normal|平常的；一般的,department|部門,reflect|反映；顯示,gender|性別,separate|（使）分開,display|陳列,display|展示（n.）,potential|潛在的,potential|潛力；可能性（n.）,physical|身體的,limit|限制,opportunity|機會,negative|負面的,effect|影響,organization|組織；機構,organize|組織；安排,promote|促進；宣傳,aim|力求達到,aim|目標（n.）,label|貼標籤,label|標籤（n.）,admit|承認,reduce|減少,based on|（以某事）為基礎,go along with|贊同,after all|畢竟,care about|在乎；關心,make a fresh start|重新開始,put an end to|終止,be/have a long way to go|很長的路要走",
    'B3L4': "authentic|道地的；真正的,exchange|交換,exchange|交換（v.）,program|計畫,highlight|亮點,highlight|強調（v.）,cheerful|興高采烈的,occupy|占據,occupation|職業,vehicle|車輛,pedestrian|行人,assistant|助手；助理,assist|協助,curious|好奇的,explain|解釋,originate|起源於,event|盛事,neighborhood|鄰近地區,arrange|安排,aspect|方面,spirit|精神,gather|聚集,remain|繼續存在；保持,take part in|參加,open one's eyes|令某人大開眼界,take place|舉行；發生,put up|搭建,come about|產生,hand out|分發",
    'B3L5': "gap|間隙,announcement|通知；公告,announce|公告；宣布,echo|發出回聲；迴盪,echo|回音（n.）,passenger|乘客,rush|趕緊,rush|匆忙（n.）,elegantly|典雅地；優美地,elegant|典雅的；優美的,bother|煩擾；打擾,slightly|稍微,emotional|情緒激動的,previous|先前的；以往的,warn|警告；提醒注意,replace|取代；代替,system|系統,disappear|消失,wonder|驚訝,wonder|想知道（v.）,digital|數位的,gratitude|感激,grateful|感激的,precious|珍貴的,look up|抬頭看,get off|下（公車、火車、飛機等）,make one's way to…|前往,go on|繼續；持續,get over|克服,get on|上（公車、火車、飛機等）",
    'B3L6': "behavior|行為,behave|行為舉止,signal|信號,accident|意外,improve|改善,improvement|改善；改進,safety|安全,perform|表演,performance|表演；表現,experiment|實驗,subway|地鐵,conduct|執行；實施,goal|目標,escalator|電扶梯,giant|巨大的,enormous|龐大的,appealing|吸引人的,appeal|吸引,motivate|激勵,motivation|動機,ordinary|普通的,activity|活動,spark|（激起靈感、活力、興奮等之）火花,positive|正面的；積極的,for the better|改善,lead to|導致,head for|前往,go up|（價格、數量等）上升,end up|最終……"
  };
  var LIST = [];
  Object.keys(VOCAB).forEach(function (L) {
    VOCAB[L].split(',').forEach(function (s) { var p = s.split('|'); LIST.push({ w: p[0], zh: p[1], L: L }); });
  });
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function distract(item, key) {
    var pool = shuffle(LIST.filter(function (x) { return x !== item && x.zh !== item.zh && x.w !== item.w && (x.w.indexOf(' ') >= 0 || /…/.test(x.w)) === (item.w.indexOf(' ') >= 0 || /…/.test(item.w)); }));
    var out = [], seen = {}; seen[item[key]] = 1;
    for (var i = 0; i < pool.length && out.length < 3; i++) { var v = pool[i][key]; if (!seen[v]) { seen[v] = 1; out.push(v); } }
    return out;
  }
  var vocabQs = LIST.reduce(function (acc, it) {
    var tag = it.L + ' 單字';
    acc.push({ t: tag, g: function () { return ['「' + it.w + '」的中文意思是？', [it.zh].concat(distract(it, 'zh')), it.w + '：' + it.zh + '（' + it.L + '）']; } });
    acc.push({ t: tag, g: function () { return ['「' + it.zh + '」的英文是？', [it.w].concat(distract(it, 'w')), it.zh + '：' + it.w + '（' + it.L + '）']; } });
    return acc;
  }, []);

  var vocabHard = [
    ['情境字彙', 'When the teacher asked why he was late, Ken could not think of a good excuse and felt very ___.', ['embarrassed', 'precious', 'elegant', 'digital'], 'embarrassed 感到尷尬的（B3L1）；人的感受用 -ed。'],
    ['情境字彙', 'The old vase is extremely ___; it has been in the family for over three hundred years.', ['valuable', 'cheerful', 'curious', 'previous'], 'valuable 寶貴的（B3L1）。'],
    ['情境字彙', 'Only two people managed to ___ the plane crash; the rest were not so lucky.', ['survive', 'conduct', 'convey', 'replace'], 'survive 倖存（B3L1）。'],
    ['情境字彙', 'Despite many failures, she never gave up and finally ___ her dream of becoming a pilot.', ['fulfilled', 'exposed', 'occupied', 'announced'], 'fulfill 實現（B3L2）。'],
    ['情境字彙', 'The company was ___ in 1990 by two college students with only a small loan.', ['established', 'admitted', 'reflected', 'originated'], 'establish 創立（B3L2）。'],
    ['情境字彙', 'Our math teacher is so ___ that she can solve any problem in seconds.', ['intelligent', 'intelligence', 'holy', 'slightly'], '空格前有 so、後無名詞，用形容詞 intelligent（B3L2）；intelligence 是名詞。'],
    ['情境字彙', 'The government plans to ___ the use of plastic bags to protect the environment.', ['reduce', 'prove', 'skip', 'bounce'], 'reduce 減少（B3L3）；plans to reduce the use of。'],
    ['情境字彙', 'The study shows that too much screen time has a ___ effect on children\'s eyesight.', ['negative', 'ordinary', 'cheerful', 'digital'], 'negative effect on 對……有負面影響（B3L3）。'],
    ['情境字彙', 'Passengers are asked to ___ the train quietly and not to push each other.', ['get off', 'go on', 'look up', 'take part in'], 'get off 下（公車、火車、飛機）（B3L5）。'],
    ['情境字彙', 'The loud ___ in the station told the passengers that the train would be twenty minutes late.', ['announcement', 'exchange', 'occupation', 'experiment'], 'announcement 通知；公告（B3L5）。'],
    ['情境字彙', 'The fire alarm gave a loud ___, and everybody rushed out of the building.', ['signal', 'spirit', 'vehicle', 'aspect'], 'signal 信號（B3L6）。'],
    ['情境字彙', 'If you keep this attitude, your life will definitely change ___.', ['for the better', 'in turn', 'after all', 'first of all'], 'for the better 往好的方向改善（B3L6）。'],
    ['詞性變化', 'The ___ of the new MRT line has made travel in the city much faster.', ['improvement', 'improve', 'improving', 'improved'], 'improve → improvement（B3L6）；the ___ of 要名詞。'],
    ['詞性變化', 'Tom showed his deep ___ to everyone who had helped him.', ['gratitude', 'grateful', 'gratefully', 'grate'], 'grateful（adj.）→ gratitude（n.），空格在 deep 後要名詞（B3L5）。'],
    ['詞性變化', 'Her ___ in the school play impressed every member of the audience.', ['performance', 'perform', 'performed', 'performing'], 'perform → performance（B3L6）。'],
    ['詞組', 'Mr. Lin has been a teacher for thirty years, and he still ___ every class seriously.', ['takes', 'puts', 'gets', 'goes'], 'take… seriously 認真看待……（B3L2）。'],
    ['詞組', 'The annual art festival will ___ in the park next Sunday.', ['take place', 'come about', 'put an end to', 'hand over'], 'take place 舉行（B3L4）；take place 不用被動。'],
    ['詞組', 'Hard work will finally ___; just keep trying.', ['pay off', 'end up', 'look around', 'hand out'], 'pay off 有所回報（B3L2）。']
  ];

  var vocabTc = [
    ['單字題', '（仿統測）The engineer ______ the new design to the clients with a short video.', ['conveyed', 'bounced', 'vanished', 'embraced'], 'convey 傳達、表達（B3L2）。bounce 彈起；vanish 消失；embrace 擁抱、欣然接受。'],
    ['單字題', '（仿統測）After the heavy rain, the bridge was closed to all ______ except pedestrians.', ['vehicles', 'spirits', 'gestures', 'gaps'], 'vehicle 車輛；pedestrian 行人（B3L4）。'],
    ['單字題', '（仿統測）The students were asked to ______ the experiment carefully and write a report afterwards.', ['conduct', 'replace', 'warn', 'skip'], 'conduct an experiment 進行實驗（B3L6）。replace 取代；warn 警告；skip 跳過。'],
    ['詞性變化', '（仿統測）The ______ of the new rule will be announced by the school next week.', ['introduction', 'introduce', 'introduced', 'introducing'], '空格在 the … of 之間，要名詞 introduction。'],
    ['詞組', '（仿統測）The workers were asked to ______ the posters before the event started.', ['put up', 'get over', 'go along with', 'look around'], 'put up 張貼、搭建（B3L4）。get over 克服；go along with 贊同；look around 環顧四周。']
  ];

  var gramQs = [
    ['被動語態', 'The window ___ by Tom yesterday.', ['was broken', 'broke', 'was breaking', 'has broken'], '主詞 window 是被打破的，用過去式被動 was + p.p.，後面有 by Tom。'],
    ['被動語態', 'English ___ in many countries around the world.', ['is spoken', 'speaks', 'is speaking', 'spoke'], '英語「被說」，現在簡單式被動 is spoken。'],
    ['被動語態', 'The new bridge ___ next year.', ['will be completed', 'will complete', 'will be completing', 'completes'], '橋「被完成」，未來式被動 will be + p.p.。'],
    ['被動語態', 'The homework must ___ before Friday.', ['be handed in', 'hand in', 'be handing in', 'to be handed in'], '助動詞後接被動：must be + p.p.。'],
    ['被動語態', 'Don\'t go that way. The road ___ now.', ['is being repaired', 'is repairing', 'repairs', 'has repaired'], '正在被修理：進行式被動 is being + p.p.。'],
    ['被動語態', 'By the time we arrived, all the tickets ___.', ['had been sold', 'were selling', 'have sold', 'had sold'], '到達之前（過去完成）票已「被賣光」：had been + p.p.。'],
    ['使役與感官動詞', 'My mother made me ___ my room before dinner.', ['clean', 'to clean', 'cleaning', 'cleaned'], 'make + O + 原形動詞（主動）。'],
    ['使役與感官動詞', 'I had my bike ___ yesterday.', ['repaired', 'repair', 'to repair', 'repairing'], 'have + O + p.p.：O 是被處理的東西（腳踏車被修理）。'],
    ['使役與感官動詞', 'He had his wallet ___ on the bus.', ['stolen', 'steal', 'to steal', 'stealing'], '錢包「被偷」，have + O + p.p.（遭遇）。'],
    ['使役與感官動詞', 'Mom let me ___ out with my friends last night.', ['go', 'to go', 'going', 'gone'], 'let + O + 原形動詞。'],
    ['使役與感官動詞', 'Can you help me ___ the table into the kitchen?', ['carry', 'carried', 'carries', 'carrying'], 'help + O + (to) VR，to 可省略；沒有 -ing／p.p. 的用法。'],
    ['使役與感官動詞', 'She watched the little boy ___ the street carefully.', ['cross', 'to cross', 'crossed', 'crosses'], '感官動詞 watch + O + VR（看到動作的全部）；也可用 Ving（正在進行）。'],
    ['強調句與虛主詞', 'It was Tom ___ broke the window, not Jack.', ['who', 'whom', 'whose', 'what'], '強調句 It is／was + 強調部分 + that（人可用 who）+ 其餘。這裡強調主詞 Tom，用 who／that。'],
    ['強調句與虛主詞', 'It was in Paris ___ they first met.', ['that', 'where', 'which', 'when'], '強調地方副詞：It was + 地方 + that …，不能改用 where。'],
    ['強調句與虛主詞', 'It was not until midnight ___ he came home.', ['that', 'when', 'which', 'did'], 'It was not until … that … 直到……才……。'],
    ['強調句與虛主詞', 'It is important ___ we arrive on time.', ['that', 'what', 'which', 'whether'], '虛主詞 It，真主詞是 that 子句：It is important that + S + V。'],
    ['強調句與虛主詞', 'It is hard ___ the answer to this question.', ['to find', 'finding', 'find', 'found'], 'It is + adj. + to VR：虛主詞 It，真主詞是不定詞。'],
    ['關係詞', 'The man ___ lives next door is a doctor.', ['who', 'whom', 'which', 'whose'], '先行詞是人，關代在子句中當主詞（後面直接接動詞 lives）→ who／that。'],
    ['關係詞', 'This is the girl ___ bag was stolen yesterday.', ['whose', 'who', 'whom', 'which'], '所有格：the girl 的 bag → whose。'],
    ['關係詞', 'The book ___ I bought yesterday is very interesting.', ['which', 'who', 'whose', 'where'], '先行詞是物，關代在子句中當受詞 → which／that（可省略）。'],
    ['關係詞', 'This is the place ___ I was born.', ['where', 'which', 'who', 'whose'], '先行詞是地方，子句中 I was born 已完整（缺地方副詞）→ where。'],
    ['關係詞', 'I know the reason ___ he was late.', ['why', 'where', 'who', 'what'], '先行詞 reason → why。'],
    ['關係詞', 'My brother, ___ lives in Tokyo, is a chef.', ['who', 'that', 'whom', 'which'], '非限定用法（有逗號）不能用 that；先行詞是人、當主詞 → who。'],
    ['關係詞', 'The movie, ___ I watched last night, was boring.', ['which', 'that', 'who', 'what'], '非限定用法（逗號後）不能用 that；先行詞是物 → which。']
  ];

  var gramHard = [
    ['被動語態', 'Which sentence is grammatically correct?', ['The new library was opened to the public last month.', 'The accident was happened at midnight.', 'A lot of trees were fallen in the storm.', 'The meeting will be taken place next week.'], 'happen、fall、take place 都是不及物動詞，不能用被動；open 是及物動詞，可以被動。'],
    ['被動語態', 'The boy ___ by his teacher for telling the truth.', ['was praised', 'praised', 'was praising', 'has praised'], '男孩被老師稱讚，過去式被動 was praised；後面有 by + 人。'],
    ['使役與感官動詞', 'I couldn\'t make myself ___ in such a noisy café.', ['understood', 'understand', 'to understand', 'understanding'], 'make oneself understood 讓別人聽懂（oneself 與 understand 是被動關係，用 p.p.）。'],
    ['使役與感官動詞', 'Which sentence is correct?', ['The coach made the players run ten laps.', 'The coach made the players to run ten laps.', 'The players were made run ten laps.', 'The coach let the players to rest.'], 'make／let + O + 原形；make 改被動才加 to（The players were made to run），let 通常不改被動。'],
    ['強調句與虛主詞', 'It was not until he lost his job ___ he realized the value of money.', ['that', 'did', 'when', 'which'], 'It was not until A that B：直到 A 才 B；that 後面用正常語序（he realized）。'],
    ['強調句與虛主詞', 'It is no use ___ over spilt milk.', ['crying', 'to cry', 'cry', 'cried'], 'It is no use + Ving（做……沒有用）。'],
    ['強調句與虛主詞', 'Which sentence is a correct emphatic sentence (強調句)?', ['It was yesterday that I met Amy at the station.', 'It was yesterday when I met Amy at the station.', 'It was yesterday which I met Amy at the station.', 'It yesterday was that I met Amy at the station.'], '強調句句型：It + be + 被強調部分 + that + 其餘；時間副詞被強調時用 that，不用 when。'],
    ['關係詞', 'The professor, ___ research focuses on climate change, will give a talk tomorrow.', ['whose', 'who', 'which', 'whom'], 'professor 的 research → 所有格 whose。'],
    ['關係詞', 'This is the house in ___ the famous writer once lived.', ['which', 'that', 'where', 'whom'], '介系詞 + 關代：in which（先行詞是物）；介系詞後不能用 that。'],
    ['關係詞', 'He passed the exam, ___ surprised everyone.', ['which', 'that', 'what', 'who'], '前面整個句子當先行詞，用非限定 which（that 不能用於逗號後）。'],
    ['關係詞', 'All ___ I want is a quiet place to study.', ['that', 'which', 'what', 'who'], '先行詞是 all 時，關代用 that。'],
    ['關係詞', 'Which sentence is grammatically correct?', ['The girl who is standing there is my cousin.', 'The girl who she is standing there is my cousin.', 'The girl whom is standing there is my cousin.', 'The girl which is standing there is my cousin.'], '關代已經代替 the girl，子句不能再重複主詞（不能 who she）；人當主詞用 who，不是 whom 或 which。']
  ];

  var gramTc = [
    ['被動語態', '（仿統測）The old bridge ______ by the city government next year.', ['will be rebuilt', 'will rebuild', 'is rebuilding', 'rebuilt'], 'bridge 被重建；有 next year，未來式被動 will be + p.p.。'],
    ['使役與感官動詞', '（仿統測）The manager had the engineer ______ the report again before the meeting.', ['check', 'to check', 'checked', 'checking'], 'have + 人 + 原形：請工程師檢查。'],
    ['使役與感官動詞', '（仿統測）The teacher heard someone ______ in the next classroom, so she went to take a look.', ['laugh', 'to laugh', 'laughed', 'be laughed'], '感官動詞 hear + O + VR／Ving，不用 to。'],
    ['強調句與虛主詞', '（仿統測）It was Sunday ______ the company held its annual party.', ['that', 'when', 'where', 'what'], '強調時間：It was Sunday that …。'],
    ['強調句與虛主詞', '（仿統測）It is ______ that students should learn to take care of themselves.', ['necessary', 'necessity', 'necessarily', 'necessities'], 'It is + adj. + that 子句；空格要形容詞 necessary。'],
    ['關係詞', '（仿統測）The company ______ products are sold all over the world was founded in 1990.', ['whose', 'who', 'which', 'what'], 'company 的 products → whose。'],
    ['關係詞', '（仿統測）The engineer, ______ designed this tunnel, will give a speech tomorrow.', ['who', 'which', 'whom', 'that'], '非限定、先行詞是人、當主詞 → who；that 不能用在逗號之後。']
  ];

  S.units.push({ name: '英文 III 單字片語（B3）', m: 2, qs: vocabQs, hard: vocabHard, tc: vocabTc });
  S.units.push({ name: '文法（二模新增）', m: 2, qs: gramQs, hard: gramHard, tc: gramTc });
})();
