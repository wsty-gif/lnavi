const SPREADSHEET_CSV_URL = "https://script.google.com/macros/s/AKfycbxK_jnq2vtVJG9DRPtrpMJyT3Cgv8t71HfcYRmSaxTB89HTGuAlu_rjpBUl0qTAAN_M/exec";

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

// カテゴリ定数
const MAIN_CATEGORIES = [
    "全て",
    "飲食",
    "美容",
    "小売",
    "医療・健康",
    "教育",
    "不動産",
    "士業・コンサル",
    "エンタメ",
    "自治体・公共",
    "その他"
];

// 詳細カテゴリ
const DETAIL_CATEGORIES = {
    "飲食": ["ラーメン", "寿司", "焼肉", "イタリアン", "フレンチ", "中華料理", "カフェ", "居酒屋", "バー", "ファストフード", "その他飲食"],
    "美容": ["ヘアサロン", "ネイルサロン", "エステサロン", "まつげサロン", "リラクゼーション", "その他美容"],
    "小売": ["アパレル", "雑貨・インテリア", "書店", "コンビニ・スーパー", "その他小売"],
    "医療・健康": ["歯科", "整体・整骨院", "薬局", "クリニック", "フィットネス", "その他医療・健康"],
    "教育": ["英会話", "音楽教室", "学習塾", "スポーツ教室", "その他教育"],
    "不動産": ["不動産"],
    "士業・コンサル": ["士業・コンサル"],
    "エンタメ": ["映画館・劇場", "カラオケ", "ゲームセンター", "その他エンタメ"],
    "自治体・公共": ["自治体・公共"],
    "その他": ["その他"]
};

// データアクセス関数
const DataService = {
    _accountsCache: [], // キャッシュ

    // CSV読み込み関数
    async loadAccounts() {
        if (this._accountsCache.length > 0) return this._accountsCache; // キャッシュがあれば返す

        const response = await fetch(SPREADSHEET_CSV_URL);
        const csvText = await response.text();

        // PapaParseでCSVをJSONに変換
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        this._accountsCache = parsed.data.map(row => ({
            ...row,
            gallery_images: row.gallery_images ? JSON.parse(row.gallery_images) : [],
            line_features: row.line_features ? JSON.parse(row.line_features) : [],
            tags: row.tags ? JSON.parse(row.tags) : [],
            can_reserve_online: row.can_reserve_online === "true",
            has_coupon: row.has_coupon === "true",
            can_view_menu: row.can_view_menu === "true",
            can_wait_online: row.can_wait_online === "true",
            can_contact_online: row.can_contact_online === "true",
            has_points: row.has_points === "true",
            is_recommended: row.is_recommended === "true",
            is_verified: row.is_verified === "true"
        }));
        return this._accountsCache;
    },

    // 全アカウント取得
    async getAllAccounts() {
        return await this.loadAccounts();
    },

    // ID指定で取得
    async getAccountById(id) {
        const accounts = await this.loadAccounts();
        return accounts.find(acc => acc.id === id);
    },

    // 検索
    async searchAccounts(filters) {
        const accounts = await this.loadAccounts();
        let results = [...accounts];

        // フィルタリング
        if (filters.prefecture && filters.prefecture !== "全て") {
            results = results.filter(acc => acc.prefecture === filters.prefecture);
        }
        if (filters.city && filters.city !== "全て") {
            results = results.filter(acc => acc.city === filters.city);
        }
        if (filters.area && filters.area !== "全て") {
            results = results.filter(acc => acc.area === filters.area);
        }
        if (filters.category_main && filters.category_main !== "全て") {
            results = results.filter(acc => acc.service_category_main === filters.category_main);
        }
        if (filters.category_detail && filters.category_detail !== "全て") {
            results = results.filter(acc => acc.service_category_detail === filters.category_detail);
        }
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            results = results.filter(acc =>
                (acc.account_name && acc.account_name.toLowerCase().includes(keyword)) ||
                (acc.description && acc.description.toLowerCase().includes(keyword))
            );
        }

        // こだわり条件
        if (filters.can_reserve_online) results = results.filter(acc => acc.can_reserve_online);
        if (filters.has_coupon) results = results.filter(acc => acc.has_coupon);
        if (filters.can_view_menu) results = results.filter(acc => acc.can_view_menu);
        if (filters.can_wait_online) results = results.filter(acc => acc.can_wait_online);
        if (filters.can_contact_online) results = results.filter(acc => acc.can_contact_online);
        if (filters.has_points) results = results.filter(acc => acc.has_points);

        return results;
    }
};
