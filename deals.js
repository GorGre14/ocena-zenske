class DealsTracker {
    constructor() {
        this.condomDealsContainer = document.getElementById('condomDeals');
        this.planBDealsContainer = document.getElementById('planBDeals');
        this.lastUpdated = document.getElementById('dealsLastUpdated');
        this.refreshButton = document.getElementById('refreshDeals');
        
        this.refreshButton.addEventListener('click', () => this.fetchDeals());
        this.fetchDeals();
        
        // Auto refresh every hour
        setInterval(() => this.fetchDeals(), 60 * 60 * 1000);
    }
    
    async fetchDeals() {
        // Demo data with direct category links
        const condomDeals = [
            {
                title: "Durex Extra Safe",
                store: "Sanolabor",
                originalPrice: "12.99€",
                discountPrice: "8.99€",
                discount: "-30%",
                image: "https://cdn-icons-png.flaticon.com/512/2138/2138440.png",
                link: "https://www.sanolabor.si/si/izdelki/spolnost-in-kontracepcija"
            },
            {
                title: "Durex Feel Thin",
                store: "DM Drogerie",
                originalPrice: "14.99€",
                discountPrice: "9.99€",
                discount: "-33%",
                image: "https://cdn-icons-png.flaticon.com/512/2138/2138440.png",
                link: "https://www.dm.si/zdravje/intimno-zdravje/kondomi"
            }
        ];
        
        const planBDeals = [
            {
                title: "EllaOne",
                store: "Lekarne Maribor",
                originalPrice: "35.99€",
                discountPrice: "29.99€",
                discount: "-17%",
                image: "https://cdn-icons-png.flaticon.com/512/822/822092.png",
                link: "https://spletna-lekarna.si/kategorija-izdelka/zdravje/kontracepcija/"
            },
            {
                title: "Escapelle",
                store: "Lekarna Ljubljana",
                originalPrice: "32.99€",
                discountPrice: "27.99€",
                discount: "-15%",
                image: "https://cdn-icons-png.flaticon.com/512/822/822092.png",
                link: "https://www.lekarnaljubljana.si/kategorija/zdravje/kontracepcija"
            }
        ];
        
        this.updateDeals(this.condomDealsContainer, condomDeals);
        this.updateDeals(this.planBDealsContainer, planBDeals);
        this.updateLastUpdated();
    }
    
    updateDeals(container, deals) {
        container.innerHTML = deals.map(deal => `
            <div class="deal-card">
                <img src="${deal.image}" alt="${deal.title}">
                <div class="deal-title">${deal.title}</div>
                <div class="deal-store">${deal.store}</div>
                <div class="deal-price">
                    <span class="deal-original-price">${deal.originalPrice}</span>
                    <span class="deal-discount-price">${deal.discountPrice}</span>
                    <span class="deal-discount-tag">${deal.discount}</span>
                </div>
                <a href="${deal.link}" target="_blank" rel="noopener noreferrer" class="deal-link">
                    Pojdi na Kategorijo
                    <span class="deal-link-icon">🔒</span>
                </a>
                <div class="deal-note">*Cene se lahko razlikujejo</div>
            </div>
        `).join('');
    }
    
    updateLastUpdated() {
        const now = new Date();
        this.lastUpdated.textContent = now.toLocaleTimeString('sl-SI', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize deals tracker when page loads
window.addEventListener('load', () => {
    new DealsTracker();
});
