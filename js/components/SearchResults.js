// SearchResults.js
class SearchResults {
    constructor(container, options = {}) {
        this.container = container;
        this.accounts = [];
        this.onAccountClick = options.onAccountClick || (() => {});
    }

    show(accounts) {
        this.accounts = accounts;
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${this.accounts.map(a => this.renderCard(a)).join('')}
            </div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderCard(a) {
        return `
            <div class="account-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col" data-account-id="${a.id}">
                <img src="${a.image_url}" alt="${a.account_name}" class="store-image w-full h-[200px] object-contain bg-gray-50">

                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${a.account_name}</h3>

                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="category-badge">${a.service_category_main}</span>
                        ${a.service_category_detail ? `<span class="category-badge">${a.service_category_detail}</span>` : ''}
                    </div>

                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${a.description || ''}</p>

                    ${a.line_benefits ? `
                        <div class="line-benefit-box bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-3 text-center">
                            <div class="flex items-center justify-center gap-2 text-green-700 font-semibold text-sm">
                                <i data-lucide="gift" class="w-4 h-4 text-green-600"></i>
                                <span>${a.line_benefits}</span>
                            </div>
                        </div>` : ''}

                    <div class="text-center flex justify-center gap-3">
                        ${a.line_id ? `
                            <a href="https://line.me/R/ti/p/@${a.line_id}" target="_blank">
                                <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加"
                                    class="inline-block w-[160px] h-auto mx-auto">
                            </a>` : ''}
                        ${a.instagram_url ? `
                            <a href="${a.instagram_url}" target="_blank" rel="noopener noreferrer" class="insta_btn2">
                                <i class="fab fa-instagram"></i> <span>Instagram</span>
                            </a>` : ''}
                    </div>
                </div>
            </div>`;
    }

    bindEvents() {
        this.container.querySelectorAll('.account-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                this.onAccountClick(card.dataset.accountId);
            });
        });
    }
}
