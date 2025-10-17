// SearchResultsコンポーネント
class SearchResults {
    constructor(container, options = {}) {
        this.container = container;
        this.accounts = [];
        this.isLoading = false;
        this.isEmpty = false;
        this.onAccountClick = options.onAccountClick || (() => {});
        this.onToggleFavorite = options.onToggleFavorite || (() => {});
    }
    
    show(accounts) {
        this.accounts = accounts;
        this.isEmpty = accounts.length === 0;
        this.isLoading = false;
        this.render();
        this.bindEvents();
    }
    
    showLoading() {
        this.isLoading = true;
        this.render();
    }
    
    render() {
        if (this.isLoading) {
            this.container.innerHTML = `
                <div class="text-center py-16">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p class="text-gray-600">検索中...</p>
                </div>
            `;
            return;
        }
        
        if (this.isEmpty) {
            this.container.innerHTML = `
                <div class="text-center py-16 bg-white rounded-lg shadow-md">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">検索結果が見つかりませんでした</h3>
                    <p class="text-gray-600">条件を変更して再度検索してください</p>
                </div>
            `;
            return;
        }
        
        this.container.innerHTML = `
            <div class="mb-4">
                <p class="text-gray-600">
                    <span class="font-bold text-lg text-green-600">${this.accounts.length}</span> 件のアカウントが見つかりました
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="accounts-grid">
                ${this.accounts.map(account => this.renderAccountCard(account)).join('')}
            </div>
        `;
    }
    
    renderAccountCard(account) {
        const favorites = JSON.parse(localStorage.getItem('line_account_favorites') || '[]');
        const isFavorite = favorites.includes(account.id);
        
        return `
            <div class="account-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer fade-in" data-account-id="${account.id}">
                <div class="relative">
                    <img src="${account.image}" alt="${account.name}" class="w-full h-48 object-cover">
                    <button class="favorite-btn absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" data-account-id="${account.id}">
                        ${isFavorite ? 
                            '<i data-lucide="heart" class="w-5 h-5 text-red-500 fill-current"></i>' : 
                            '<i data-lucide="heart" class="w-5 h-5 text-gray-400"></i>'
                        }
                    </button>
                </div>
                <div class="p-4 account-card-content">
                    <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">${account.name}</h3>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="badge-${account.category} px-3 py-1 rounded-full text-sm font-medium">
                            ${account.category}
                        </span>
                        ${account.detailCategory ? `
                            <span class="badge-${account.detailCategory} px-3 py-1 rounded-full text-sm font-medium">
                                ${account.detailCategory}
                            </span>
                        ` : ''}
                    </div>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${account.description}</p>
                    <div class="mt-auto">
                        <div class="flex items-center text-orange-600 font-medium">
                            <i data-lucide="gift" class="w-4 h-4 mr-1"></i>
                            <span class="text-sm">${account.benefit}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // アカウントカードのクリックイベント
        const cards = this.container.querySelectorAll('.account-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // お気に入りボタンのクリックは除外
                if (e.target.closest('.favorite-btn')) {
                    return;
                }
                const accountId = card.dataset.accountId;
                this.onAccountClick(accountId);
            });
        });
        
        // お気に入りボタンのクリックイベント
        const favoriteBtns = this.container.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const accountId = btn.dataset.accountId;
                this.onToggleFavorite(accountId);
            });
        });
        
        // Lucideアイコンの初期化
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}