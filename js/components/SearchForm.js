// SearchFormコンポーネント
class SearchForm {
    constructor(container, options = {}) {
        this.container = container;
        this.filters = {
            prefecture: "全て",
            city: "全て",
            area: "全て",
            category_main: "全て",
            category_detail: "全て",
            keyword: "",
            has_line_benefit: false,
            is_recommended: false,
            has_instagram: false,
            can_reserve_online: false
        };
        this.onSearch = options.onSearch || (() => {});
        this.allAccounts = [];
        this.showFilters = false;

        this.init();
    }

    async init() {
        this.allAccounts = await DataService.getAllAccounts();
        this.render();
        this.bindEvents();
    }

    render() {
        const availableDetailCategories = this.getAvailableDetailCategories();
        const availableCities = this.getAvailableCities();
        const availableAreas = this.getAvailableAreas();

        this.container.innerHTML = `
            <div class="border-2 border-orange-200 shadow-2xl bg-white rounded-2xl overflow-hidden">
                <div class="p-6 md:p-8">
                    <div class="space-y-6">

                        <!-- タイトル -->
                        <div class="text-center mb-6">
                            <h2 class="text-gray-900 mb-2 text-sm font-black md:text-3xl">
                                初回割引、ポイント還元、限定クーポン…<br>
                                友だちだけの特典がいっぱい
                            </h2>
                            <p class="text-gray-600 font-medium">エリアとサービスから検索できます</p>
                        </div>

                        <!-- 地域・カテゴリ -->
                        <div class="search-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                            <div class="space-y-4">
                                <label class="text-sm font-bold text-gray-700">都道府県</label>
                                <select id="prefecture-select" class="custom-select w-full h-12 rounded-lg px-4 border-2 border-gray-300">
                                    ${PREFECTURES.map(pref => `
                                        <option value="${pref}" ${pref === this.filters.prefecture ? 'selected' : ''}>${pref}</option>
                                    `).join('')}
                                </select>

                                <label class="text-sm font-bold text-gray-700">市区町村</label>
                                <select id="city-select" class="custom-select w-full h-12 rounded-lg px-4 border-2 border-gray-300" 
                                        ${!this.filters.prefecture || this.filters.prefecture === '全て' ? 'disabled' : ''}>
                                    ${availableCities.map(city => `
                                        <option value="${city}" ${city === this.filters.city ? 'selected' : ''}>${city}</option>
                                    `).join('')}
                                </select>

                                <label class="text-sm font-bold text-gray-700">エリア</label>
                                <select id="area-select" class="custom-select w-full h-12 rounded-lg px-4 border-2 border-gray-300" 
                                        ${!this.filters.city || this.filters.city === '全て' ? 'disabled' : ''}>
                                    ${availableAreas.map(area => `
                                        <option value="${area}" ${area === this.filters.area ? 'selected' : ''}>${area}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="space-y-4">
                                <label class="text-sm font-bold text-gray-700">サービスカテゴリー</label>
                                <select id="category-main-select" class="custom-select w-full h-12 rounded-lg px-4 border-2 border-gray-300">
                                    ${MAIN_CATEGORIES.map(category => `
                                        <option value="${category}" ${category === this.filters.category_main ? 'selected' : ''}>${category}</option>
                                    `).join('')}
                                </select>

                                <label class="text-sm font-bold text-gray-700">詳細カテゴリー</label>
                                <select id="category-detail-select" class="custom-select w-full h-12 rounded-lg px-4 border-2 border-gray-300"
                                        ${!this.filters.category_main || this.filters.category_main === '全て' ? 'disabled' : ''}>
                                    ${availableDetailCategories.map(category => `
                                        <option value="${category}" ${category === this.filters.category_detail ? 'selected' : ''}>${category}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- 🔍 キーワード -->
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">キーワード検索</label>
                            <input type="text" id="keyword-input" placeholder="アカウント名やキーワードで検索"
                                value="${this.filters.keyword}"
                                class="w-full border-2 border-gray-300 rounded-lg px-4 h-12 text-base">
                        </div>

                        <!-- 🎯 こだわり条件 -->
                        <button id="toggle-filters" 
                            class="w-full border-2 border-gray-300 hover:bg-gray-50 font-bold h-12 bg-white rounded-lg
                                flex items-center justify-center gap-2">
                            <i data-lucide="sliders-horizontal" class="w-5 h-5"></i>
                            ${this.showFilters ? 'こだわり条件を閉じる' : 'こだわり条件で絞り込む'}
                        </button>

                        <div id="filters-content" class="${this.showFilters ? '' : 'hidden'} bg-orange-50 p-4 rounded-lg space-y-3 border-2 border-orange-200">
                            <p class="font-bold text-gray-800 mb-3">こだわり条件</p>

                            <div class="flex flex-col gap-3">
                                <label class="flex items-center gap-2 text-base font-medium">
                                    <input type="checkbox" id="has_line_benefit" class="custom-checkbox w-5 h-5" ${this.filters.has_line_benefit ? 'checked' : ''}>
                                    🎁 LINE友だち特典あり
                                </label>

                                <label class="flex items-center gap-2 text-base font-medium">
                                    <input type="checkbox" id="is_recommended" class="custom-checkbox w-5 h-5" ${this.filters.is_recommended ? 'checked' : ''}>
                                    ⭐ おすすめ店舗のみ
                                </label>

                                <label class="flex items-center gap-2 text-base font-medium">
                                    <input type="checkbox" id="has_instagram" class="custom-checkbox w-5 h-5" ${this.filters.has_instagram ? 'checked' : ''}>
                                    📸 Instagramあり
                                </label>

                                <label class="flex items-center gap-2 text-base font-medium">
                                    <input type="checkbox" id="can_reserve" class="custom-checkbox w-5 h-5" ${this.filters.can_reserve_online ? 'checked' : ''}>
                                    📅 LINEから予約可能
                                </label>
                            </div>
                        </div>

                        <!-- 検索ボタン -->
                        <button id="search-btn" 
                            class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-5 text-xl shadow-xl rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            <i data-lucide="search" class="w-6 h-6"></i>
                            <span>この条件で検索する</span>
                        </button>

                    </div>
                </div>
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    bindEvents() {
        const set = (id, key) => {
            const el = this.container.querySelector(`#${id}`);
            if (el) el.addEventListener('change', (e) => this.filters[key] = e.target.checked);
        };

        set('has_line_benefit', 'has_line_benefit');
        set('is_recommended', 'is_recommended');
        set('has_instagram', 'has_instagram');
        set('can_reserve', 'can_reserve_online');

        this.container.querySelector('#toggle-filters').addEventListener('click', () => {
            this.showFilters = !this.showFilters;
            this.render();
            this.bindEvents();
        });

        this.container.querySelector('#search-btn').addEventListener('click', () => {
            this.onSearch(this.filters);
        });

        const keywordInput = this.container.querySelector('#keyword-input');
        keywordInput.addEventListener('input', (e) => this.filters.keyword = e.target.value);
    }

    getAvailableDetailCategories() {
        if (!this.filters.category_main || this.filters.category_main === "全て")
            return ["全て"];
        return ["全て", ...(DETAIL_CATEGORIES[this.filters.category_main] || [])];
    }

    getAvailableCities() {
        if (!this.filters.prefecture || this.filters.prefecture === "全て") {
            const cities = [...new Set(this.allAccounts.map(a => a.city).filter(Boolean))];
            return ["全て", ...cities.sort()];
        }

        const cities = [...new Set(
            this.allAccounts
                .filter(a => a.prefecture === this.filters.prefecture)
                .map(a => a.city)
                .filter(Boolean)
        )];
        return ["全て", ...cities.sort()];
    }

    getAvailableAreas() {
        if (!this.filters.city || this.filters.city === "全て") {
            const areas = [...new Set(this.allAccounts.map(a => a.area).filter(Boolean))];
            return ["全て", ...areas.sort()];
        }

        const areas = [...new Set(
            this.allAccounts
                .filter(a => a.city === this.filters.city)
                .map(a => a.area)
                .filter(Boolean)
        )];
        return ["全て", ...areas.sort()];
    }
}
