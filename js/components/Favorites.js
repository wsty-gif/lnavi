// Favoritesコンポーネント
class Favorites {
    constructor(container, options = {}) {
        this.container = container;
        this.favorites = [];
        this.accounts = [];
        this.isLoading = false;
        this.onToggleFavorite = options.onToggleFavorite || (() => {});
        this.onAccountClick = options.onAccountClick || (() => {});
        this.onBackToSearch = options.onBackToSearch || (() => {});
        
        this.loadFavorites();
    }
    
    loadFavorites() {
        const savedFavorites = localStorage.getItem('line_account_favorites');
        this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    
    async show() {
        this.isLoading = true;
        this.render();
        
        try {
            this.accounts = await DataService.getAllAccounts();
            this.loadFavorites();
            this.isLoading = false;
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('Failed to load accounts:', error);
            this.isLoading = false;
            this.render();
        }
    }
    
    render() {
        const favoriteAccounts = this.accounts.filter(account => this.favorites.includes(account.id));
        
        this.container.innerHTML = `
            <div class="space-y-8">
                <!-- ヘッダー -->
                <div>
                    <button class="back-to-search mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                        検索に戻る
                    </button>
                    <div class="flex items-center gap-3">
                        <i data-lucide="heart" class="w-8 h-8 text-red-500 fill-current"></i>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">お気に入り</h1>
                            <p class="text-gray-600 mt-1">
                                保存したLINE公式アカウント (${favoriteAccounts.length}件)
                            </p>
                        </div>
                    </div>
                </div>

                <!-- コンテンツ -->
                ${this.isLoading ? `
                    <div class="grid grid-cols-responsive gap-6">
                        ${Array(6).fill(0).map((_, i) => `
                            <div class="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
                        `).join('')}
                    </div>
                ` : favoriteAccounts.length === 0 ? `
                    <div class="text-center py-16">
                        <i data-lucide="heart" class="w-20 h-20 mx-auto mb-4 text-gray-300"></i>
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">
                            お気に入りがまだありません
                        </h3>
                        <p class="text-gray-500 mb-6">
                            気になるアカウントをお気に入りに追加しましょう
                        </p>
                        <button class="back-to-search-btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
                            アカウントを探す
                        </button>
                    </div>
                ` : `
                    <div class="grid grid-cols-responsive gap-6">
                        ${favoriteAccounts.map((account, index) => `
                            <div data-account-card="${account.id}">
                                ${new AccountCard(account, {
                                    index,
                                    isFavorite: true,
                                    onToggleFavorite: this.handleToggleFavorite.bind(this),
                                    onAccountClick: this.onAccountClick
                                }).render()}
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
        
        // Lucideアイコンを更新
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // カードのイベントバインド
        if (!this.isLoading && favoriteAccounts.length > 0) {
            this.bindCardEvents(favoriteAccounts);
        }
    }
    
    bindEvents() {
        // 戻るボタン
        const backBtns = this.container.querySelectorAll('.back-to-search, .back-to-search-btn');
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.onBackToSearch();
            });
        });
    }
    
    bindCardEvents(favoriteAccounts) {
        favoriteAccounts.forEach((account, index) => {
            const cardElement = this.container.querySelector(`[data-account-card="${account.id}"]`);
            if (cardElement) {
                const card = new AccountCard(account, {
                    index,
                    isFavorite: true,
                    onToggleFavorite: this.handleToggleFavorite.bind(this),
                    onAccountClick: this.onAccountClick
                });
                card.bindEvents(cardElement.firstElementChild);
            }
        });
    }
    
    handleToggleFavorite(accountId) {
        // お気に入りから削除
        const newFavorites = this.favorites.filter(id => id !== accountId);
        this.favorites = newFavorites;
        localStorage.setItem('line_account_favorites', JSON.stringify(newFavorites));
        
        // 再描画
        this.render();
        this.bindEvents();
        
        // 親コンポーネントに通知
        if (this.onToggleFavorite) {
            this.onToggleFavorite(accountId);
        }
    }
}