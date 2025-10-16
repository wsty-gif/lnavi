// SearchResultsコンポーネント
class SearchResults {
    constructor(container, options = {}) {
        this.container = container;
        this.accounts = [];
        this.isLoading = false;
        this.hasSearched = false;
        this.favorites = [];
        this.onToggleFavorite = options.onToggleFavorite || (() => {});
        this.onAccountClick = options.onAccountClick || (() => {});
        
        this.loadFavorites();
    }
    
    loadFavorites() {
        const savedFavorites = localStorage.getItem('line_account_favorites');
        this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    
    setAccounts(accounts, isLoading = false, hasSearched = true) {
        this.accounts = accounts;
        this.isLoading = isLoading;
        this.hasSearched = hasSearched;
        this.loadFavorites();
        this.render();
    }
    
    render() {
        if (this.isLoading) {
            this.container.innerHTML = `
                <div class="grid grid-cols-responsive gap-6">
                    ${Array(6).fill(0).map((_, i) => `
                        <div class="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
                    `).join('')}
                </div>
            `;
            return;
        }
        
        if (!this.hasSearched) {
            this.container.innerHTML = `
                <div class="text-center py-16">
                    <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        <span class="text-3xl">🔍</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">
                        検索を開始してください
                    </h3>
                    <p class="text-gray-500">
                        上の検索フォームから地域やサービスを選択して検索できます
                    </p>
                </div>
            `;
            return;
        }
        
        if (this.accounts.length === 0) {
            this.container.innerHTML = `
                <div class="border-2 border-orange-300 bg-orange-50 rounded-xl p-6 flex items-start gap-3">
                    <i data-lucide="alert-circle" class="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5"></i>
                    <div class="text-orange-900 font-medium text-base">
                        条件に一致するLINE公式アカウントが見つかりませんでした。<br>
                        検索条件を変更してもう一度お試しください。
                    </div>
                </div>
            `;
            
            // Lucideアイコンを更新
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }
        
        this.container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900">
                        検索結果 (${this.accounts.length}件)
                    </h2>
                    <div class="text-sm text-gray-500">
                        ${this.accounts.filter(acc => this.favorites.includes(acc.id)).length}件がお気に入りに登録済み
                    </div>
                </div>
                <div class="grid grid-cols-responsive gap-6">
                    ${this.accounts.map((account, index) => `
                        <div data-account-card="${account.id}">
                            ${new AccountCard(account, {
                                index,
                                isFavorite: this.favorites.includes(account.id),
                                onToggleFavorite: this.onToggleFavorite,
                                onAccountClick: this.onAccountClick
                            }).render()}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // カードのイベントバインド
        this.bindCardEvents();
        
        // Lucideアイコンを更新
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    bindCardEvents() {
        this.accounts.forEach((account, index) => {
            const cardElement = this.container.querySelector(`[data-account-card="${account.id}"]`);
            if (cardElement) {
                const card = new AccountCard(account, {
                    index,
                    isFavorite: this.favorites.includes(account.id),
                    onToggleFavorite: this.onToggleFavorite,
                    onAccountClick: this.onAccountClick
                });
                card.bindEvents(cardElement.firstElementChild);
            }
        });
    }
    
    updateFavorites(favorites) {
        this.favorites = favorites;
        this.render();
    }
}