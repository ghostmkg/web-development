const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const loginSection = document.getElementById('login-section');
const conceptsSection = document.getElementById('concepts-section');
const conceptsDiv = document.getElementById('concepts');
const displayUsername = document.getElementById('display-username');

const problemsSection = document.getElementById('problems-section');
const problemsContainer = document.getElementById('problems-container');

let username = 'guest';

// Start tracking
startBtn.addEventListener('click', async () => {
    const inputName = usernameInput.value.trim();
    if (!inputName) return alert('Enter your name');
    username = inputName;
    displayUsername.textContent = username;

    loginSection.style.display = 'none';
    conceptsSection.style.display = 'block';

    await loadConcepts();
});

// Load concepts
async function loadConcepts() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/concepts');
        const data = await res.json();
        conceptsDiv.innerHTML = '';

        for (let concept of data.concepts) {
            const div = document.createElement('div');
            div.className = 'concept-card';

            const btn = document.createElement('button');
            btn.textContent = concept;
            btn.onclick = () => loadProblems(concept);

            // Fetch progress to calculate %
            const progressRes = await fetch(`http://127.0.0.1:5000/api/problems/${concept}?username=${username}`);
            const progressData = await progressRes.json();
            const total = progressData.problems.length;
            const solved = progressData.problems.filter(p => p.completed).length;
            const percent = total ? Math.round((solved / total) * 100) : 0;

            const progressDiv = document.createElement('div');
            progressDiv.className = 'progress-bar';
            progressDiv.innerHTML = `<div class="progress" style="width:${percent}%">${percent}%</div>`;

            div.appendChild(btn);
            div.appendChild(progressDiv);
            conceptsDiv.appendChild(div);
        }
    } catch (err) {
        alert('Error loading concepts. Check backend is running.');
        console.error(err);
    }
}

// Load problems
async function loadProblems(concept) {
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/problems/${concept}?username=${username}`);
        const data = await res.json();

        problemsContainer.innerHTML = `<h2>${concept}</h2>`;
        const ul = document.createElement('ul');
        ul.className = 'problems-list';

        data.problems.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.title} (${p.difficulty}) - Hint: ${p.hint}, Trivia: ${p.trivia}`;

            const codeBox = document.createElement('textarea');
            codeBox.placeholder = 'Write your solution here...';
            li.appendChild(document.createElement('br'));
            li.appendChild(codeBox);

            const solvedBtn = document.createElement('button');
            solvedBtn.textContent = p.completed ? 'Solved ✅' : 'Mark as Solved';
            solvedBtn.style.backgroundColor = p.completed ? 'green' : '#ff9800';
            solvedBtn.onclick = async () => {
                await fetch('http://127.0.0.1:5000/api/update-progress', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, concept, problem_id: p.id, completed: true})
                });
                solvedBtn.textContent = 'Solved ✅';
                solvedBtn.style.backgroundColor = 'green';
                await loadConcepts();
            };
            li.appendChild(solvedBtn);
            ul.appendChild(li);
        });

        problemsContainer.appendChild(ul);

        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back to Concepts';
        backBtn.onclick = () => {
            problemsSection.style.display = 'none';
            conceptsSection.style.display = 'block';
        };
        problemsContainer.appendChild(backBtn);

        conceptsSection.style.display = 'none';
        problemsSection.style.display = 'block';
    } catch (err) {
        alert('Error loading problems.');
        console.error(err);
    }
}
