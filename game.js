class CookingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Game state
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.ingredients = [];
        this.pot = {
            x: this.canvas.width / 2 - 40,
            y: this.canvas.height - 60,
            width: 80,
            height: 60
        };
        this.cannon = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 20,
            angle: 0
        };
        
        // Recipe system
        this.currentRecipe = null;
        this.recipes = {
            'Juha': ['korenje', 'krompir', 'čebula'],
            'Golaž': ['meso', 'čebula', 'paradižnik'],
            'Rižota': ['riž', 'gobe', 'koruza']
        };
        
        // Ingredient images
        this.ingredientTypes = ['korenje', 'krompir', 'čebula', 'meso', 'paradižnik', 'riž', 'gobe', 'koruza'];
        this.images = {};
        this.loadImages();
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.recipeList = document.getElementById('recipe-list');
        this.startButton = document.getElementById('startGame');
        
        // Event listeners
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.startButton.addEventListener('click', this.startGame.bind(this));
    }
    
    loadImages() {
        const ingredientUrls = {
            'korenje': 'https://cdn-icons-png.flaticon.com/128/2224/2224116.png',
            'krompir': 'https://cdn-icons-png.flaticon.com/128/1135/1135449.png',
            'čebula': 'https://cdn-icons-png.flaticon.com/128/1135/1135457.png',
            'meso': 'https://cdn-icons-png.flaticon.com/128/3143/3143643.png',
            'paradižnik': 'https://cdn-icons-png.flaticon.com/128/1135/1135445.png',
            'riž': 'https://cdn-icons-png.flaticon.com/128/3174/3174880.png',
            'gobe': 'https://cdn-icons-png.flaticon.com/128/1135/1135447.png',
            'koruza': 'https://cdn-icons-png.flaticon.com/128/1135/1135458.png'
        };
        
        for (const [name, url] of Object.entries(ingredientUrls)) {
            const img = new Image();
            img.src = url;
            this.images[name] = img;
        }
    }
    
    startGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = true;
        this.ingredients = [];
        this.startButton.disabled = true;
        this.selectNewRecipe();
        this.gameLoop();
        this.spawnInterval = setInterval(() => this.spawnIngredient(), 2000);
        this.timeInterval = setInterval(() => {
            this.timeLeft--;
            this.timeElement.textContent = this.timeLeft;
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.spawnInterval);
        clearInterval(this.timeInterval);
        this.startButton.disabled = false;
        alert(`Igra končana! Tvoje točke: ${this.score}`);
    }
    
    selectNewRecipe() {
        const recipes = Object.keys(this.recipes);
        this.currentRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        this.recipeList.innerHTML = '';
        this.recipes[this.currentRecipe].forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            this.recipeList.appendChild(li);
        });
    }
    
    spawnIngredient() {
        const type = this.ingredientTypes[Math.floor(Math.random() * this.ingredientTypes.length)];
        this.ingredients.push({
            x: Math.random() * (this.canvas.width - 30),
            y: -30,
            type: type,
            width: 30,
            height: 30,
            speedY: 2
        });
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.cannon.angle = Math.atan2(y - this.cannon.y, x - this.cannon.x);
    }
    
    handleClick(e) {
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check collision with ingredients
        this.ingredients.forEach((ingredient, index) => {
            if (this.pointInRect(x, y, ingredient)) {
                if (this.recipes[this.currentRecipe].includes(ingredient.type)) {
                    this.score += 10;
                    this.scoreElement.textContent = this.score;
                    if (this.score % 30 === 0) {
                        this.selectNewRecipe();
                    }
                } else {
                    this.score = Math.max(0, this.score - 5);
                    this.scoreElement.textContent = this.score;
                }
                this.ingredients.splice(index, 1);
            }
        });
    }
    
    pointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pot
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.pot.x, this.pot.y, this.pot.width, this.pot.height);
        
        // Draw cannon
        this.ctx.save();
        this.ctx.translate(this.cannon.x, this.cannon.y);
        this.ctx.rotate(this.cannon.angle);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(0, -5, 30, 10);
        this.ctx.restore();
        
        // Update and draw ingredients
        this.ingredients = this.ingredients.filter(ingredient => {
            ingredient.y += ingredient.speedY;
            this.ctx.drawImage(this.images[ingredient.type], 
                             ingredient.x, ingredient.y, 
                             ingredient.width, ingredient.height);
            return ingredient.y < this.canvas.height;
        });
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new CookingGame();
});
