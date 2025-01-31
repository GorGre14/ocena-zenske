document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const results = document.getElementById('results');
    const importanceList = document.getElementById('importance-list');
    const rankingsList = document.getElementById('rankings-list');

    submitBtn.addEventListener('click', () => {
        // Get all input values
        const scores = {
            'ziva': document.getElementById('ziva').value,
            'eva': document.getElementById('eva').value,
            'ria': document.getElementById('ria').value,
            'skiza': document.getElementById('skiza').value,
            'nabi': document.getElementById('nabi').value
        };

        // Calculate weighted averages for each person
        const weightedAverages = calculateWeightedAverages(scores);
        
        // Sort by weighted average
        const rankings = calculateRankings(weightedAverages);

        // Display results
        displayResults(weightedAverages, rankings);
    });

    function calculateWeightedAverages(scores) {
        const weightedAverages = {};
        const names = Object.keys(scores);

        // Calculate weighted average for each person
        for (const person of names) {
            let totalWeight = 0;
            let weightedSum = 0;
            let validRatings = 0;

            // Calculate weighted sum excluding the person's own rating
            for (const [rater, score] of Object.entries(scores)) {
                if (rater !== person && score !== '') {
                    const weight = 1; // You can modify weights here if needed
                    weightedSum += parseFloat(score) * weight;
                    totalWeight += weight;
                    validRatings++;
                }
            }

            // Calculate weighted average if there are any valid ratings
            if (validRatings > 0) {
                weightedAverages[person] = weightedSum / totalWeight;
            } else {
                weightedAverages[person] = 0;
            }
        }

        return weightedAverages;
    }

    function calculateRankings(weightedAverages) {
        return Object.entries(weightedAverages)
            .map(([name, average]) => ({
                name,
                average: parseFloat(average.toFixed(2))
            }))
            .sort((a, b) => b.average - a.average);
    }

    function displayResults(weightedAverages, rankings) {
        // Clear previous results
        importanceList.innerHTML = '';
        rankingsList.innerHTML = '';

        const names = {
            'ziva': 'Živa',
            'eva': 'Eva',
            'ria': 'Ria',
            'skiza': 'Škiza',
            'nabi': 'Nabi'
        };

        // Display weighted averages
        for (const [name, average] of Object.entries(weightedAverages)) {
            const li = document.createElement('li');
            li.textContent = `${names[name]}: ${average.toFixed(2)}`;
            importanceList.appendChild(li);
        }

        // Display rankings
        rankings.forEach(({name, average}) => {
            const li = document.createElement('li');
            li.textContent = `${names[name]} (Ocena: ${average})`;
            rankingsList.appendChild(li);
        });

        // Show results section with animation
        results.classList.add('show');
    }

    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Predefined cooking-related responses
    const responses = {
        default: "Oprosti, ne razumem. Vprašaj me kaj o kuhanju, na primer: 'Kako se naredi lazanja?' ali 'Recept za palačinke'",
        greetings: ["Živjo! Vprašaj me kaj o kuhanju!", "Pozdravljena/pozdravljen! Kaj bi rad/a skuhala danes?", "Zdravo! Imaš željo po kakšnem receptu?"],
        recipes: {
            "potica": "Za potico potrebuješ:\n- 1kg moke\n- 6 rumenjakov\n- 40g kvasa\n- 150g masla\n- mleko po potrebi\n\nPostopek:\n1. Pripravi kvasec\n2. Zmešaj vse sestavine\n3. Pusti vzhajati 1 uro\n4. Razvaljaj in namaži z nadevom\n5. Peci 1 uro na 180°C",
            "golaž": "Za golaž potrebuješ:\n- 1kg govedine\n- 4 čebule\n- česen\n- paradižnikovo mezgo\n\nPostopek:\n1. Prepraži čebulo\n2. Dodaj meso\n3. Začini in dodaj mezgo\n4. Kuhaj 2-3 ure na nizki temperaturi",
            "lazanja": "Za lazanjo potrebuješ:\n- lazanja liste\n- mleto meso\n- paradižnikovo mezgo\n- bešamel\n\nPostopek:\n1. Pripravi mesno omako\n2. Naredi bešamel\n3. Zlagaj plasti\n4. Peci 45 min na 200°C",
            "palačinke": "Za palačinke potrebuješ:\n- 3 jajca\n- 300g moke\n- 500ml mleka\n- ščepec soli\n\nPostopek:\n1. Zmešaj vse sestavine\n2. Pusti počivati 30 min\n3. Peci v vroči ponvi"
        },
        cooking: {
            "what": "Danes lahko skuhava karkoli želiš! Imam recepte za:\n- Lazanjo\n- Golaž\n- Palačinke\n- Potico\nKaj od tega bi rad/a?",
            "moka": "Bela moka je najboljša za peko kruha in peciva. Črna moka je bolj zdrava in ima več vlaknin. Za palačinke priporočam belo moko tip 500.",
            "temperature": {
                "meat": "Za meso:\n- Govedina (medium): 63°C\n- Piščanec: 75°C\n- Svinjina: 70°C",
                "baking": "Za peko:\n- Kruh: 200-220°C\n- Pecivo: 180°C\n- Pica: 250°C"
            }
        }
    };

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        
        let messageHTML = '';
        if (!isUser) {
            messageHTML += `<img src="https://img.freepik.com/free-photo/portrait-young-beautiful-cook-white-uniform_176474-87616.jpg" alt="Mojca" class="assistant-avatar">`;
        }
        messageHTML += `<div class="message-content">${content}</div>`;
        messageDiv.innerHTML = messageHTML;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateResponse(input) {
        input = input.toLowerCase();
        
        // Handle English questions
        if (input.includes("what") && input.includes("cooking")) {
            return responses.cooking.what;
        }
        if (input.includes("flour") || input.includes("moka")) {
            return responses.cooking.moka;
        }
        
        // Check for greetings
        if (input.match(/živjo|zdravo|pozdravljeni|oj|hey|hi|hello/)) {
            return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        }
        
        // Check for recipe requests
        for (let recipe in responses.recipes) {
            if (input.includes(recipe) || input.includes("recept") || input.includes("recipe")) {
                if (input.includes(recipe)) {
                    return responses.recipes[recipe];
                } else {
                    return "Lahko ti pomagam s recepti za: lazanjo, golaž, palačinke ali potico. Katerega želiš?";
                }
            }
        }
        
        // Check for temperature questions
        if (input.includes("temperatura") || input.includes("temperature")) {
            if (input.includes("meso") || input.includes("meat")) {
                return responses.cooking.temperature.meat;
            }
            if (input.includes("peka") || input.includes("baking")) {
                return responses.cooking.temperature.baking;
            }
            return "Lahko ti svetujem glede temperature za:\n- Peko (kruh, pecivo)\n- Meso (govedina, piščanec, svinjina)";
        }
        
        return responses.default;
    }

    function handleUserInput() {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, true);
            userInput.value = '';
            
            // Slight delay to simulate thinking
            setTimeout(() => {
                const response = generateResponse(text);
                addMessage(response);
            }, 1000);
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Initialize chat with focus on input
    userInput.focus();
});
