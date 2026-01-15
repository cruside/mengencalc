// Game state
let currentTask = {};
let stats = {
    correct: 0,
    total: 0
};
let difficulty = 'easy';
let allowSubtraction = true;

// DOM elements
const questionEl = document.getElementById('question');
const visual1El = document.getElementById('visual1');
const visual2El = document.getElementById('visual2');
const operatorEl = document.getElementById('operator');
const answerInput = document.getElementById('answer');
const checkBtn = document.getElementById('checkBtn');
const newTaskBtn = document.getElementById('newTaskBtn');
const feedbackEl = document.getElementById('feedback');
const correctEl = document.getElementById('correct');
const totalEl = document.getElementById('total');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const allowSubtractionCheckbox = document.getElementById('allowSubtraction');

// Difficulty ranges
const difficultyRanges = {
    easy: 20,
    medium: 50,
    hard: 100
};

// Initialize
init();

function init() {
    setupEventListeners();
    generateNewTask();
}

function setupEventListeners() {
    checkBtn.addEventListener('click', checkAnswer);
    newTaskBtn.addEventListener('click', generateNewTask);

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.level;
            generateNewTask();
        });
    });

    allowSubtractionCheckbox.addEventListener('change', (e) => {
        allowSubtraction = e.target.checked;
        generateNewTask();
    });
}

function generateNewTask() {
    const maxNum = difficultyRanges[difficulty];

    // Generate random numbers
    let num1 = Math.floor(Math.random() * (maxNum + 1));
    let num2 = Math.floor(Math.random() * (maxNum + 1));

    // Decide operation
    const operations = ['+'];
    if (allowSubtraction) {
        operations.push('-');
    }
    const operation = operations[Math.floor(Math.random() * operations.length)];

    // For subtraction, ensure num1 >= num2 (no negative results)
    if (operation === '-' && num1 < num2) {
        [num1, num2] = [num2, num1];
    }

    // Calculate correct answer
    let correctAnswer;
    if (operation === '+') {
        correctAnswer = num1 + num2;
        // Ensure sum doesn't exceed max
        if (correctAnswer > maxNum) {
            num2 = maxNum - num1;
            correctAnswer = maxNum;
        }
    } else {
        correctAnswer = num1 - num2;
    }

    // Store current task
    currentTask = {
        num1,
        num2,
        operation,
        correctAnswer
    };

    // Update UI
    questionEl.textContent = `${num1} ${operation} ${num2} = ?`;
    operatorEl.textContent = operation;

    // Visualize numbers
    visualizeNumber(num1, visual1El);
    visualizeNumber(num2, visual2El);

    // Clear feedback and answer
    answerInput.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    answerInput.focus();
}

function visualizeNumber(number, container) {
    container.innerHTML = '';

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    // Create tens blocks
    if (tens > 0) {
        const tensRow = document.createElement('div');
        tensRow.className = 'tens-row';

        for (let i = 0; i < tens; i++) {
            const tenBlock = document.createElement('div');
            tenBlock.className = 'ten-block';
            tenBlock.textContent = '10';
            tensRow.appendChild(tenBlock);
        }

        container.appendChild(tensRow);
    }

    // Create ones dots
    if (ones > 0) {
        const onesRow = document.createElement('div');
        onesRow.className = 'ones-row';

        for (let i = 0; i < ones; i++) {
            const oneDot = document.createElement('div');
            oneDot.className = 'one-dot';
            onesRow.appendChild(oneDot);
        }

        container.appendChild(onesRow);
    }

    // If number is 0
    if (number === 0) {
        const zeroText = document.createElement('div');
        zeroText.style.textAlign = 'center';
        zeroText.style.color = '#999';
        zeroText.style.fontSize = '1.5em';
        zeroText.style.padding = '20px';
        zeroText.textContent = '0';
        container.appendChild(zeroText);
    }
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = 'Bitte gib eine Zahl ein! 🤔';
        feedbackEl.className = 'feedback wrong';
        return;
    }

    stats.total++;

    if (userAnswer === currentTask.correctAnswer) {
        stats.correct++;
        feedbackEl.textContent = getCorrectMessage();
        feedbackEl.className = 'feedback correct';

        // Auto-generate new task after 2 seconds
        setTimeout(() => {
            generateNewTask();
        }, 2000);
    } else {
        feedbackEl.textContent = `Nicht ganz... 🤔 Versuche es nochmal!`;
        feedbackEl.className = 'feedback wrong';
        answerInput.select();
    }

    updateStats();
}

function getCorrectMessage() {
    const messages = [
        'Super! 🌟',
        'Richtig! 🎉',
        'Toll gemacht! 👏',
        'Perfekt! ⭐',
        'Großartig! 🎊',
        'Genau! ✨',
        'Klasse! 🏆',
        'Wunderbar! 🌈'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function updateStats() {
    correctEl.textContent = stats.correct;
    totalEl.textContent = stats.total;
}

// Focus on input when page loads
window.addEventListener('load', () => {
    answerInput.focus();
});
