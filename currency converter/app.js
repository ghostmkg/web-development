
const BASE_URL="https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/"
const dropdowns =document.querySelectorAll(".dropdown select")
const btn=document.querySelector("form button");
const fromcurr=document.querySelector(".from select")
const tocurr=document.querySelector(".to select")
const msg=document.querySelector(".msg")
for(let select of dropdowns)
{
   for(let code in countryList)
   {
     let opt=document.createElement("option")
     opt.innerText=code
     opt.value=code
     select.append(opt)
     if(select.name=="from"&&code =="INR")
     {
        opt.selected="selected"
     }
     else if(select.name=="to"&&code =="USD")
     {
        opt.selected="selected"
     }
   }
   select.addEventListener("change",(event)=>
   {
       updateflag(event.target)
   })
   const updateflag=(element)=>
   {
      let currenycode=element.value
      console.log(currenycode)
      let countrycode=countryList[currenycode]
      console.log(countrycode)
      let newsrc=`https://flagsapi.com/${countrycode}/shiny/64.png`
      let img=element.parentElement.querySelector("img")
      img.src=newsrc;    
   }
   btn.addEventListener("click",async(evt)=>
   {
      evt.preventDefault();
      let amount=document.querySelector(".amount input")
      let amtvalue=amount.value
      if(amtvalue=="" || amtvalue<1)
      {
         amtvalue=1;
         amount.value="1"
      }
      const URL=`${BASE_URL}/${fromcurr.value.toLowerCase()}/${tocurr.value.toLowerCase()}.json`
      let response=await fetch(URL)
      let data= await response.json()
      let rate=(data[tocurr.value.toLowerCase()])
      let finalamout=amtvalue*rate;
      msg.innerText=`${amtvalue}${fromcurr.value}=${finalamout}${tocurr.value}`;

 




   })
}
