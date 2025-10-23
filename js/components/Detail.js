// Detail.js
class Detail {
    constructor(container, options = {}) {
        this.container = container;
        this.account = null;
        this.currentImageIndex = 0;
        this.isFavorite = false;
        this.onClose = options.onClose || (() => {});
        this.loadFavorites();
    }

    loadFavorites() {
        const savedFavorites = localStorage.getItem('line_account_favorites');
        this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    }

    async show(accountId) {
        this.account = await DataService.getAccountById(accountId);
        if (!this.account) {
            this.showNotFound();
            return;
        }

        this.isFavorite = this.favorites.includes(accountId);
        this.currentImageIndex = 0;
        this.render();
        this.bindEvents();
    }

    render() {
        if (!this.account) return;
        const allImages = this.getAllImages();

        this.container.innerHTML = `
            <div class="max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div class="sticky top-0 bg-white border-b z-10 p-4 flex items-center justify-between">
                    <button class="close-btn flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> 戻る
                    </button>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 space-y-6">
                            <!-- メイン画像 -->
                            ${allImages.length ? `
                                <img src="${allImages[this.currentImageIndex]}" alt="${this.account.account_name}" class="w-full h-80 object-contain bg-gray-50 rounded-lg">
                            ` : ''}

                            <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
                                <h1 class="text-3xl font-bold text-gray-900">${this.account.account_name}</h1>

                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span class="category-badge">${this.account.service_category_main}</span>
                                    ${this.account.service_category_detail ? `<span class="category-badge">${this.account.service_category_detail}</span>` : ''}
                                </div>

                                <p class="text-gray-700 leading-relaxed">${this.account.description || ''}</p>

                                <!-- 基本情報 -->
                                <div class="grid md:grid-cols-2 gap-4 pt-4 border-t">
                                    ${this.account.phone_number ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="phone" class="w-5 h-5 text-gray-400"></i>
                                            <a href="tel:${this.account.phone_number}" class="text-green-600 hover:underline">${this.account.phone_number}</a>
                                        </div>` : ''}

                                    ${this.account.business_hours ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="clock" class="w-5 h-5 text-gray-400"></i>
                                            <p class="font-medium">${this.account.business_hours}</p>
                                        </div>` : ''}

                                    ${this.account.closed_days ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="calendar" class="w-5 h-5 text-gray-400"></i>
                                            <p class="font-medium">${this.account.closed_days}</p>
                                        </div>` : ''}
                                </div>

                                <!-- LINE追加特典（ボタン風） -->
                                ${this.account.line_benefits ? `
                                    <a href="https://line.me/R/ti/p/@${this.account.line_id}" target="_blank" rel="noopener noreferrer"
                                        class="block text-center bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-4 rounded-xl mt-6 hover:brightness-110 transition">
                                        <i data-lucide="gift" class="w-5 h-5 inline mr-2"></i>
                                        ${this.account.line_benefits}
                                    </a>
                                ` : ''}
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="bg-white rounded-lg shadow-md p-6 space-y-4 text-center">
                                ${this.account.line_id ? `
                                    <a href="https://line.me/R/ti/p/@${this.account.line_id}" target="_blank">
                                        <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
                                            alt="友だち追加" class="line-add-btn w-full rounded-lg overflow-hidden">
                                    </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    bindEvents() {
        const closeBtn = this.container.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.onClose());
    }

    getAllImages() {
        if (this.account.gallery_images?.length > 0) {
            return [this.account.image_url, ...this.account.gallery_images].filter(Boolean);
        }
        return [this.account.image_url].filter(Boolean);
    }
}
