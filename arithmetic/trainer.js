const settingsView = document.getElementById('settings-view');
const gameView = document.getElementById('game-view');
const recapView = document.getElementById('recap-view');
const startBtn = document.getElementById('start-btn');
const answerInput = document.getElementById('answer-input');
const problemText = document.getElementById('problem-text');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let score = 0;
let timeLeft = 120;
let currentAnswer = 0;
let timerInterval;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem() {
    const types = [];
    if (document.getElementById('add').checked) types.push('add');
    if (document.getElementById('sub').checked) types.push('sub');
    if (document.getElementById('mult').checked) types.push('mult');
    if (document.getElementById('div').checked) types.push('div');

    const type = types.length > 0 ? types[Math.floor(Math.random() * types.length)] : 'add';
    let a, b;

    switch(type) {
        case 'add':
            a = getRandom(parseInt(document.getElementById('add-min').value), parseInt(document.getElementById('add-max').value));
            b = getRandom(parseInt(document.getElementById('add-min').value), parseInt(document.getElementById('add-max').value));
            currentAnswer = a + b;
            problemText.innerText = `${a} + ${b} = `;
            break;
        case 'sub':
            const maxAdd = parseInt(document.getElementById('add-max').value);
            const minAdd = parseInt(document.getElementById('add-min').value);
            a = getRandom(minAdd, maxAdd);
            b = getRandom(minAdd, maxAdd);
            const sum = a + b;
            currentAnswer = a;
            problemText.innerText = `${sum} - ${b} = `;
            break;
        case 'mult':
            a = getRandom(parseInt(document.getElementById('mult-min').value), parseInt(document.getElementById('mult-max').value));
            b = getRandom(2, 100);
            currentAnswer = a * b;
            problemText.innerText = `${a} × ${b} = `;
            break;
        case 'div':
            a = getRandom(parseInt(document.getElementById('mult-min').value), parseInt(document.getElementById('mult-max').value));
            b = getRandom(2, 100);
            const product = a * b;
            currentAnswer = b;
            problemText.innerText = `${product} ÷ ${a} = `;
            break;
    }
    answerInput.value = '';
}

function startGame() {
    score = 0;
    timeLeft = parseInt(document.getElementById('duration').value);
    
    settingsView.classList.add('hidden');
    gameView.classList.remove('hidden');
    
    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Seconds left: ${timeLeft}`;
    
    generateProblem();
    
    setTimeout(() => {
        answerInput.focus();
    }, 10);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Seconds left: ${timeLeft}`;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    gameView.classList.add('hidden');
    recapView.classList.remove('hidden');
    document.getElementById('final-score-val').innerText = score;
}

answerInput.addEventListener('input', () => {
    if (parseInt(answerInput.value) === currentAnswer) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        generateProblem();
    }
});

startBtn.addEventListener('click', startGame);
