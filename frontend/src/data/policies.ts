export const DUMMY_POLICIES = [
  {
    id: "1",
    title: "地域活性化のための商店街振興策",
    purpose: "地域経済の活性化と商店街の賑わい創出",
    overview:
      "シャッター街となっている商店街に新しい店舗を誘致し、イベント開催を支援することで、若者から高齢者までが楽しめる活気ある商店街を目指します。",
    detailedPlan:
      "商店街の空き店舗を対象に、新規出店者への家賃補助（最大6ヶ月）、内装工事費の一部助成（上限50万円）を行います。また、毎月第3土曜日には「わくわく商店街マルシェ」を開催し、地域住民と連携した集客イベントを企画します。",
    problems: [
      "商店街の空き店舗増加",
      "地域経済の低迷",
      "住民の交流機会の減少",
    ],
    benefits: ["地域経済の活性化", "雇用機会の創出", "住民の交流促進"],
    drawbacks: [
      "初期投資が必要",
      "既存店舗との競合の可能性",
      "効果が出るまでに時間がかかる",
    ],
    year: 2025,
    keywords: ["地域活性化", "商店街", "経済", "雇用", "イベント"],
    relatedEvents: [
      "2025年4月10日: 新規出店者向け説明会",
      "2025年5月18日: わくわく商店街マルシェ (5月開催)",
      "2025年6月15日: わくわく商店街マルシェ (6月開催)",
      "2025年7月20日: 商店街夏祭り企画会議",
      "2025年8月24日: わくわく商店街マルシェ (8月開催)",
    ],
    upvotes: 15,
    downvotes: 2,
    budget: 50000000, // 5千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [
      // 市民の声ダミーデータ
      {
        id: "c1",
        author: "匿名市民A",
        text: "商店街に活気が戻るのは素晴らしい！期待しています！",
        timestamp: "2025-05-20 10:30",
        upvotes: 5,
        downvotes: 0,
      },
      {
        id: "c2",
        author: "山田太郎",
        text: "イベントの企画にぜひ参加したいです。",
        timestamp: "2025-05-20 14:00",
        upvotes: 3,
        downvotes: 1,
      },
      {
        id: "c3",
        author: "鈴木花子",
        text: "若い人向けの新しいお店が増えると嬉しいです。",
        timestamp: "2025-05-21 09:15",
        upvotes: 2,
        downvotes: 0,
      },
    ],
  },
  {
    id: "2",
    title: "子育て支援拡充プロジェクト",
    purpose: "安心して子育てができる環境の整備",
    overview:
      "保育所の待機児童解消を目指し、新規保育所の開設支援や、子育て世代への経済的補助を拡充します。また、子育て相談窓口の設置も行います。",
    detailedPlan:
      "市内3ヶ所に新たな認可保育所を新設（2024年度中に開園）。0歳児から2歳児までの保育料を月額5,000円補助します。さらに、各区役所に「子育てコンシェルジュ」を配置し、個別の相談対応を強化します。",
    problems: [
      "保育所の待機児童問題",
      "子育て世帯の経済的負担",
      "子育てに関する相談窓口の不足",
    ],
    benefits: [
      "待機児童の解消",
      "子育て世帯の負担軽減",
      "安心して子育てできる環境",
    ],
    drawbacks: [
      "財政負担の増加",
      "保育士不足の課題",
      "施設の確保が難しい場合がある",
    ],
    year: 2024,
    keywords: ["子育て", "保育", "支援", "福祉", "教育"],
    relatedEvents: [
      "2024年4月3日: 子育てコンシェルジュ相談会 (初回)",
      "2024年5月10日: 新規保育所建設地説明会",
      "2024年6月12日: 子育て支援セミナー「幼児期の食育」",
      "2024年7月5日: 子育てコンシェルジュ相談会",
      "2024年9月1日: 新規保育所内覧会",
      "2024年10月20日: 育児休業明け復帰支援ワークショップ",
    ],
    upvotes: 20,
    downvotes: 5,
    budget: 120000000, // 1億2千万円
    status: "完了", // 新しいステータスフィールド
    comments: [
      {
        id: "c4",
        author: "匿名市民B",
        text: "待機児童が減るのは本当に助かります。",
        timestamp: "2024-11-01 08:00",
        upvotes: 8,
        downvotes: 1,
      },
      {
        id: "c5",
        author: "田中一郎",
        text: "保育士の待遇改善も同時に進めてほしいです。",
        timestamp: "2024-11-02 11:20",
        upvotes: 6,
        downvotes: 2,
      },
    ],
  },
  {
    id: "3",
    title: "環境に優しいまちづくり推進計画",
    purpose: "持続可能な社会の実現と住民の健康増進",
    overview:
      "再生可能エネルギーの導入を促進し、公共交通機関の利用を推奨します。また、ごみの減量化とリサイクル率向上を目指し、住民への啓発活動を強化します。",
    detailedPlan:
      "市有施設への太陽光パネル設置を推進し、2025年までに電力の10%を再生可能エネルギーで賄うことを目標とします。公共交通機関の利用促進のため、定期券購入補助（月額1,000円）を実施。ごみ分別アプリを開発し、住民への情報提供を強化します。",
    problems: ["地球温暖化の進行", "大気汚染", "ごみ問題とリサイクル率の低迷"],
    benefits: [
      "地球温暖化対策",
      "空気の質の改善",
      "資源の有効活用",
      "住民の環境意識向上",
    ],
    drawbacks: [
      "導入コストが高い",
      "住民の協力が必要",
      "短期間での効果が見えにくい",
    ],
    year: 2023,
    keywords: ["環境", "エコ", "再生可能エネルギー", "ごみ", "リサイクル"],
    relatedEvents: [
      "2023年5月15日: エコライフフェア",
      "2023年7月1日: ごみ分別アプリ説明会",
      "2023年9月10日: ゼロウェイストワークショップ",
      "2023年11月5日: 再生可能エネルギー導入説明会",
    ],
    upvotes: 12,
    downvotes: 3,
    budget: 80000000, // 8千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "4",
    title: "高齢者向けデジタルデバイド解消事業",
    purpose: "高齢者の情報格差をなくし、社会参加を促進",
    overview:
      "高齢者向けのスマートフォン・タブレット教室を定期的に開催し、デジタル機器の操作方法やインターネットの安全な利用方法を指導します。",
    detailedPlan:
      "市内公民館で月2回、スマートフォン・タブレットの基礎講座（全5回コース）を開催。受講料は無料。インターネットの安全な利用に関するパンフレットを作成し、全戸配布します。",
    problems: [
      "高齢者のデジタル機器操作の困難さ",
      "情報格差の拡大",
      "インターネット詐欺被害の増加",
    ],
    benefits: [
      "情報格差の解消",
      "高齢者のQOL向上",
      "社会参加の促進",
      "詐欺被害の防止",
    ],
    drawbacks: [
      "参加者の意欲に左右される",
      "講師の確保が課題",
      "継続的な支援が必要",
    ],
    year: 2022,
    keywords: ["高齢者", "デジタル", "情報格差", "教育", "社会参加"],
    relatedEvents: [
      "2022年6月1日: スマホ・タブレット無料体験会 (初回)",
      "2022年7月7日: デジタル相談会",
      "2022年8月15日: LINE活用講座",
      "2022年9月20日: ネット詐欺対策セミナー",
    ],
    upvotes: 8,
    downvotes: 1,
    budget: 25000000, // 2千5百万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "5",
    title: "防災意識向上キャンペーン",
    purpose: "災害に強いまちづくりと住民の安全確保",
    overview:
      "地震や水害などの自然災害に備え、避難訓練の実施回数を増やし、防災マップの全戸配布を行います。また、地域の自主防災組織の活動を支援します。",
    detailedPlan:
      "年間4回の地域合同避難訓練を実施し、参加率80%を目指します。最新のハザードマップを全戸配布し、オンラインでも閲覧可能にします。自主防災組織への活動補助金を増額（1団体あたり上限10万円）。",
    problems: [
      "住民の防災意識の低さ",
      "災害時の避難行動の混乱",
      "地域防災組織の活動不足",
    ],
    benefits: ["災害時の被害軽減", "住民の防災意識向上", "地域の連携強化"],
    drawbacks: ["住民の参加率に課題", "訓練の準備に手間がかかる", "予算の確保"],
    year: 2022,
    keywords: ["防災", "災害", "避難", "安全", "地域"],
    relatedEvents: [
      "2022年5月1日: 地域合同防災訓練 (春)",
      "2022年7月15日: 防災講演会「わが家の備え」",
      "2022年9月1日: 地域合同防災訓練 (秋)",
      "2022年11月10日: 防災グッズ展示会",
    ],
    upvotes: 18,
    downvotes: 4,
    budget: 40000000, // 4千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "6",
    title: "公共交通機関の利便性向上プロジェクト",
    purpose: "市民の移動手段の多様化と利便性向上",
    overview:
      "バス路線の増設と運行間隔の短縮、デマンド交通の導入により、公共交通機関の利用を促進し、地域住民の移動をよりスムーズにします。",
    detailedPlan:
      "主要バス路線の運行本数を20%増便し、最終便の時間を30分延長します。高齢者や交通不便地域を対象に、AIを活用したオンデマンド型乗合タクシー「どこでもGO」を導入します。",
    problems: [
      "交通渋滞の悪化",
      "公共交通機関の利便性不足",
      "高齢者の移動困難",
    ],
    benefits: [
      "交通渋滞の緩和",
      "CO2排出量の削減",
      "高齢者の移動支援",
      "地域コミュニティの活性化",
    ],
    drawbacks: [
      "運行コストの増加",
      "路線の採算性維持",
      "住民の理解と協力が必要",
    ],
    year: 2025,
    keywords: ["交通", "バス", "デマンド交通", "移動", "利便性"],
    relatedEvents: [
      "2025年3月1日: 「どこでもGO」導入説明会 (北部地域)",
      "2025年4月15日: 公共交通利用促進キャンペーン開始",
      "2025年6月1日: 「どこでもGO」導入説明会 (南部地域)",
      "2025年8月10日: バス路線改善に関する市民意見交換会",
    ],
    upvotes: 10,
    downvotes: 1,
    budget: 75000000, // 7千5百万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "7",
    title: "文化芸術振興支援プログラム",
    purpose: "市民の文化芸術活動の活性化と地域文化の継承",
    overview:
      "地域の文化施設でのイベント開催支援、若手アーティストへの活動助成、伝統芸能の継承に向けたワークショップの実施などを行います。",
    detailedPlan:
      "市民文化会館での年間イベント数を1.5倍に増やし、市民団体への施設利用料を50%減額します。若手アーティスト育成のため、制作費補助（上限30万円）と発表の場を提供。伝統芸能の体験ワークショップを月1回開催します。",
    problems: [
      "市民の文化芸術活動の停滞",
      "若手アーティストの育成不足",
      "伝統芸能の継承困難",
    ],
    benefits: [
      "文化的な生活の充実",
      "地域アイデンティティの強化",
      "観光客誘致",
      "若手育成",
    ],
    drawbacks: ["予算の確保", "一部住民への偏り", "効果の測定が難しい"],
    year: 2024,
    keywords: ["文化", "芸術", "イベント", "伝統", "観光"],
    relatedEvents: [
      "2024年4月5日: 若手アーティスト支援プログラム説明会",
      "2024年6月1日: 伝統芸能体験ワークショップ「能楽に触れる」",
      "2024年8月10日: 市民芸術祭プレイベント",
      "2024年10月25日: 市民芸術祭本祭",
    ],
    upvotes: 14,
    downvotes: 2,
    budget: 30000000, // 3千万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "8",
    title: "健康寿命延伸サポート事業",
    purpose: "市民の健康増進と医療費の抑制",
    overview:
      "ウォーキングイベントの定期開催、健康相談窓口の設置、特定健診の受診率向上キャンペーンを実施し、市民の健康寿命を延ばすことを目指します。",
    detailedPlan:
      "市内各所で月2回「健康ウォーキング教室」を開催。保健センターに常設の健康相談窓口を設置し、専門家が対応します。特定健診の受診率を80%に向上させるため、インセンティブ制度を導入します。",
    problems: ["市民の生活習慣病増加", "医療費の増加", "健康に関する情報不足"],
    benefits: [
      "医療費の削減",
      "生活習慣病の予防",
      "市民のQOL向上",
      "地域コミュニティの強化",
    ],
    drawbacks: [
      "参加者の意欲に左右される",
      "継続的な取り組みが必要",
      "効果が出るまでに時間がかかる",
    ],
    year: 2023,
    keywords: ["健康", "医療", "高齢者", "予防", "運動"],
    relatedEvents: [
      "2023年4月1日: 健康ウォーキング教室 (初回)",
      "2023年6月15日: 特定健診受診促進イベント",
      "2023年8月20日: 栄養バランス講座",
      "2023年10月1日: 健康ウォーキング教室 (秋期開始)",
    ],
    upvotes: 22,
    downvotes: 6,
    budget: 60000000, // 6千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "9",
    title: "地域農業活性化プロジェクト",
    purpose: "地産地消の推進と農業の担い手育成",
    overview:
      "新規就農者への補助金制度の拡充、市民農園の整備、地元の農産物を使ったイベント開催支援などを行い、地域農業の活性化を図ります。",
    detailedPlan:
      "新規就農者に対し、初期投資費用として最大100万円の補助金と、農業技術研修プログラムを提供します。市内3ヶ所に市民農園を新設し、気軽に農業体験ができる場を提供。地元の農産物を使った「収穫祭」を毎年開催します。",
    problems: ["農業の担い手不足", "耕作放棄地の増加", "食料自給率の低下"],
    benefits: ["食の安全保障", "地域経済の活性化", "食育の推進", "景観の保全"],
    drawbacks: ["初期投資が必要", "天候に左右される", "担い手不足の課題"],
    year: 2025,
    keywords: ["農業", "地産地消", "食育", "担い手", "経済"],
    relatedEvents: [
      "2025年2月1日: 新規就農者向け説明会",
      "2025年5月20日: 市民農園開園式",
      "2025年9月15日: 収穫祭",
      "2025年11月1日: 地産地消フェア",
    ],
    upvotes: 9,
    downvotes: 0,
    budget: 90000000, // 9千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "10",
    title: "観光振興戦略「魅力発見！わがまち」",
    purpose: "地域経済の活性化と市のブランド力向上",
    overview:
      "市の隠れた魅力を発掘し、SNSを活用した情報発信、体験型観光プログラムの開発、地元特産品のブランド化を推進し、観光客誘致を図ります。",
    detailedPlan:
      "市の公式観光サイトをリニューアルし、多言語対応を強化。インスタグラムと連携したフォトコンテストを年間を通して実施。地元ガイドによる「まち歩きツアー」や、伝統工芸体験などのプログラムを開発・提供します。",
    problems: ["観光客の減少", "市の知名度不足", "地域経済の停滞"],
    benefits: ["観光客増加", "地域経済の活性化", "雇用創出", "市の知名度向上"],
    drawbacks: [
      "過剰な観光客による問題",
      "自然環境への影響",
      "住民の理解と協力が必要",
    ],
    year: 2024,
    keywords: ["観光", "地域活性化", "ブランド", "SNS", "体験"],
    relatedEvents: [
      "2024年3月10日: 公式観光サイトリニューアル記念イベント",
      "2024年5月1日: まち歩きツアー開始",
      "2024年7月20日: 伝統工芸体験ワークショップ",
      "2024年9月5日: フォトコンテスト表彰式",
    ],
    upvotes: 17,
    downvotes: 3,
    budget: 45000000, // 4千5百万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "11",
    title: "街路樹の緑化推進と維持管理",
    purpose: "都市景観の向上とヒートアイランド現象の緩和",
    overview:
      "市内の主要な街路に多様な種類の樹木を植樹し、定期的な剪定や病害虫対策を行うことで、緑豊かな都市環境を整備します。",
    detailedPlan:
      "主要幹線道路沿いに、高木を500本、低木を1000本植樹します。専門業者による定期的な剪定と病害虫駆除を年間を通して実施。住民参加型の植樹イベントも開催します。",
    problems: ["都市部のヒートアイランド現象", "街路樹の老朽化", "景観の悪化"],
    benefits: [
      "景観の美化",
      "CO2吸収",
      "ヒートアイランド緩和",
      "住民の憩いの場",
    ],
    drawbacks: ["維持管理コスト", "落ち葉の清掃負担", "一部住民への日照阻害"],
    year: 2023,
    keywords: ["緑化", "景観", "環境", "都市", "維持管理"],
    relatedEvents: [
      "2023年4月20日: 市民植樹デー",
      "2023年6月10日: 緑化ボランティア説明会",
      "2023年8月1日: 街路樹の病害虫対策講習会",
    ],
    upvotes: 11,
    downvotes: 1,
    budget: 35000000, // 3千5百万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "12",
    title: "空き家活用促進事業",
    purpose: "空き家問題の解消と定住人口の増加",
    overview:
      "市内の空き家をリノベーションし、子育て世帯や若者への賃貸・売却を促進します。空き家バンクの運営や改修費補助も行います。",
    detailedPlan:
      "市内の空き家情報を集約した「空き家バンク」をオンラインで公開。空き家を改修して移住する子育て世帯に対し、最大150万円の補助金を交付します。地域住民との交流イベントも開催します。",
    problems: ["空き家の増加と老朽化", "定住人口の減少", "地域の活力低下"],
    benefits: ["定住人口の増加", "地域の活性化", "景観の改善", "税収増"],
    drawbacks: ["改修費の確保", "所有者の理解", "立地条件による差"],
    year: 2022,
    keywords: ["空き家", "定住", "リノベーション", "人口", "地域活性化"],
    relatedEvents: [
      "2022年3月5日: 空き家活用セミナー (基礎編)",
      "2022年7月1日: 移住者交流会",
      "2022年10月10日: 空き家リノベーション事例発表会",
    ],
    upvotes: 16,
    downvotes: 4,
    budget: 70000000, // 7千万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "13",
    title: "市民参加型ワークショップの開催",
    purpose: "市民の市政への参画意識向上と意見の反映",
    overview:
      "特定の政策テーマについて、市民が自由に意見交換できるワークショップを定期的に開催し、政策立案に市民の声を反映させます。",
    detailedPlan:
      "年間6回のテーマ別ワークショップ（例:「○○駅周辺のまちづくり」「ごみ減量化のアイデア」など）を開催。オンラインでの意見募集も並行して実施し、集まった意見は政策立案の参考にします。",
    problems: [
      "市民の市政への関心不足",
      "行政と市民の間の意見の乖離",
      "政策立案プロセスの不透明性",
    ],
    benefits: [
      "市民満足度向上",
      "政策の質向上",
      "行政への信頼感",
      "主体的な市民育成",
    ],
    drawbacks: ["参加者の偏り", "意見集約の難しさ", "時間とコスト"],
    year: 2025,
    keywords: ["市民参加", "ワークショップ", "意見", "政策", "協働"],
    relatedEvents: [
      "2025年1月20日: 第1回ワークショップ「未来のまちづくり」",
      "2025年3月15日: オンライン意見募集開始",
      "2025年5月25日: 第2回ワークショップ「防災と地域の安全」",
      "2025年7月30日: 市民意見交換会",
    ],
    upvotes: 25,
    downvotes: 1,
    budget: 20000000, // 2千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "14",
    title: "学校施設のバリアフリー化推進",
    purpose: "誰もが学びやすい教育環境の整備",
    overview:
      "市内の小中学校の校舎や体育館にエレベーターやスロープを設置し、多機能トイレの整備を進めることで、障害のある児童生徒も安心して学べる環境を整えます。",
    detailedPlan:
      "2024年度中に市内全小中学校の主要施設にスロープを設置。2025年度末までに、各学校に1箇所以上の多機能トイレを整備。エレベーター設置については、大規模改修時に順次対応します。",
    problems: [
      "障害のある児童生徒の教育環境の不備",
      "学校施設利用における不便さ",
      "多様性を尊重する社会の実現への課題",
    ],
    benefits: [
      "教育機会の均等",
      "安全性の向上",
      "多様性の尊重",
      "共生社会の実現",
    ],
    drawbacks: ["大規模な改修費用", "工事期間中の影響", "既存施設の制約"],
    year: 2024,
    keywords: ["教育", "バリアフリー", "学校", "福祉", "インクルーシブ"],
    relatedEvents: [
      "2024年2月10日: 保護者向け学校施設見学会 (A小学校)",
      "2024年5月1日: バリアフリーに関する意見交換会",
      "2024年8月15日: 保護者向け学校施設見学会 (B中学校)",
    ],
    upvotes: 19,
    downvotes: 0,
    budget: 150000000, // 1億5千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "15",
    title: "地域コミュニティスペースの整備",
    purpose: "住民の交流促進と孤立防止",
    overview:
      "高齢者や子育て世代が気軽に集える多世代交流スペースを地域ごとに整備し、イベントやサークル活動の場を提供します。",
    detailedPlan:
      "各小学校区に1ヶ所、空き店舗や公共施設を活用したコミュニティスペースを整備。子育てサロンや高齢者サロン、手芸教室などを開催し、住民が自由に利用できる時間帯を設けます。",
    problems: [
      "住民の孤立化",
      "地域コミュニティの希薄化",
      "多世代交流の機会不足",
    ],
    benefits: [
      "住民の孤立防止",
      "地域連携強化",
      "多世代交流",
      "安心できる居場所",
    ],
    drawbacks: ["運営費の確保", "利用者のニーズ把握", "管理者の負担"],
    year: 2023,
    keywords: ["コミュニティ", "交流", "多世代", "居場所", "地域"],
    relatedEvents: [
      "2023年4月10日: コミュニティスペース開設記念イベント",
      "2023年6月1日: 多世代交流イベント「世代を超えたゲーム大会」",
      "2023年9月5日: コミュニティスペース運営ボランティア募集説明会",
    ],
    upvotes: 13,
    downvotes: 2,
    budget: 40000000, // 4千万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "16",
    title: "デジタル行政サービス拡充計画",
    purpose: "市民の利便性向上と行政手続きの効率化",
    overview:
      "オンラインでの申請手続きを増やし、スマートフォンアプリからの情報提供を強化します。行政手続きのデジタル化を推進し、窓口での待ち時間を削減します。",
    detailedPlan:
      "住民票の写しや印鑑登録証明書などのオンライン申請を2025年までに導入。市の公式LINEアカウントを通じた情報発信を強化し、災害情報やイベント情報をリアルタイムで提供します。",
    problems: [
      "行政手続きの複雑さ",
      "窓口での待ち時間の長さ",
      "情報アクセスの不便さ",
    ],
    benefits: [
      "手続きの簡素化",
      "利便性向上",
      "行政コスト削減",
      "ペーパーレス化",
    ],
    drawbacks: ["高齢者への配慮", "セキュリティ対策", "システム導入費用"],
    year: 2025,
    keywords: ["デジタル", "行政", "オンライン", "効率化", "利便性"],
    relatedEvents: [
      "2025年2月15日: オンライン申請説明会 (住民向け)",
      "2025年4月1日: 公式LINEアカウント機能拡張発表会",
      "2025年6月20日: デジタル相談窓口開設",
    ],
    upvotes: 21,
    downvotes: 3,
    budget: 60000000, // 6千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "17",
    title: "スポーツ振興と健康増進事業",
    purpose: "市民の健康増進とスポーツ文化の普及",
    overview:
      "市民体育館の改修、スポーツイベントの開催支援、地域スポーツクラブへの助成を行い、市民が気軽にスポーツを楽しめる環境を整備します。",
    detailedPlan:
      "市民体育館のトレーニングルームを最新機器に更新し、利用時間を延長します。市民マラソン大会や区民体育祭の開催を支援。地域スポーツクラブに対し、活動費補助金を交付します。",
    problems: [
      "市民の運動不足",
      "スポーツ施設の老朽化",
      "地域スポーツ活動の停滞",
    ],
    benefits: ["健康寿命延伸", "運動不足解消", "地域交流", "若者の健全育成"],
    drawbacks: ["施設の老朽化", "指導者不足", "参加者の確保"],
    year: 2024,
    keywords: ["スポーツ", "健康", "運動", "地域", "イベント"],
    relatedEvents: [
      "2024年3月20日: 市民マラソン大会",
      "2024年5月10日: スポーツ体験イベント「初めてのヨガ」",
      "2024年7月1日: 地域スポーツクラブ交流会",
    ],
    upvotes: 18,
    downvotes: 2,
    budget: 50000000, // 5千万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "18",
    title: "中小企業支援強化策",
    purpose: "地域経済の活性化と雇用の安定",
    overview:
      "市内の中小企業に対し、経営相談、資金調達支援、IT導入補助金などを提供し、競争力強化と事業継続をサポートします。",
    detailedPlan:
      "中小企業向けの無料経営相談会を月1回開催。新規事業立ち上げや設備投資に必要な資金について、低利融資制度を拡充。ITツール導入費用の一部を補助します。",
    problems: ["中小企業の経営課題", "資金調達の困難さ", "IT化の遅れ"],
    benefits: ["地域経済の安定", "雇用維持・創出", "企業の成長", "技術革新"],
    drawbacks: ["財政負担", "審査の公平性", "利用企業の限定性"],
    year: 2023,
    keywords: ["中小企業", "経済", "雇用", "経営", "支援"],
    relatedEvents: [
      "2023年4月15日: 中小企業向け経営セミナー「SNSを活用した集客術」",
      "2023年7月1日: IT導入補助金説明会",
      "2023年10月5日: 資金調達個別相談会",
    ],
    upvotes: 14,
    downvotes: 1,
    budget: 80000000, // 8千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "19",
    title: "市民向け生涯学習講座の充実",
    purpose: "市民の自己成長支援と社会貢献の促進",
    overview:
      "多様なテーマの生涯学習講座を企画・実施し、市民が年齢を問わず学び続けられる機会を提供します。オンライン講座も導入します。",
    detailedPlan:
      "歴史、文化、健康、ITなど、年間30種類以上の生涯学習講座を開講。オンライン受講可能な講座を増やし、自宅からでも学習できる環境を整備します。",
    problems: [
      "市民の学習機会の不足",
      "自己成長の機会の制約",
      "社会貢献への意欲の低下",
    ],
    benefits: [
      "知識・スキルの向上",
      "生きがい創出",
      "地域貢献",
      "交流機会の増加",
    ],
    drawbacks: ["講師の確保", "受講者のニーズ把握", "会場の確保"],
    year: 2025,
    keywords: ["生涯学習", "教育", "自己成長", "講座", "文化"],
    relatedEvents: [
      "2025年1月10日: 生涯学習フェスティバル",
      "2025年3月1日: オンライン講座体験会",
      "2025年5月5日: 地域ボランティア育成講座",
    ],
    upvotes: 23,
    downvotes: 4,
    budget: 30000000, // 3千万円
    status: "進行中", // 新しいステータスフィールド
    comments: [],
  },
  {
    id: "20",
    title: "公園の再整備と魅力向上計画",
    purpose: "市民の憩いの場提供と都市環境の改善",
    overview:
      "老朽化した公園施設の改修、遊具の更新、多目的広場の整備を行い、子どもから高齢者までが安全に楽しめる公園を目指します。",
    detailedPlan:
      "市内主要公園の遊具を全て更新し、ユニバーサルデザインに対応したものを導入。芝生広場を拡張し、ピクニックやイベントに利用できるスペースを確保します。夜間も安心して利用できるよう、照明を増設します。",
    problems: ["公園施設の老朽化", "子どもの遊び場不足", "都市環境の質の低下"],
    benefits: [
      "住民の健康増進",
      "子どもの遊び場",
      "地域コミュニティ",
      "景観改善",
    ],
    drawbacks: ["改修費用", "維持管理負担", "近隣住民への配慮"],
    year: 2024,
    keywords: ["公園", "緑地", "憩い", "遊び場", "環境"],
    relatedEvents: [
      "2024年4月25日: 公園リニューアル記念イベント (中央公園)",
      "2024年6月15日: 公園清掃ボランティア募集",
      "2024年9月1日: 公園で遊ぼう！ファミリーデー",
    ],
    upvotes: 17,
    downvotes: 1,
    budget: 90000000, // 9千万円
    status: "完了", // 新しいステータスフィールド
    comments: [],
  },
];
