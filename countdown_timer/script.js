const targetDate = new Date("2023-12-31T23:59:59").getTime();

const interval = setInterval(function() {
  const now = new Date().getTime();

  const timeRemaining = targetDate - now;

  const days = Math.floor(timeRemaining / (1000*60*60*24));
  const hours = Math.floor((timeRemaining % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((timeRemaining % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((timeRemaining % (1000*60)) / (1000));

  const count_days = document.getElementById("days");
  count_days.innerText = days;
  
  const count_hours = document.getElementById("hours");
  count_hours.innerText = hours;

  const count_mins = document.getElementById("mins");
  count_mins.innerText = mins;

  const count_secs = document.getElementById("secs");
  count_secs.innerText = seconds;

  if(timeRemaining < 0){
    clearInterval(interval);
    const all = document.getElementsByClassName("big-text");
    all.innerHTML = "0";
  }
}, 1000)