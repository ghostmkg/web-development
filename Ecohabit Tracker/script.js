const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabit");
const habitList = document.getElementById("habitList");
const ecoScoreDisplay = document.getElementById("ecoScore");
const resetBtn = document.getElementById("reset");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let ecoScore = parseInt(localStorage.getItem("ecoScore")) || 0;

function updateScore() {
  ecoScoreDisplay.textContent = ecoScore;
  localStorage.setItem("ecoScore", ecoScore);
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = habit.name;
    if (habit.completed) li.classList.add("completed");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = habit.completed ? "Undo" : "Done";

    toggleBtn.addEventListener("click", () => {
      habit.completed = !habit.completed;
      if (habit.completed) ecoScore += 10;
      else ecoScore -= 10;
      updateScore();
      saveHabits();
      renderHabits();
    });

    li.appendChild(toggleBtn);
    habitList.appendChild(li);
  });
}

addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName === "") return alert("Please enter a habit!");
  habits.push({ name: habitName, completed: false });
  habitInput.value = "";
  saveHabits();
  renderHabits();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Reset all habits and score?")) {
    habits = [];
    ecoScore = 0;
    localStorage.clear();
    updateScore();
    renderHabits();
  }
});

renderHabits();
updateScore();
