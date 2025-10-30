const SPREADSHEET_JSON_URL = "https://script.google.com/macros/s/AKfycby15NdqO6Neav2bV3KgFifdvs-_zMkWIPPofKgBeGj_rLG2djnj-8txvc78-NHw2IsX/exec";

const PREFECTURES = [
  "全て",
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const MAIN_CATEGORIES = [
  "全て",
  "飲食・フードサービス",
  "美容・健康・リラクゼーション",
  "小売・ショップ・販売",
  "サービス・暮らし",
  "教育・スクール・カルチャー",
  "医療・介護・福祉",
  "不動産・建築・工務",
  "士業・コンサル・オフィスサービス",
  "エンタメ・イベント・レジャー",
  "自治体・公共・団体",
  "その他"
];

const DETAIL_CATEGORIES = {
  "飲食・フードサービス": [
    "全て",
    "カフェ",
    "レストラン",
    "居酒屋",
    "焼肉・焼鳥",
    "ラーメン",
    "寿司・和食",
    "中華料理",
    "イタリアン",
    "フレンチ",
    "バー・ダイニング",
    "スイーツ・ケーキ",
    "パン屋・ベーカリー",
    "テイクアウト・デリバリー",
    "ファストフード",
    "ビュッフェ・食べ放題"
  ],

  "美容・健康・リラクゼーション": [
    "全て",
    "美容室・ヘアサロン",
    "理容室・バーバー",
    "ネイルサロン",
    "まつげサロン",
    "エステサロン",
    "脱毛サロン",
    "リラクゼーション・マッサージ",
    "整体・整骨院",
    "パーソナルジム",
    "ヨガ・ピラティス",
    "スパ・温浴施設"
  ],

  "小売・ショップ・販売": [
    "全て",
    "アパレル・服飾",
    "雑貨・インテリア",
    "花屋・フラワーショップ",
    "食品販売・惣菜",
    "ベーカリー・製菓",
    "ドラッグストア",
    "家電・日用品",
    "スポーツ用品",
    "書店・文具店",
    "リサイクルショップ"
  ],

  "サービス・暮らし": [
    "全て",
    "クリーニング・家事代行",
    "写真館・フォトスタジオ",
    "ペットサロン・トリミング",
    "冠婚葬祭サービス",
    "便利屋・引越し",
    "自動車整備・洗車",
    "IT・デザイン制作",
    "印刷・広告",
    "配送・物流",
    "ハウスクリーニング"
  ],

  "教育・スクール・カルチャー": [
    "全て",
    "学習塾・予備校",
    "英会話スクール",
    "音楽教室",
    "ダンススクール",
    "書道・そろばん教室",
    "パソコン教室",
    "スポーツ教室",
    "資格・キャリアスクール",
    "カルチャースクール"
  ],

  "医療・介護・福祉": [
    "全て",
    "病院・クリニック",
    "歯科医院",
    "整骨院・接骨院",
    "鍼灸院",
    "薬局・ドラッグストア",
    "介護施設・デイサービス",
    "訪問看護",
    "福祉サービス"
  ],

  "不動産・建築・工務": [
    "全て",
    "不動産仲介・賃貸",
    "建設・リフォーム",
    "外構・エクステリア",
    "ハウスメーカー",
    "設計事務所",
    "電気・設備工事",
    "内装・塗装業",
    "解体業",
    "土地開発・測量"
  ],

  "士業・コンサル・オフィスサービス": [
    "全て",
    "税理士事務所",
    "行政書士事務所",
    "司法書士事務所",
    "社会保険労務士",
    "弁護士事務所",
    "保険代理店",
    "経営コンサルタント",
    "人材紹介・派遣",
    "ITコンサル・DX支援"
  ],

  "エンタメ・イベント・レジャー": [
    "全て",
    "ライブハウス・音楽スタジオ",
    "カラオケ・アミューズメント",
    "映画館・劇場",
    "イベント企画・運営",
    "テーマパーク・レジャー施設",
    "観光・旅行業",
    "レンタルスペース",
    "キャンプ・アウトドア",
    "温泉・宿泊施設"
  ],

  "自治体・公共・団体": [
    "全て",
    "自治体事務所",
    "商工会・観光協会",
    "地域団体・NPO",
    "公共施設（体育館・図書館など）",
    "地域センター・まちづくり拠点",
    "学校・教育機関"
  ],

  "その他": [
    "全て",
    "企業・法人サービス",
    "メディア・広告業",
    "クリエイター・フリーランス",
    "ボランティア・地域活動",
    "その他事業"
  ]
};



const DataService = {
    _accountsCache: [],

    async loadAccounts() {
        if (this._accountsCache.length > 0) return this._accountsCache;
        try {
            const res = await fetch(SPREADSHEET_JSON_URL, { mode: "cors" });
            const json = await res.json();
            this._accountsCache = json.rows;
            console.log("✅ JSON取得成功", this._accountsCache);
            return this._accountsCache;
        } catch (e) {
            console.error("❌ JSON取得失敗", e);
            return [];
        }
    },

    async getAllAccounts() {
        return await this.loadAccounts();
    },

    async getAccountById(id) {
        const accounts = await this.loadAccounts();
        return accounts.find(acc => String(acc.id).trim() === String(id).trim());
    },

    async searchAccounts(filters) {
        const accounts = await this.loadAccounts();
        let results = [...accounts];

        if (filters.prefecture && filters.prefecture !== "全て") results = results.filter(acc => acc.prefecture === filters.prefecture);
        if (filters.city && filters.city !== "全て") results = results.filter(acc => acc.city === filters.city);
        if (filters.area && filters.area !== "全て") results = results.filter(acc => acc.area === filters.area);
        if (filters.category_main && filters.category_main !== "全て") results = results.filter(acc => acc.service_category_main === filters.category_main);
        if (filters.category_detail && filters.category_detail !== "全て") results = results.filter(acc => acc.service_category_detail === filters.category_detail);
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            results = results.filter(acc =>
                (acc.account_name && acc.account_name.toLowerCase().includes(keyword)) ||
                (acc.description && acc.description.toLowerCase().includes(keyword))
            );
        }

        if (filters.can_reserve_online) results = results.filter(acc => acc.can_reserve_online);
        if (filters.has_coupon) results = results.filter(acc => acc.has_coupon);
        if (filters.can_view_menu) results = results.filter(acc => acc.can_view_menu);
        if (filters.can_wait_online) results = results.filter(acc => acc.can_wait_online);
        if (filters.can_contact_online) results = results.filter(acc => acc.can_contact_online);
        if (filters.has_points) results = results.filter(acc => acc.has_points);

        return results;
    }
};
