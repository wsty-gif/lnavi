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
            <div class="p-6 text-center">
                <h2 class="text-xl font-bold text-gray-900 mb-3">アカウントが見つかりません</h2>
                <button class="close-btn bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg">戻る</button>
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
                <!-- ヘッダー -->
                <div class="sticky top-0 bg-white border-b z-10 p-3 flex items-center justify-between">
                    <button class="close-btn flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>戻る
                    </button>
                    <div class="flex gap-2">
                        <button class="favorite-btn flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all ${
                            this.isFavorite
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }">
                            <i data-lucide="heart" class="w-4 h-4 ${
                                this.isFavorite ? "fill-current" : ""
                            }"></i>${this.isFavorite ? "お気に入り済み" : "お気に入り"}
                        </button>
                        <button class="share-btn flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            <i data-lucide="share-2" class="w-4 h-4"></i>共有
                        </button>
                    </div>
                </div>

                <div class="p-4">
                    <div class="grid lg:grid-cols-3 gap-4">
                        <div class="lg:col-span-2 space-y-4">
                            <!-- ギャラリー -->
                            ${
                                allImages.length > 0
                                    ? `
                                <div class="bg-white rounded-lg overflow-hidden shadow-sm">
                                    <div class="relative">
                                        <img src="${allImages[this.currentImageIndex]}" 
                                            alt="${this.account.account_name}"
                                            class="w-[344px] h-[173px] object-cover mx-auto rounded-md"
                                            onerror="this.src='https://via.placeholder.com/344x173?text=No+Image';">
                                        ${
                                            allImages.length > 1
                                                ? `
                                            <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                                ${allImages
                                                    .map(
                                                        (_, index) => `
                                                    <button class="image-indicator w-2 h-2 rounded-full ${
                                                        index === this.currentImageIndex
                                                            ? "bg-green-500"
                                                            : "bg-white/70"
                                                    }" data-index="${index}"></button>`
                                                    )
                                                    .join("")}
                                            </div>`
                                                : ""
                                        }
                                    </div>
                                    ${
                                        allImages.length > 1
                                            ? `
                                        <div class="p-2 bg-white flex justify-center gap-2">
                                            ${allImages
                                                .map(
                                                    (img, index) => `
                                                <img src="${img}" alt="${this.account.account_name} ${index + 1}"
                                                    class="thumbnail w-[80px] h-[40px] object-cover rounded cursor-pointer border-2 ${
                                                        index === this.currentImageIndex
                                                            ? "border-green-500"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }"
                                                    data-index="${index}">
                                            `
                                                )
                                                .join("")}
                                        </div>`
                                            : ""
                                    }
                                </div>`
                                    : ""
                            }

                            <!-- アカウント情報 -->
                            <div class="bg-white rounded-lg shadow-sm p-4 space-y-4">
                                <div>
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-1 mb-1">
                                                <h1 class="text-2xl font-bold text-gray-900">${this.account.account_name}</h1>
                                                ${
                                                    this.account.is_verified
                                                        ? `<i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>`
                                                        : ""
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-1 mb-3">
                                        <span class="badge ${categoryClass} border font-medium px-2.5 py-0.5 rounded-full flex items-center text-sm">
                                            <i data-lucide="tag" class="w-3 h-3 mr-1"></i>${this.account.service_category_detail}
                                        </span>
                                        ${
                                            this.account.prefecture
                                                ? `<span class="border border-gray-300 text-gray-700 px-2.5 py-0.5 rounded-full flex items-center text-sm">
                                                    <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i>
                                                    ${this.account.prefecture}${this.account.city ? ` ${this.account.city}` : ""}${
                                                      this.account.area ? ` ${this.account.area}` : ""
                                                  }
                                                </span>`
                                                : ""
                                        }
                                    </div>
                                </div>

                                <p class="text-gray-700 text-sm leading-relaxed">${this.account.description || ""}</p>

                                <!-- LINE友だち追加特典 -->
                                ${
                                    this.account.line_benefits
                                        ? `
                                    <div class="bg-gradient-to-r from-green-100 via-green-50 to-green-100 border border-green-400 rounded-lg p-3 text-center shadow-sm">
                                        <div class="flex items-center justify-center gap-2 mb-1">
                                            <i data-lucide='gift' class='w-5 h-5 text-green-700'></i>
                                            <span class="text-base font-bold text-green-800">LINE友だち追加特典</span>
                                        </div>
                                        <p class="text-green-900 font-semibold text-sm">${this.account.line_benefits}</p>
                                    </div>`
                                        : ""
                                }

                                <!-- 基本情報 -->
                                <div class="grid md:grid-cols-2 gap-3 pt-3 border-t">
                                    ${
                                        this.account.phone_number
                                            ? `
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="phone" class="w-4 h-4 text-gray-400"></i>
                                            <div>
                                                <p class="text-xs text-gray-500">電話番号</p>
                                                <a href="tel:${this.account.phone_number}" class="text-green-600 hover:underline text-sm">${this.account.phone_number}</a>
                                            </div>
                                        </div>`
                                            : ""
                                    }

                                    ${
                                        this.account.business_hours
                                            ? `
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>
                                            <div>
                                                <p class="text-xs text-gray-500">営業時間</p>
                                                <p class="text-sm font-medium">${this.account.business_hours}</p>
                                            </div>
                                        </div>`
                                            : ""
                                    }

                                    ${
                                        this.account.closed_days
                                            ? `
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="calendar" class="w-4 h-4 text-gray-400"></i>
                                            <div>
                                                <p class="text-xs text-gray-500">定休日</p>
                                                <p class="text-sm font-medium">${this.account.closed_days}</p>
                                            </div>
                                        </div>`
                                            : ""
                                    }

                                    ${
                                        this.account.website_url
                                            ? `
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="external-link" class="w-4 h-4 text-gray-400"></i>
                                            <div>
                                                <p class="text-xs text-gray-500">ウェブサイト</p>
                                                <a href="${this.account.website_url}" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:underline text-sm">サイトを見る</a>
                                            </div>
                                        </div>`
                                            : ""
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- サイドバー -->
                        <div class="space-y-4">
                            <div class="bg-white rounded-lg shadow-sm sticky top-3">
                                <div class="p-4 space-y-3 text-center">
                                    <div class="flex flex-col items-center gap-2">
                                        <a href="https://line.me/R/ti/p/@${this.account.line_id}" target="_blank" rel="noopener noreferrer" class="line-add-btn">
                                            <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" class="w-44 mx-auto">
                                        </a>
                                        ${
                                            this.account.instagram_url
                                                ? `
                                            <div class="flex justify-center">
                                                <a href="${this.account.instagram_url}" target="_blank" rel="noopener noreferrer" class="insta_btn_detail text-sm text-gray-700 hover:text-green-600">
                                                    <i class="fab fa-instagram mr-1"></i>Instagram
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

    // --- 省略部分は変更なし ---
    bindEvents() {
        this.bindCloseEvent();
        this.bindFavoriteEvent();
        this.bindShareEvent();
        this.bindImageEvents();
        this.bindLineAddEvent();
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
        this.container.querySelectorAll(".image-indicator, .thumbnail").forEach((el) => {
            el.addEventListener("click", (e) => {
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

    getAllImages() {
        // gallery_images は JSON 文字列の配列を想定
        let gallery = [];
        try {
            if (typeof this.account.gallery_images === "string") {
                gallery = JSON.parse(this.account.gallery_images);
            } else if (Array.isArray(this.account.gallery_images)) {
                gallery = this.account.gallery_images;
            }
        } catch (e) {
            gallery = [];
        }
        return [this.account.image_url, ...gallery].filter(Boolean);
    }

    getCategoryClass(category) {
        const colors = {
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
        return colors[category] || "badge-その他";
    }
}
