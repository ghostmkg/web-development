const form=document.querySelector('form')

// this usecase will give you empty value
// const height= parseInt(document.querySelector('#height').value)

form.addEventListener('submit',function(e){
    e.preventDefault();
   const height= parseInt(document.querySelector('#height').value)
   const weight= parseInt(document.querySelector('#weight').value)
   const results= (document.querySelector('#results'))
   
   
   if (height===""|| height<0 || isNaN(height)) {
    results.innerHTML="Please give a valid height"
   }
   else if (weight===""|| weight<0 || isNaN(weight)) {
    results.innerHTML="Please give a valid weigth"
   }
   else{
    const bmi=(weight/((height*height)/10000)).toFixed(2)
    //show the result
    results.innerHTML=`<span>${bmi}</span>`
    if (bmi<18.6) {
    results.innerHTML=`<span>${bmi} <br>OMG Your Under weight</span>`
    }
    else if(bmi>18.6 && bmi<24.9){
    results.innerHTML=`<span> ${bmi} <br>Congrats Your fit & fine</span>`

    }
    else{
    results.innerHTML=`<span> ${bmi} <br>OMG Your Over weight</span>`

    }

   }
   

})
