document.addEventListener('DOMContentLoaded', () => {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const submitBtn = document.getElementById('submit');
    const nextBtn = document.getElementById('next');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');

    let typeChart;
    let types;
    let correctDescription;
    let correctEffectiveness;
    let correctAnswers = 0;
    let totalQuestions = 0;

    // Load type chart from JSON
    fetch('type_chart.json')
        .then(response => response.json())
        .then(data => {
            typeChart = data;
            types = Object.keys(typeChart);
            nextQuestion();
        })
        .catch(error => {
            alert('Error loading type chart: ' + error);
        });

    function generateQuestion() {
        const attackType = types[Math.floor(Math.random() * types.length)];
document.addEventListener('DOMContentLoaded', () => {
    let typeChart;
    let types;
    let defendingTypes;
    let correctCategories = {};

    // Load type chart from JSON
    fetch('type_chart.json')
        .then(response => response.json())
        .then(data => {
            typeChart = data;
            types = Object.keys(typeChart);
            generateQuestion();
        })
        .catch(error => {
            alert('Error loading type chart: ' + error);
        });

    // Generate a new question
    function generateQuestion() {
        // Randomly choose single or dual-type
        const numTypes = Math.random() < 0.5 ? 1 : 2;
        if (numTypes === 1) {
            defendingTypes = [types[Math.floor(Math.random() * types.length)]];
        } else {
            defendingTypes = [...new Set([types[Math.floor(Math.random() * types.length)], types[Math.floor(Math.random() * types.length)]])];
            if (defendingTypes.length === 1) defendingTypes.push(types[Math.floor(Math.random() * types.length)]);
        }
        document.getElementById('defending').textContent = defendingTypes.join('/');

        // Calculate effectiveness for each attacking type
        correctCategories = {};
        types.forEach(attackType => {
            const effectiveness = defendingTypes.reduce((acc, defendType) => acc * typeChart[attackType][defendType], 1);
            correctCategories[attackType] = effectiveness > 1 ? 'super-effective' : 'not-super-effective';
        });

        // Populate starting area with draggable types
        const startingArea = document.getElementById('starting-area');
        startingArea.innerHTML = '';
        types.forEach(type => {
            const item = document.createElement('div');
            item.className = 'type-item';
            item.textContent = type;
            item.draggable = true;
            item.setAttribute('data-type', type);
            item.addEventListener('dragstart', dragStart);
            startingArea.appendChild(item);
        });

        // Clear drop zones
        document.querySelector('#super-effective .items').innerHTML = '';
        document.querySelector('#not-super-effective .items').innerHTML = '';
        document.getElementById('score').textContent = '';
    }

    // Drag start event
    function dragStart(e) {
        e.dataTransfer.setData('text', e.target.getAttribute('data-type'));
    }

    // Set up drop zones
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text');
        const item = document.querySelector(`.type-item[data-type="${type}"]`);
        if (item) {
            let target = e.target;
            while (target && !target.classList.contains('drop-zone')) {
                target = target.parentElement;
            }
            if (target) {
                const itemsContainer = target.querySelector('.items');
                if (itemsContainer) {
                    itemsContainer.appendChild(item);
                }
            }
        }
    }

    // Check answers
    document.getElementById('check').addEventListener('click', () => {
        let score = 0;
        types.forEach(type => {
            const item = document.querySelector(`.type-item[data-type="${type}"]`);
            const parent = item.closest('.drop-zone');
            const isCorrect = parent && parent.id === correctCategories[type];
            if (isCorrect) {
                item.classList.add('correct');
                item.classList.remove('incorrect');
                score++;
            } else {
                item.classList.add('incorrect');
                item.classList.remove('correct');
            }
        });
        document.getElementById('score').textContent = `You got ${score} out of 18 correct.`;
    });

    // Next question
    document.getElementById('next').addEventListener('click', generateQuestion);
});
