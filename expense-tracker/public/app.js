const socket = io();
const form = document.getElementById('expense-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expense-list');
const totalDiv = document.getElementById('total');
const themeToggle = document.getElementById('theme-toggle');

function renderExpenses(expenses) {
  expenseList.innerHTML = '';
  let total = 0;
  expenses.forEach(exp => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    const right = document.createElement('div');
    left.innerHTML = `<strong>${escapeHtml(exp.desc)}</strong> <div class="meta">${new Date(exp.createdAt).toLocaleString()}</div>`;
    right.innerHTML = `$${parseFloat(exp.amount).toFixed(2)} <button class="delete" data-id="${exp.id}" aria-label="Delete">✕</button>`;
    li.appendChild(left);
    li.appendChild(right);
    expenseList.appendChild(li);
    total += parseFloat(exp.amount);
  });
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = amountInput.value;
  if (!desc || !amount) return;
  socket.emit('addExpense', { desc, amount });
  descInput.value = '';
  amountInput.value = '';
});

socket.on('init', renderExpenses);
socket.on('update', renderExpenses);

// delegate delete button
expenseList.addEventListener('click', (e) => {
  if (e.target && e.target.matches('button.delete')) {
    const id = e.target.getAttribute('data-id');
    if (id) socket.emit('removeExpense', id);
  }
});

// Simple HTML escape
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
  });
}

// Theme toggle
function applyTheme(theme) {
  if (theme === 'dark') document.body.classList.add('dark'); else document.body.classList.remove('dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});
