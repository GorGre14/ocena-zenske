// Add Chart.js for visualization
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

class WindForecast {
    constructor() {
        this.chart = null;
        this.currentSpeed = document.getElementById('currentSpeed');
        this.currentDirection = document.getElementById('currentDirection');
        this.windArrow = document.getElementById('windArrow');
        this.temperature = document.getElementById('temperature');
        this.humidity = document.getElementById('humidity');
        this.lastUpdated = document.getElementById('lastUpdated');
        this.refreshButton = document.getElementById('refreshWind');
        
        this.refreshButton.addEventListener('click', () => this.fetchData());
        this.initChart();
        this.fetchData();
        
        // Auto refresh every 15 minutes
        setInterval(() => this.fetchData(), 15 * 60 * 1000);
    }
    
    async fetchData() {
        try {
            // Using OpenWeatherMap API for Strunjan coordinates
            const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=45.5283&lon=13.6063&appid=YOUR_API_KEY&units=metric');
            const data = await response.json();
            
            // For demo purposes, generating random data
            this.updateCurrentConditions({
                speed: Math.random() * 20 + 5,
                direction: Math.random() * 360,
                temp: Math.random() * 10 + 15,
                humidity: Math.random() * 30 + 50
            });
            
            this.updateForecast(this.generateDemoForecast());
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error fetching wind data:', error);
        }
    }
    
    updateCurrentConditions(data) {
        this.currentSpeed.textContent = Math.round(data.speed);
        this.windArrow.style.transform = `rotate(${data.direction}deg)`;
        this.currentDirection.textContent = this.degreesToDirection(data.direction);
        this.temperature.textContent = Math.round(data.temp);
        this.humidity.textContent = Math.round(data.humidity);
    }
    
    degreesToDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
    
    generateDemoForecast() {
        const hours = [];
        const speeds = [];
        const directions = [];
        
        for (let i = 0; i < 24; i += 3) {
            hours.push(`${i}:00`);
            speeds.push(Math.random() * 20 + 5);
            directions.push(Math.random() * 360);
        }
        
        return { hours, speeds, directions };
    }
    
    updateForecast(data) {
        const ctx = document.getElementById('windChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.hours,
                datasets: [{
                    label: 'Hitrost vetra (kts)',
                    data: data.speeds,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hitrost (kts)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ura'
                        }
                    }
                }
            }
        });
    }
    
    updateLastUpdated() {
        const now = new Date();
        this.lastUpdated.textContent = now.toLocaleTimeString('sl-SI', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    initChart() {
        // Wait for Chart.js to load
        script.onload = () => {
            this.updateForecast(this.generateDemoForecast());
        };
    }
}

// Initialize wind forecast when page loads
window.addEventListener('load', () => {
    new WindForecast();
});
