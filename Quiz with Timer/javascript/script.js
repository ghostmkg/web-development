// DOM element selectors
const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = quizContainer.querySelector(".answer-options");
const nextQuestionBtn = quizContainer.querySelector(".next-question-btn");
const questionStatus = quizContainer.querySelector(".question-status");
const timerDisplay = quizContainer.querySelector(".timer-duration");
const resultContainer = document.querySelector(".result-container");
// Quiz state variables
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 10;
let currentQuestion = null;
const questionsIndexHistory = [];
let correctAnswersCount = 0;
let disableSelection = false;

const STORAGE_KEY = "quiz_state_v1";

// Save quiz state to localStorage
const saveState = () => {
  const state = {
    quizStarted: document.querySelector('.quiz-popup').classList.contains('active'),
    quizCategory,
    numberOfQuestions,
    questionsIndexHistory: questionsIndexHistory.slice(),
    correctAnswersCount,
    currentTime
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore storage errors */ }
};

// Load quiz state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

// Clear persisted state
const clearState = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
};
// Display the quiz result and hide the quiz container
const showQuizResult = () => {
  clearInterval(timer);
  document.querySelector(".quiz-popup").classList.remove("active");
  document.querySelector(".result-popup").classList.add("active");
  const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
  resultContainer.querySelector(".result-message").innerHTML = resultText;
};
// Clear and reset the timer (accept an optional starting time)
const resetTimer = (startTime = QUIZ_TIME_LIMIT) => {
  clearInterval(timer);
  currentTime = startTime;
  timerDisplay.textContent = `${currentTime}s`;
};
// Initialize and start the timer for the current question
const startTimer = () => {
  // ensure any existing timer is cleared
  clearInterval(timer);
  timer = setInterval(() => {
    currentTime--;
    // update UI
    timerDisplay.textContent = `${currentTime}s`;
    // persist the remaining time so reload resumes correctly
    saveState();
    if (currentTime <= 0) {
      clearInterval(timer);
      disableSelection = true;
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";
      highlightCorrectAnswer();
      // Disable all answer options after one option is selected
      answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
      // persist final state
      saveState();
    }
  }, 1000);
};
// Fetch a random question from based on the selected category
const getRandomQuestion = () => {
  const categoryQuestions = questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];
  // Show the results if all questions have been used
  if (questionsIndexHistory.length >= Math.min(numberOfQuestions, categoryQuestions.length)) {
    return showQuizResult();
  }
  // Filter out already asked questions and choose a random one
  const availableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));
  const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};
// Highlight the correct answer option and add icon
const highlightCorrectAnswer = () => {
  const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded"> check_circle </span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};
// Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
  if (disableSelection) return;
  clearInterval(timer);
  disableSelection = true;
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswersCount++;
  saveState();
  // Insert icon based on correctness
  const iconHTML = `<span class="material-symbols-rounded"> ${isCorrect ? "check_circle" : "cancel"} </span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);
  // Disable all answer options after one option is selected
  answerOptions.querySelectorAll(".answer-option").forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};
// Render the current question and its options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  disableSelection = false;
  // Each new question should start with the full time limit
  currentTime = QUIZ_TIME_LIMIT;
  // persist the new question index and reset time
  saveState();
  resetTimer(currentTime);
  startTimer();
  // Update the UI
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313C";
  quizContainer.querySelector(".question-text").textContent = currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  answerOptions.innerHTML = "";
  // Create option <li> elements, append them, and add click event listeners
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.append(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

// Render a specific question (used when restoring state)
const renderQuestionByIndex = (index) => {
  const categoryQuestions = questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];
  const q = categoryQuestions[index];
  if (!q) return;
  currentQuestion = q;
  disableSelection = false;
  resetTimer(currentTime);
  startTimer();
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#32313C";
  quizContainer.querySelector(".question-text").textContent = currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  answerOptions.innerHTML = "";
  currentQuestion.options.forEach((option, idx) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.append(li);
    li.addEventListener("click", () => handleAnswer(li, idx));
  });
};
// Start the quiz and render the random question
const startQuiz = () => {
  document.querySelector(".config-popup").classList.remove("active");
  document.querySelector(".quiz-popup").classList.add("active");
  // Update the quiz category and number of questions
  quizCategory = configContainer.querySelector(".category-option.active").textContent;
  numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);
  // persist starting state
  saveState();
  renderQuestion();
};
// Highlight the selected option on click - category or no. of question
configContainer.querySelectorAll(".category-option, .question-option").forEach((option) => {
  option.addEventListener("click", () => {
    option.parentNode.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});
// Reset the quiz and return to the configuration container
const resetQuiz = () => {
  resetTimer();
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  clearState();
  document.querySelector(".config-popup").classList.add("active");
  document.querySelector(".result-popup").classList.remove("active");
};
// Event listeners
nextQuestionBtn.addEventListener("click", renderQuestion);
resultContainer.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
configContainer.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);

// On load, attempt to restore state
window.addEventListener('load', () => {
  const state = loadState();
  if (!state) return;
  // Restore configuration
  quizCategory = state.quizCategory || quizCategory;
  numberOfQuestions = state.numberOfQuestions || numberOfQuestions;
  correctAnswersCount = state.correctAnswersCount || 0;
  currentTime = state.currentTime || QUIZ_TIME_LIMIT;
  if (Array.isArray(state.questionsIndexHistory) && state.questionsIndexHistory.length > 0) {
    // populate questionsIndexHistory
    questionsIndexHistory.length = 0;
    state.questionsIndexHistory.forEach(i => questionsIndexHistory.push(i));
    // Show quiz popup and render last asked question
    document.querySelector('.config-popup').classList.remove('active');
    document.querySelector('.quiz-popup').classList.add('active');
    const lastIndex = questionsIndexHistory[questionsIndexHistory.length - 1];
    renderQuestionByIndex(lastIndex);
  }
});