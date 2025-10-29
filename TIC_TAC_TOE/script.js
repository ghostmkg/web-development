let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let turnO = true;
let msgContainer= document.querySelector(".msg-container");
let msg= document.querySelector("#msg");

const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

let count=0;
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        count++;
        if(turnO) {
            box.innerText = "O";
            turnO = false;
        }
        else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;
        win();
        
    });
});

let showWinner = (winner) => {
    msg.innerText=`Congratulations, winner is ${winner}`;
    msgContainer.classList.remove("hide");
}
let flag=0;
const win=() =>{
    for(let pattern of winPatterns) {
        let pos1=boxes[pattern[0]].innerText;
        let pos2=boxes[pattern[1]].innerText;
        let pos3=boxes[pattern[2]].innerText;
        if(pos1 != "" && pos2 != "" && pos3 != "")
        {
            if(pos1 === pos2 && pos2 === pos3)
            {
                flag=1
                console.log("winner", pos1);
                showWinner(pos1);
                let disable = boxes.forEach((box) => {
                    box.disabled=true;
                })
            }
        }
    }
    tie();
};
const tie=()=>{
    if(count==9 && flag==0){
        msg.innerText = `It is a tie.`;
    msgContainer.classList.remove("hide");
}
}