let boxes = document.querySelectorAll(".game .box");
let reset = document.querySelector(".game .reset");
let container = document.querySelector(".message");
let winner = document.querySelector(".message .winner");
let newgame = document.querySelector(".message .bbt");
let draw = document.querySelector(".message .draw");
let winPattern = 
[
[0,1,2] ,
[0,3,6] , 
[0,4,8] , 
[1,4,7] , 
[2,4,6] ,
[2,5,8] ,
[3,4,5] , 
[6,7,8] 
]  



// players turn
let turn = 0;                 
for(let i=0; i<boxes.length; i++)
{
    boxes[i].addEventListener("click" , () =>
{
    if(boxes[i].innerText === "")
    {

        if(turn%2 == 0)
            {
                boxes[i].innerText = "X"
            }
            
            else
            {
                boxes[i].innerText = "O"
            }
            
    }
    checkwinner();
    turn++
    console.log(turn);
    
 
    if (turn === 9 )
    {
        if(!checkwinner())
        {
        container.classList.remove("hide")
        newgame.classList.remove("hide")
        draw.classList.remove("hide");
        winner.classList.add("hide")
        disable()
        }
    }
})
}

// reseting game

reset.addEventListener("click",() =>
{
    enable()
    container.classList.add("hide")
    draw.classList.add("hide");
    for(let i=0; i<boxes.length; i++)
    {
        boxes[i].innerText = "";
    }
    turn = 0;
})


newgame.addEventListener("click",() =>
{
    // winner.classList.add("hide")
        container.classList.add("hide")
        draw.classList.add("hide");
        // newgame.classList.add("hide")
        enable()
    for(let i=0; i<boxes.length; i++)
    {
        boxes[i].innerText = "";
    }
    turn = 0;
})



// to disable buttons buttons aftger the games is fininshed
const disable = ()=>
{
    for(let box of boxes)
    {
        box.disabled = true;
    }
}

const enable = ()=>
{
    for(let box of boxes)
    {
        box.disabled = false;
    }
}

// print detials after the games is finished
const gamedetails = (val)=>
    {
        winner.innerText = val+" Wins"
        winner.classList.remove("hide")
        container.classList.remove("hide")
        newgame.classList.remove("hide")
        disable()
    }
    
    // winnig logic
    const checkwinner = ()=>
    {
        for (let element of winPattern)
        {
            let val1 =    boxes[element[0]].innerText;
            let val2 =    boxes[element[1]].innerText;
            let val3 =    boxes[element[2]].innerText;
    
            if(val1 != "" && val2 != "" && val3 != "")
            {
                if(val1 === val2 && val2 === val3)
                {
                    gamedetails(val1);
                    return true;
                }
            }       
        }
        return false;
    }
    




