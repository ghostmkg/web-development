let timer = 60;
let score = 0;
let random = 0;

function increase_score(){
  score += 10;
  document.querySelector(".b3").textContent = score;
}

function makehit(){
  random = Math.floor(Math.random()*10);
  document.querySelector(".b1").innerHTML = random;
}

function makebubble(){
  let clutter = " ";

for(let i = 1; i<=100; i++){
  let random_num = Math.floor(Math.random()*10);
  clutter += `<div class="bubble">${random_num}</div>`;
}

document.querySelector("#pbtm").innerHTML = clutter;
}

function countdown(){
  setInterval(()=>{
    if(timer > 0){
      timer --;
      document.querySelector(".b2").innerHTML = timer;
    }
    else{
      document.querySelector("#pbtm").innerHTML = `<h1>Your score is ${score}</h1>`;
    }
  }, 1000)
}

document.querySelector("#pbtm")
.addEventListener("click", function(details){
  let clicked_num = Number(details.target.textContent);
  if(clicked_num === random){
    increase_score();
    makebubble();
  }
});

document.querySelector("#but").addEventListener("click", function(){
  location.reload();
});

makehit();
countdown();
makebubble();