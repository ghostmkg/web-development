document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;

            // Toggle answer display
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });
});
