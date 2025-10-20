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
            // ✅ 表示前にLocalStorageの最新状態を再取得
            this.loadFavorites();

            // ✅ アカウント全件を取得
            this.accounts = await DataService.getAllAccounts();

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
        // 最新のローカルストレージを読み込む
        this.loadFavorites();

        const favoriteAccounts = this.accounts.filter(account =>
            this.favorites.includes(String(account.id))
        );

        this.container.innerHTML = `
            <div class="space-y-8">
                <div>
                    <button class="back-to-search mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>検索に戻る
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

                ${this.isLoading ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Array(6).fill(0).map(() => `<div class="h-96 bg-gray-100 rounded-lg animate-pulse"></div>`).join('')}
                    </div>
                ` : favoriteAccounts.length === 0 ? `
                    <div class="text-center py-16">
                        <i data-lucide="heart" class="w-20 h-20 mx-auto mb-4 text-gray-300"></i>
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">お気に入りがまだありません</h3>
                        <p class="text-gray-500">検索結果から♡マークを押すとここに表示されます。</p>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${favoriteAccounts.map((account, i) => {
                            const card = new AccountCard(account, {
                                index: i,
                                isFavorite: true,
                                onToggleFavorite: this.handleToggleFavorite.bind(this),
                                onAccountClick: this.onAccountClick
                            });
                            return card.render();
                        }).join('')}
                    </div>
                `}
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    bindEvents() {
        // 戻るボタン
        const backBtns = this.container.querySelectorAll('.back-to-search, .back-to-search-btn');
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.onBackToSearch();
            });
        });

        // ✅ お気に入りトグルボタンのクリック処理
        const favBtns = this.container.querySelectorAll('.favorite-btn');
        favBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = String(btn.dataset.accountId);

                // LocalStorageの状態を取得
                let stored = [];
                try {
                    stored = JSON.parse(localStorage.getItem('line_account_favorites') || '[]').map(String);
                } catch {
                    stored = [];
                }

                const isFavorite = stored.includes(id);

                // トグル処理
                const updated = isFavorite
                    ? stored.filter(fav => fav !== id)
                    : [...stored, id];

                // LocalStorageを更新
                localStorage.setItem('line_account_favorites', JSON.stringify(updated));

                // ✅ 画面を即時更新
                this.favorites = updated;
                this.render();
                this.bindEvents();

                // ✅ app.jsにも反映（検索結果のハートを更新）
                if (this.onToggleFavorite) {
                    this.onToggleFavorite(id, "favorites");
                }
            });
        });
    }

    // ★ お気に入りボタンを個別にバインド
    bindFavoriteButtons() {
        const buttons = this.container.querySelectorAll('.favorite-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const accountId = String(btn.dataset.accountId);
                this.handleToggleFavorite(accountId);
            });
        });
    }

handleToggleFavorite(accountId) {
    const id = String(accountId);

    // LocalStorageから最新状態を取得し文字列化
    const stored = JSON.parse(localStorage.getItem('line_account_favorites') || '[]')
        .map(String);

    const isFavorite = stored.includes(id);

    // トグル処理
    const updated = isFavorite
        ? stored.filter(fav => fav !== id)
        : [...stored, id];

    // LocalStorage保存
    localStorage.setItem('line_account_favorites', JSON.stringify(updated));
    this.favorites = updated; // ← 最新状態を保持

    // UI反映
    this.applyFavoriteState(id, !isFavorite);

    // 親に通知（検索画面との同期用）
    if (this.onToggleFavorite) this.onToggleFavorite(id, "favorites");

    // 🔹お気に入り解除の場合のみ再描画してリストを減らす
    if (isFavorite) {
        this.render();
        this.bindEvents();
        this.bindFavoriteButtons();
    }
}



    applyFavoriteState(accountId, isFavorite) {
        const btn = this.container.querySelector(`.favorite-btn[data-account-id="${accountId}"]`);
        if (!btn) return;

        const icon =
            btn.querySelector('svg[data-lucide="heart"]') ||
            btn.querySelector('svg.lucide-heart') ||
            btn.querySelector('i[data-lucide="heart"]');

        if (!icon) return;

        if (isFavorite) {
            icon.classList.add('text-red-500', 'fill-current');
            icon.classList.remove('text-gray-400');
            icon.setAttribute('fill', 'currentColor');
            icon.setAttribute('stroke', 'currentColor');
        } else {
            icon.classList.remove('text-red-500', 'fill-current');
            icon.classList.add('text-gray-400');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');
        }
    }

}
