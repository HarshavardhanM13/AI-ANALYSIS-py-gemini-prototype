let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timer;
let wrongAnswers = [];

async function load_quiz() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/get_questions');
        const data = await response.json();
        if (data.questions) {
            questions = data.questions;
            const questionTag = document.getElementById("question");
            const optionsTag = document.getElementById("options");
            const resultTag = document.getElementById("result");
            const submitBtnTag = document.getElementById("submitBtn");
            const timerTag = document.getElementById("timer");
            const totalQuestions = questions.length;

            function startTimer() {
                let timeLeft = 15;
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
                resultTag.textContent = "Time's up!";
                setTimeout(() => {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                }, 1000);
            }

            function displayQuestion(index) {
                if (index < totalQuestions) {
                    const curr_question = questions[index];
                    questionTag.textContent = curr_question.question;
                    optionsTag.innerHTML = '';
                    resultTag.textContent = "";
                    startTimer();

                    curr_question.options.forEach((option, i) => {
                        const optionElement = document.createElement('div');
                        optionElement.classList.add('p-2', 'bg-gray-200', 'rounded');
                        optionElement.innerHTML = `<input type="radio" name="answer" id="option${i}" value="${option}">
                        <label for="option${i}" class="ml-2">${option}</label>`;
                        optionsTag.appendChild(optionElement);
                    });
                } else {
                    resultTag.textContent = `Your Score: ${score} / ${totalQuestions}`;
                    document.getElementById("analysisBtn").classList.remove("hidden");
                    submitBtnTag.disabled = true;
                }
            }

            submitBtnTag.onclick = () => {
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                const resultTag = document.getElementById("result");

                if (selectedOption) {
                    const correctAnswer = questions[currentQuestionIndex].correct_answer;
                    if (selectedOption.value === correctAnswer) {
                        score++;
                    } else {
                        wrongAnswers.push({
                            question: questions[currentQuestionIndex].question,
                            correctAnswer: correctAnswer,
                            selectedAnswer: selectedOption.value
                        });
                    }
                    currentQuestionIndex++;
                    clearInterval(timer);
                    displayQuestion(currentQuestionIndex);
                } else {
                    resultTag.textContent = "Please select an option!";
                }
            };

            displayQuestion(currentQuestionIndex);
        }
    } catch (error) {
        console.error("Error loading quiz", error);
    }
}

document.getElementById("analysisBtn").onclick = () => {
    const analysisModal = document.getElementById("analysisModal");
    document.getElementById("analysisScore").textContent = `Your Score: ${score}`;
    let wrongAnswersText = "Wrong Answers:\n";
    wrongAnswers.forEach((answer, index) => {
        wrongAnswersText += `Q${index + 1}: ${answer.question}\nYour Answer: ${answer.selectedAnswer}\nCorrect Answer: ${answer.correctAnswer}\n\n`;
    });
    document.getElementById("wrongAnswers").textContent = wrongAnswersText;
    analysisModal.classList.remove("hidden");
};

document.getElementById("closeModal").onclick = () => {
    document.getElementById("analysisModal").classList.add("hidden");
};

load_quiz();
