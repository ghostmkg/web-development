var timer = 60;
var score = 0;
var  hitrn = 0;
function increaseScore(){
    score += 10;
    document.querySelector('#scoreval').textContent = score
}

function getnewHit(){
    hitrn = Math.floor(Math.random()*10)
  document.querySelector('#hitval').textContent = hitrn
}
function makeBubble(){
    let clutter = "";

    for(let i = 0 ; i<=154; i++){
        let random  = Math.floor(Math.random()*10);
        clutter += `<div class="bubble">${random}</div>`
    }
    
    document.querySelector("#pbtm").innerHTML = clutter
}
function runTimer(){
    var timerint = setInterval(function(){
        if(timer>0){
            timer--
        document.querySelector('#timerval').textContent = timer; 
        }
          else{
            clearInterval(timerint);
            document.querySelector('#pbtm').innerHTML = `<h1>Game over<h1>`;
          }
    },1000)
}
document.querySelector('#pbtm').addEventListener('click',function(dets){
 let clickedNum = (Number(dets.target.textContent))
 if(clickedNum == hitrn){
    increaseScore();
    makeBubble();
    getnewHit();
 }
})
runTimer(); 
makeBubble();
getnewHit();
// increaseScore();