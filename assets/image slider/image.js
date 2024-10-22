
let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');


let active = 0;
next.onclick = function(){
    active = (active + 1)%items.length;
    reloadSlider();
}
prev.onclick = function(){
    active = (active - 1 +items.length)%items.length;
    reloadSlider();
}
let refreshInterval = setInterval(()=> {next.click()}, 3000);
function reloadSlider(){
    slider.style.left = -items[active].offsetLeft + 'px';
    // 

}


