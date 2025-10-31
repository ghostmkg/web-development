const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let wokeFactGiven = false;

const wokeFacts = [
  "🌎 Did you know the fashion industry contributes about 10% of global carbon emissions?",
  "💧 Every plastic bottle takes up to 450 years to decompose — consider reusable ones!",
  "⚖️ Around the world, women earn on average 23% less than men.",
  "🤖 AI can be biased if trained on unfair data — always question your sources!",
  "🌲 Forests absorb about 2.6 billion tons of CO₂ each year — protect them!",
  "🐠 By 2050, there may be more plastic than fish in the oceans.",
];

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function botReply(userMsg) {
  const normalized = userMsg.toLowerCase();
  let reply = "That's interesting! Tell me more.";

  if (normalized.includes("hello") || normalized.includes("hi")) {
    reply = "Hey there! I'm WokeBot 🌍 — let's chat!";
  } else if (normalized.includes("climate") || normalized.includes("earth")) {
    reply = "Yes! Climate change is one of the biggest global challenges.";
  } else if (normalized.includes("bye")) {
    reply = "Goodbye! Stay aware and stay kind 💚";
  }

  // Slip in a global awareness fact once per session
  if (!wokeFactGiven) {
    wokeFactGiven = true;
    const fact = wokeFacts[Math.floor(Math.random() * wokeFacts.length)];
    reply += `\n\n${fact}`;
  }

  setTimeout(() => addMessage(reply, "bot"), 600);
}

sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  userInput.value = "";
  botReply(text);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
