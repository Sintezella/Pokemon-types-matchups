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
        const numTypes = Math.random() < 0.5 ? 1 : 2;
        let defendTypes;
        if (numTypes === 1) {
            defendTypes = [types[Math.floor(Math.random() * types.length)]];
        } else {
            defendTypes = [...new Set([types[Math.floor(Math.random() * types.length)], types[Math.floor(Math.random() * types.length)]])];
            if (defendTypes.length === 1) defendTypes.push(types[Math.floor(Math.random() * types.length)]);
        }
        const effectiveness = defendTypes.reduce((acc, type) => acc * typeChart[attackType][type], 1);
        const question = `What is the effectiveness of ${attackType} against ${defendTypes.join('/')}${defendTypes.length > 1 ? ' (dual type)' : ''}?`;
        let description;
        if (effectiveness === 0) {
            description = 'Does not affect';
        } else if (effectiveness > 1) {
            description = 'Super effective';
        } else if (effectiveness < 1) {
            description = 'Not very effective';
        } else {
            description = 'Normal';
        }
        return { question, description, effectiveness };
    }

    function nextQuestion() {
        const { question, description, effectiveness } = generateQuestion();
        questionEl.textContent = question;
        correctDescription = description;
        correctEffectiveness = effectiveness;
        feedbackEl.textContent = '';
        optionsEl.querySelectorAll('input').forEach(input => input.checked = false);
        submitBtn.disabled = false;
        nextBtn.disabled = true;
    }

    submitBtn.addEventListener('click', () => {
        const selectedOption = optionsEl.querySelector('input:checked');
        if (!selectedOption) {
            alert('Please select an option!');
            return;
        }
        totalQuestions++;
        const userAnswer = selectedOption.value;
        let feedback;
        if (userAnswer === correctDescription) {
            correctAnswers++;
            feedback = `Correct! It's ${correctDescription}`;
        } else {
            feedback = `Incorrect. It's ${correctDescription}`;
        }
        const multiplierStr = correctEffectiveness === 0 ? '0x' :
                              correctEffectiveness === 0.25 ? '0.25x' :
                              correctEffectiveness === 0.5 ? '0.5x' :
                              correctEffectiveness === 1 ? '1x' :
                              correctEffectiveness === 2 ? '2x' :
                              correctEffectiveness === 4 ? '4x' :
                              `${correctEffectiveness}x`;
        feedback += ` (${multiplierStr} damage).`;
        feedbackEl.textContent = feedback;
        scoreEl.textContent = `Score: ${correctAnswers}/${totalQuestions}`;
        submitBtn.disabled = true;
        nextBtn.disabled = false;
    });

    nextBtn.addEventListener('click', nextQuestion);
});
