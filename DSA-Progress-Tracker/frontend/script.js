const API_BASE = "http://127.0.0.1:5000";

async function loadConcepts() {
  const res = await fetch(`${API_BASE}/api/concepts`);
  const data = await res.json();
  displayConcepts(data.concepts);
}

async function loadProblems(concept) {
  const res = await fetch(`${API_BASE}/api/problems/${concept}`);
  const data = await res.json();
  displayProblems(concept, data.problems);
}
