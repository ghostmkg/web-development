const show = document.getElementById("Display");
const listdiv = document.getElementById("Lists");
const list = [];
const URL = "https://icanhazdadjoke.com/";


async function getJoke() {
  try {
    const res = await fetch(URL, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      const jokeText = `Bro... ${data.joke} 😂`;
      show.innerHTML = `<p>${jokeText}</p>`;

      if (list.length === 3) {
        list.shift();
      }
      list.push(jokeText);
      showList();
    } else {
      console.error("❌ Error:", res.status);
    }
  } catch (e) {
    console.error(e);
  }
}

const showList = () => {
  listdiv.innerHTML = "";
  list.forEach((joke) => {
    const li = document.createElement("li");
    li.textContent = joke;
    listdiv.appendChild(li);
  });
};

