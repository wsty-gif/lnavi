// 模擬データ
const MOCK_ACCOUNTS = [
    {
        id: "1",
        account_name: "レヴィア",
        line_id: "542rhfjm",
        description: "京都伏見にあるパーソナルジムです。ダイエットしたい方向けにピッタリ。LINE友だち追加で初回無料クーポンをプレゼント！",
        image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
        gallery_images: [
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop"
        ],
        address: "東京都新宿区歌舞伎町1-1-1",
        phone_number: "03-1234-5678",
        business_hours: "11:00-23:00",
        closed_days: "年中無休",
        line_benefits: "初回100円引きクーポン + ポイントカード連携",
        line_features: [
            "LINEから予約可能",
            "メニューをLINEで確認",
            "順番待ち登録",
            "ポイントがたまる"
        ],
        can_reserve_online: true,
        has_coupon: true,
        can_view_menu: true,
        can_wait_online: true,
        can_contact_online: true,
        has_points: true,
        is_recommended: true,
        prefecture: "東京都",
        city: "新宿区",
        area: "歌舞伎町",
        service_category_main: "飲食",
        service_category_detail: "ラーメン",
        website_url: "https://example.com",
        tags: ["醤油ラーメン", "老舗", "新宿"],
        is_verified: true
    },
    {
        id: "2",
        account_name: "ビューティーサロン渋谷",
        line_id: "beauty-shibuya",
        description: "渋谷駅徒歩3分の美容室。カット、カラー、パーマまで幅広く対応。LINE予約で10%割引実施中！",
        image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
        gallery_images: [
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        ],
        address: "東京都渋谷区渋谷1-2-3",
        phone_number: "03-2345-6789",
        business_hours: "10:00-20:00",
        closed_days: "月曜日",
        line_benefits: "LINE予約で10%割引 + 次回使える500円クーポン",
        line_features: [
            "LINEから予約可能",
            "スタイリスト指名可能",
            "料金シミュレーション"
        ],
        can_reserve_online: true,
        has_coupon: true,
        can_view_menu: false,
        can_wait_online: false,
        can_contact_online: true,
        has_points: false,
        is_recommended: false,
        prefecture: "東京都",
        city: "渋谷区",
        area: "渋谷",
        service_category_main: "美容",
        service_category_detail: "ヘアサロン",
        website_url: "https://example.com",
        tags: ["カット", "カラー", "渋谷駅近"],
        is_verified: false
    },
    {
        id: "3",
        account_name: "大阪お好み焼き道頓堀店",
        line_id: "osaka-okonomiyaki",
        description: "大阪道頓堀の老舗お好み焼き店。創業50年の伝統の味をお楽しみください。",
        image_url: "https://images.unsplash.com/photo-1626804475297-41608ea679bd?w=400&h=300&fit=crop",
        gallery_images: [],
        address: "大阪府大阪市中央区道頓堀1-1-1",
        phone_number: "06-1234-5678",
        business_hours: "17:00-24:00",
        closed_days: "水曜日",
        line_benefits: "友だち追加で生ビール1杯無料",
        line_features: [
            "順番待ち登録",
            "お問い合わせ可能"
        ],
        can_reserve_online: false,
        has_coupon: true,
        can_view_menu: false,
        can_wait_online: true,
        can_contact_online: true,
        has_points: false,
        is_recommended: true,
        prefecture: "大阪府",
        city: "大阪市",
        area: "道頓堀",
        service_category_main: "飲食",
        service_category_detail: "その他飲食",
        website_url: "",
        tags: ["お好み焼き", "老舗", "道頓堀"],
        is_verified: true
    },
    {
        id: "4",
        account_name: "福岡博多ラーメン本店",
        line_id: "hakata-ramen",
        description: "本場博多の豚骨ラーメン専門店。濃厚なスープと細麺の絶妙なハーモニーをお楽しみください。",
        image_url: "https://images.unsplash.com/photo-1617421753170-c34b14ab7b7e?w=400&h=300&fit=crop",
        gallery_images: [],
        prefecture: "福岡県",
        city: "福岡市",
        area: "博多",
        service_category_main: "飲食",
        service_category_detail: "ラーメン",
        line_benefits: "替え玉1回無料サービス",
        has_coupon: true,
        is_recommended: false,
        is_verified: false
    },
    {
        id: "5",
        account_name: "名古屋喫茶マウンテン",
        line_id: "nagoya-kissa",
        description: "名古屋名物の喫茶店文化を体験できるお店。モーニングサービスが自慢です。",
        image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
        prefecture: "愛知県",
        city: "名古屋市",
        area: "栄",
        service_category_main: "飲食",
        service_category_detail: "カフェ",
        line_benefits: "モーニングサービス無料アップグレード",
        has_coupon: true,
        is_recommended: false,
        is_verified: false
    },
    {
        id: "6",
        account_name: "横浜中華街龍鳳",
        line_id: "yokohama-ryuho",
        description: "横浜中華街の老舗中華料理店。本格四川料理をお楽しみいただけます。",
        image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
        prefecture: "神奈川県",
        city: "横浜市",
        area: "中華街",
        service_category_main: "飲食",
        service_category_detail: "中華料理",
        line_benefits: "杏仁豆腐サービス",
        has_coupon: true,
        can_reserve_online: true,
        is_recommended: false,
        is_verified: true
    }
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

const PREFECTURES = [
    "全て",
    "北海道",
    "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
    "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県",
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const MAJOR_CITIES = [
    { name: "東京", prefecture: "東京都" },
    { name: "大阪", prefecture: "大阪府" },
    { name: "名古屋", prefecture: "愛知県" },
    { name: "福岡", prefecture: "福岡県" },
    { name: "札幌", prefecture: "北海道" },
    { name: "横浜", prefecture: "神奈川県" }
];

// データアクセス関数
const DataService = {
    // 全アカウント取得
    getAllAccounts() {
        return Promise.resolve(MOCK_ACCOUNTS);
    },
    
    // ID指定でアカウント取得
    getAccountById(id) {
        const account = MOCK_ACCOUNTS.find(acc => acc.id === id);
        return Promise.resolve(account);
    },
    
    // 検索
    searchAccounts(filters) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = [...MOCK_ACCOUNTS];
                
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
                        acc.account_name.toLowerCase().includes(keyword) ||
                        acc.description.toLowerCase().includes(keyword)
                    );
                }
                
                // こだわり条件でフィルタリング
                if (filters.can_reserve_online) {
                    results = results.filter(acc => acc.can_reserve_online);
                }
                
                if (filters.has_coupon) {
                    results = results.filter(acc => acc.has_coupon);
                }
                
                if (filters.can_view_menu) {
                    results = results.filter(acc => acc.can_view_menu);
                }
                
                if (filters.can_wait_online) {
                    results = results.filter(acc => acc.can_wait_online);
                }
                
                if (filters.can_contact_online) {
                    results = results.filter(acc => acc.can_contact_online);
                }
                
                if (filters.has_points) {
                    results = results.filter(acc => acc.has_points);
                }
                
                resolve(results);
            }, 500); // 検索の遅延をシミュレート
        });
    }
};