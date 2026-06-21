const settingsView = document.getElementById('settings-view');
const gameView = document.getElementById('game-view');
const recapView = document.getElementById('recap-view');
const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const answerInput = document.getElementById('answer-input');
const problemText = document.getElementById('problem-text');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const settingsError = document.getElementById('settings-error');

let score = 0;
let timeLeft = 120;
let currentAnswer = 0;
let timerInterval = null;
let activeSettings = null;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readRange(minId, maxId) {
    const min = parseInt(document.getElementById(minId).value, 10);
    const max = parseInt(document.getElementById(maxId).value, 10);
    if (isNaN(min) || isNaN(max) || min < 1 || max < 1 || min > max) {
        return null;
    }
    return { min, max };
}

function getSettings() {
    return {
        ops: {
            add: document.getElementById('add').checked,
            sub: document.getElementById('sub').checked,
            mult: document.getElementById('mult').checked,
            div: document.getElementById('div').checked,
        },
        addRange1: readRange('add-min1', 'add-max1'),
        addRange2: readRange('add-min2', 'add-max2'),
        multRange1: readRange('mult-min1', 'mult-max1'),
        multRange2: readRange('mult-min2', 'mult-max2'),
        duration: parseInt(document.getElementById('duration').value, 10),
    };
}

function validateSettings(settings) {
    const { ops } = settings;
    const anyOp = ops.add || ops.sub || ops.mult || ops.div;
    if (!anyOp) {
        return 'Please select at least one operation.';
    }
    if (isNaN(settings.duration) || settings.duration < 1) {
        return 'Please select a valid duration.';
    }
    if ((ops.add || ops.sub) && (!settings.addRange1 || !settings.addRange2)) {
        return 'Please enter valid addition ranges (positive integers, min ≤ max).';
    }
    if ((ops.mult || ops.div) && (!settings.multRange1 || !settings.multRange2)) {
        return 'Please enter valid multiplication ranges (positive integers, min ≤ max).';
    }
    return null;
}

function showSettingsError(message) {
    settingsError.textContent = message;
    settingsError.classList.remove('hidden');
}

function clearSettingsError() {
    settingsError.textContent = '';
    settingsError.classList.add('hidden');
}

function generateProblem() {
    const types = [];
    if (activeSettings.ops.add) types.push('add');
    if (activeSettings.ops.sub) types.push('sub');
    if (activeSettings.ops.mult) types.push('mult');
    if (activeSettings.ops.div) types.push('div');

    const type = types[Math.floor(Math.random() * types.length)];
    let a, b;

    switch (type) {
        case 'add': {
            a = getRandom(activeSettings.addRange1.min, activeSettings.addRange1.max);
            b = getRandom(activeSettings.addRange2.min, activeSettings.addRange2.max);
            currentAnswer = a + b;
            problemText.innerText = `${a} + ${b} = `;
            break;
        }
        case 'sub': {
            a = getRandom(activeSettings.addRange1.min, activeSettings.addRange1.max);
            b = getRandom(activeSettings.addRange2.min, activeSettings.addRange2.max);
            const sum = a + b;
            if (Math.random() < 0.5) {
                currentAnswer = a;
                problemText.innerText = `${sum} - ${b} = `;
            } else {
                currentAnswer = b;
                problemText.innerText = `${sum} - ${a} = `;
            }
            break;
        }
        case 'mult': {
            a = getRandom(activeSettings.multRange1.min, activeSettings.multRange1.max);
            b = getRandom(activeSettings.multRange2.min, activeSettings.multRange2.max);
            currentAnswer = a * b;
            problemText.innerText = `${a} × ${b} = `;
            break;
        }
        case 'div': {
            a = getRandom(activeSettings.multRange1.min, activeSettings.multRange1.max);
            b = getRandom(activeSettings.multRange2.min, activeSettings.multRange2.max);
            const product = a * b;
            if (Math.random() < 0.5) {
                currentAnswer = b;
                problemText.innerText = `${product} ÷ ${a} = `;
            } else {
                currentAnswer = a;
                problemText.innerText = `${product} ÷ ${b} = `;
            }
            break;
        }
    }
    answerInput.value = '';
}

function checkAnswer() {
    if (answerInput.value === String(currentAnswer)) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        generateProblem();
    }
}

function startGame() {
    const settings = getSettings();
    const error = validateSettings(settings);
    if (error) {
        showSettingsError(error);
        return;
    }

    clearSettingsError();
    activeSettings = settings;
    score = 0;
    timeLeft = settings.duration;

    settingsView.classList.add('hidden');
    recapView.classList.add('hidden');
    gameView.classList.remove('hidden');

    scoreDisplay.innerText = `Score: ${score}`;
    timerDisplay.innerText = `Seconds left: ${timeLeft}`;

    generateProblem();

    setTimeout(() => answerInput.focus(), 10);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Seconds left: ${timeLeft}`;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    gameView.classList.add('hidden');
    recapView.classList.remove('hidden');
    document.getElementById('final-score-val').innerText = score;
}

function showSettings() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    recapView.classList.add('hidden');
    gameView.classList.add('hidden');
    settingsView.classList.remove('hidden');
    activeSettings = null;
}

answerInput.addEventListener('input', checkAnswer);

answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
});

startBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', showSettings);
