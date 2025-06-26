let currentQuestionIndex = 0;
let timer;
let questions = [];

document.getElementById('start-reverse-learning').onclick = async function() {
    const category = document.getElementById('category').value;  // Get the selected category from dropdown
    await load_reverse_learning(category);  // Pass the selected category to the function
};

async function load_reverse_learning(category) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_reverse_learning_questions?category=${category}`);
        const data = await response.json();
        if (data.questions) {
            questions = data.questions;
            document.getElementById('category-selection').style.display = 'none';  // Hide category selection
            document.getElementById('reverse-learning').style.display = 'block';  // Show reverse learning section
            displayQuestion(currentQuestionIndex);
        }
    } catch (error) {
        console.error("Error loading reverse learning questions", error);
    }
}

function startTimer() {
    let timeLeft = 300; // 5 minutes = 300 seconds
    const timerTag = document.getElementById("timer");
    timerTag.textContent = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerTag.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    // When time is up, move to the next question
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
}

function displayQuestion(index) {
    if (index < questions.length) {
        const curr_question = questions[index];
        const questionTag = document.getElementById("question");
        const sectionTag = document.getElementById("sections");

        questionTag.textContent = curr_question.question;
        sectionTag.innerHTML = ''; // Clear previous sections
        document.getElementById("timer").textContent = ""; // Clear previous timer

        // Display all prompts for the current question
        curr_question.sections.forEach((section, i) => {
            const sectionElement = document.createElement('div');
            sectionElement.classList.add('p-2', 'bg-gray-200', 'rounded');
            sectionElement.innerHTML = `<label for="section${i}" class="ml-2">${section}</label><br><textarea id="section${i}" rows="4" cols="50"></textarea>`;
            sectionTag.appendChild(sectionElement);
        });

        startTimer();  // Start timer for this question
    } else {
        alert("No more questions!"); // No more questions
    }
}

// Proceed to next question after answering or when time is up
document.getElementById('proceedBtn').onclick = () => {
    currentQuestionIndex++;
    clearInterval(timer);  // Stop the timer
    displayQuestion(currentQuestionIndex);  // Display the next question
};
