let input = document.querySelector(".application input");
let button = document.querySelector(".application button");
let list = document.querySelector(".application #list");

function addNote()
{

    if (input.value === '')
    {
        alert("Please write something first");
    }

    else
    {
        let li = document.createElement("li");
        li.innerHTML = input.value;
        list.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7"
        li.appendChild(span)
        
        input.value = ""
        save();
    }
}


//function to remove the note
list.addEventListener("click" , function(e)
{
    if(e.target.tagName === "LI")
    {
        e.target.classList.toggle("check");
        save();      
    }

    else if (e.target.tagName === "SPAN")
    {
        e.target.parentElement.remove();
   
        
    }
}, false)



function save()
{
    localStorage.setItem("data" , list.innerHTML);
}

function show()
{
    list.innerHTML = localStorage.getItem("data")

    const items = list.querySelectorAll("li");
    items.forEach(item => {
        item.querySelector("span").addEventListener("click", function () {
            item.remove(); // Remove the list item
            save(); // Save the current state
        });
    });
}

show();