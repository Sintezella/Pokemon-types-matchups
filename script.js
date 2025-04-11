document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');

    let typeChart;
    let types;
    let defendingTypes;
    let correctCategories = {};

    // Elements
    const defendingEl = document.getElementById('defending');
    const startingArea = document.getElementById('starting-area');
    const scoreEl = document.getElementById('score');
    const checkBtn = document.getElementById('check');
    const nextBtn = document.getElementById('next');

    // Check if critical elements exist
    if (!defendingEl || !startingArea || !scoreEl || !checkBtn || !nextBtn) {
        alert('Error: One or more DOM elements not found!');
        console.error('Missing elements:', { defendingEl, startingArea, scoreEl, checkBtn, nextBtn });
        return;
    }

    // Load type chart from JSON
    fetch('type_chart.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Type chart loaded successfully');
            typeChart = data;
            types = Object.keys(typeChart);
            if (!types || types.length === 0) {
                throw new Error('No types found in type chart');
            }
            console.log('Types:', types);
            generateQuestion();
        })
        .catch(error => {
            alert('Failed to load type chart. Please ensure type_chart.json exists.');
            console.error('Error loading type chart:', error);
            defendingEl.textContent = 'Error loading types';
        });

    // Generate a new question
    function generateQuestion() {
        console.log('Generating new question...');
        if (!types) {
            console.error('Types not loaded');
            defendingEl.textContent = 'Error: Types not loaded';
            return;
        }

        // Randomly choose single or dual-type
        const numTypes = Math.random() < 0.5 ? 1 : 2;
        if (numTypes === 1) {
            defendingTypes = [types[Math.floor(Math.random() * types.length)]];
        } else {
            defendingTypes = [];
            while (defendingTypes.length < 2) {
                const type = types[Math.floor(Math.random() * types.length)];
                if (!defendingTypes.includes(type)) {
                    defendingTypes.push(type);
                }
            }
        }
        console.log('Defending types:', defendingTypes);
        defendingEl.textContent = defendingTypes.join('/');

        // Calculate effectiveness for each attacking type
        correctCategories = {};
        types.forEach(attackType => {
            const effectiveness = defendingTypes.reduce((acc, defendType) => {
                const value = typeChart[attackType][defendType];
                if (value === undefined) {
                    console.error(`Invalid effectiveness for ${attackType} vs ${defendType}`);
                    return acc;
                }
                return acc * value;
            }, 1);
            correctCategories[attackType] = effectiveness > 1 ? 'super-effective' : 'not-super-effective';
        });
        console.log('Correct categories:', correctCategories);

        // Populate starting area with draggable types
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
        console.log('Starting area populated with', types.length, 'types');

        // Clear drop zones
        document.querySelector('#super-effective .items').innerHTML = '';
        document.querySelector('#not-super-effective .items').innerHTML = '';
        scoreEl.textContent = '';
    }

    // Drag start event
    function dragStart(e) {
        console.log('Dragging:', e.target.getAttribute('data-type'));
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
        console.log('Dropping:', type);
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
                    console.log(`Dropped ${type} into ${target.id}`);
                }
            }
        }
    }

    // Check answers
    checkBtn.addEventListener('click', () => {
        console.log('Checking answers...');
        let score = 0;
        types.forEach(type => {
            const item = document.querySelector(`.type-item[data-type="${type}"]`);
            const parent = item ? item.closest('.drop-zone') : null;
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
        scoreEl.textContent = `You got ${score} out of ${types.length} correct.`;
        console.log(`Score: ${score}/${types.length}`);
    });

    // Next question
    nextBtn.addEventListener('click', () => {
        console.log('Next question clicked');
        generateQuestion();
    });
});
