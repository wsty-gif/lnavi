// Detailコンポーネント
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
        const savedFavorites = localStorage.getItem("line_account_favorites");
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

    showNotFound() {
        this.container.innerHTML = `
            <div class="p-8 text-center">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">アカウントが見つかりません</h2>
                <button class="close-btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg">戻る</button>
            </div>`;
        this.bindCloseEvent();
    }

    render() {
        if (!this.account) return;

        const allImages = this.getAllImages();
        const categoryClass = this.getCategoryClass(
            this.account.service_category_detail || this.account.service_category_main
        );

        this.container.innerHTML = `
            <div class="max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div class="sticky top-0 bg-white border-b z-10 p-4 flex items-center justify-between">
                    <button class="close-btn flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>戻る
                    </button>
                    <div class="flex gap-2">
                        <button class="favorite-btn flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            this.isFavorite
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }">
                            <i data-lucide="heart" class="w-4 h-4 ${
                                this.isFavorite ? "fill-current" : ""
                            }"></i>${this.isFavorite ? "お気に入り済み" : "お気に入り"}
                        </button>
                        <button class="share-btn flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <i data-lucide="share-2" class="w-4 h-4"></i>共有
                        </button>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 space-y-6">
                            ${
                                allImages.length > 0
                                    ? `
                                <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                    <div class="relative">
                                        <img src="${allImages[this.currentImageIndex]}" alt="${this.account.account_name}"
                                             class="w-full h-96 object-cover"
                                             onerror="this.src='https://via.placeholder.com/800x600?text=No+Image';">
                                    </div>
                                </div>`
                                    : ""
                            }

                            <!-- アカウント情報 -->
                            <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
                                <div>
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2 mb-2">
                                                <h1 class="text-3xl font-bold text-gray-900">${this.account.account_name}</h1>
                                                ${
                                                    this.account.is_verified
                                                        ? `<i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>`
                                                        : ""
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-2 mb-4">
                                        <span class="badge ${categoryClass} border font-medium px-3 py-1 rounded-full flex items-center">
                                            <i data-lucide="tag" class="w-3 h-3 mr-1"></i>${this.account.service_category_detail}
                                        </span>
                                        ${
                                            this.account.prefecture
                                                ? `<span class="border border-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center">
                                                    <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i>
                                                    ${this.account.prefecture}${
                                                      this.account.city
                                                          ? ` ${this.account.city}`
                                                          : ""
                                                  }${this.account.area ? ` ${this.account.area}` : ""}
                                                </span>`
                                                : ""
                                        }
                                    </div>
                                </div>

                                <p class="text-gray-700 leading-relaxed">${this.account.description || ""}</p>

                                ${
                                    this.account.line_benefits
                                        ? `
                                    <div class="bg-gradient-to-r from-green-100 via-green-50 to-green-100 border border-green-300 rounded-lg p-4 shadow-md text-center">
                                        <div class="flex items-center justify-center gap-2 text-green-800 font-bold text-base">
                                            <i data-lucide='gift' class='w-5 h-5 text-green-700'></i>
                                            <span>${this.account.line_benefits}</span>
                                        </div>
                                    </div>`
                                        : ""
                                }

                                <!-- 基本情報 -->
                                <div class="grid md:grid-cols-2 gap-4 pt-4 border-t">
                                    ${
                                        this.account.phone_number
                                            ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="phone" class="w-5 h-5 text-gray-400"></i>
                                            <div>
                                                <p class="text-sm text-gray-500">電話番号</p>
                                                <a href="tel:${this.account.phone_number}" class="text-green-600 hover:underline">${this.account.phone_number}</a>
                                            </div>
                                        </div>`
                                            : ""
                                    }
                                    
                                    ${
                                        this.account.business_hours
                                            ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="clock" class="w-5 h-5 text-gray-400"></i>
                                            <div>
                                                <p class="text-sm text-gray-500">営業時間</p>
                                                <p class="font-medium">${this.account.business_hours}</p>
                                            </div>
                                        </div>`
                                            : ""
                                    }
                                    
                                    ${
                                        this.account.closed_days
                                            ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="calendar" class="w-5 h-5 text-gray-400"></i>
                                            <div>
                                                <p class="text-sm text-gray-500">定休日</p>
                                                <p class="font-medium">${this.account.closed_days}</p>
                                            </div>
                                        </div>`
                                            : ""
                                    }
                                    
                                    ${
                                        this.account.website_url
                                            ? `
                                        <div class="flex items-center gap-3">
                                            <i data-lucide="external-link" class="w-5 h-5 text-gray-400"></i>
                                            <div>
                                                <p class="text-sm text-gray-500">ウェブサイト</p>
                                                <a href="${this.account.website_url}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:underline">
                                                    サイトを見る
                                                </a>
                                            </div>
                                        </div>`
                                            : ""
                                    }
                                </div>

                                ${
                                    this.account.address || this.account.prefecture
                                        ? `
                                    <div class="pt-4 border-t">
                                        <button class="directions-btn w-full flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50">
                                            <i data-lucide="navigation" class="w-4 h-4"></i>ルート案内（Googleマップで開く）
                                        </button>
                                    </div>`
                                        : ""
                                }
                            </div>
                        </div>

                        <!-- サイドバー -->
                        <div class="space-y-6">
                            <div class="bg-white rounded-lg shadow-md sticky top-4">
                                <div class="p-6 space-y-4 text-center">
                                    <div class="flex flex-col items-center gap-3">
                                        <a href="https://line.me/R/ti/p/@${this.account.line_id}" target="_blank" rel="noopener noreferrer" class="line-add-btn">
                                            <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加">
                                        </a>

                                        ${
                                            this.account.instagram_url
                                                ? `
                                            <div class="flex justify-center">
                                                <a href="${this.account.instagram_url}" target="_blank" rel="noopener noreferrer" class="insta_btn_detail">
                                                    <i class="fab fa-instagram"></i> <span>Instagram</span>
                                                </a>
                                            </div>`
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    // 以下の関数は変更なし
    bindEvents() {
        this.bindCloseEvent();
        this.bindFavoriteEvent();
        this.bindShareEvent();
        this.bindImageEvents();
        this.bindLineAddEvent();
        this.bindDirectionsEvent();
    }

    bindCloseEvent() {
        const closeBtn = this.container.querySelector(".close-btn");
        if (closeBtn) closeBtn.addEventListener("click", () => this.onClose());
    }

    bindFavoriteEvent() {
        const favoriteBtn = this.container.querySelector(".favorite-btn");
        if (favoriteBtn) favoriteBtn.addEventListener("click", () => this.toggleFavorite());
    }

    bindShareEvent() {
        const shareBtn = this.container.querySelector(".share-btn");
        if (shareBtn) shareBtn.addEventListener("click", () => this.handleShare());
    }

    bindImageEvents() {
        this.container.querySelectorAll(".image-indicator").forEach((indicator) => {
            indicator.addEventListener("click", (e) => {
                this.currentImageIndex = parseInt(e.target.dataset.index);
                this.render();
                this.bindEvents();
            });
        });

        this.container.querySelectorAll(".thumbnail").forEach((thumbnail) => {
            thumbnail.addEventListener("click", (e) => {
                this.currentImageIndex = parseInt(e.target.dataset.index);
                this.render();
                this.bindEvents();
            });
        });
    }

    bindLineAddEvent() {
        const lineAddBtn = this.container.querySelector(".line-add-btn");
        if (lineAddBtn)
            lineAddBtn.addEventListener("click", () => {
                window.open(`https://line.me/R/ti/p/@${this.account.line_id}`, "_blank");
            });
    }

    bindDirectionsEvent() {
        const directionsBtn = this.container.querySelector(".directions-btn");
        if (directionsBtn)
            directionsBtn.addEventListener("click", () => {
                this.handleGetDirections();
            });
    }

    toggleFavorite() {
        const favorites = JSON.parse(localStorage.getItem("line_account_favorites") || "[]");
        if (this.isFavorite) {
            const newFavorites = favorites.filter((id) => id !== this.account.id);
            localStorage.setItem("line_account_favorites", JSON.stringify(newFavorites));
            this.isFavorite = false;
        } else {
            favorites.push(this.account.id);
            localStorage.setItem("line_account_favorites", JSON.stringify(favorites));
            this.isFavorite = true;
        }
        this.render();
        this.bindEvents();
    }

    async handleShare() {
        const url = window.location.href;
        const title = this.account.account_name;
        const text = this.account.description;
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch {
                console.log("Share cancelled");
            }
        } else {
            navigator.clipboard.writeText(url);
            alert("URLをコピーしました");
        }
    }

    handleGetDirections() {
        if (this.account.address) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.account.address)}`, "_blank");
        } else {
            const address = [this.account.prefecture, this.account.city, this.account.area].filter(Boolean).join(" ");
            if (address)
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank");
        }
    }

    getAllImages() {
        if (this.account.gallery_images && this.account.gallery_images.length > 0)
            return [this.account.image_url, ...this.account.gallery_images].filter(Boolean);
        return [this.account.image_url].filter(Boolean);
    }

    getCategoryClass(category) {
        const categoryColors = {
            "飲食": "badge-飲食",
            "美容": "badge-美容",
            "小売": "badge-小売",
            "医療・健康": "badge-医療・健康",
            "教育": "badge-教育",
            "不動産": "badge-不動産",
            "士業・コンサル": "badge-士業・コンサル",
            "エンタメ": "badge-エンタメ",
            "自治体・公共": "badge-自治体・公共",
            "その他": "badge-その他",
        };
        return categoryColors[category] || "badge-その他";
    }
}
