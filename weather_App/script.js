
const Location=document.getElementById("search");
const serch_btn=document.getElementsByClassName("search-btn")[0];


serch_btn.addEventListener('click',()=>{
   
    const city=Location.value.trim();

    if(!city){
        alert("Please Enter valid city Name");
    }
    else{

      const WEATHER_API_KEY=`https://api.openweathermap.org/data/2.5/weather?appid=85216a3ff665f3e1bd076d0d745dd5d9&q=${city}&units=metric`
      const API_Key=  `85216a3ff665f3e1bd076d0d745dd5d9`; 

        fetch(WEATHER_API_KEY).then((response)=>response.json()).then((data)=>{
            console.log(data);

          if(data.cod!='' && data.cod!=200){
        alert(data.message);
        return;
       }
      
       else{

          const icons=[
            {names:["clear sky"],icon:"./css/images/clearsky.png"},
            {names:["few clouds"],icon:"./css/images/clearsky.png"},
            {names:["scattered clouds"],icon:"./css/images/scattered_clouds.png"},
            {names:["broken clouds","overcast clouds"],icon:"./css/images/broken_clouds.png"},
            {names:[ "shower rain"],icon:"./css/images/shower_rain.png"},
            {names:["rain","light rain","moderate rain","heavy intensity rain","very heavy rain","extreme rain","freezing rain","light intensity shower rain","heavy intensity shower rain","ragged shower rain"],icon:"./css/images/rain.png"},
            {names:["thunderstorm","thunderstorm with rain","thunderstorm with light rain","thunderstorm with heavy rain","light thunderstorm","thunderstorm","heavy thunderstorm","ragged thunderstorm","thunderstorm with light drizzle","thunderstorm with drizzle","thunderstorm with heavy drizzle"],icon:"./css/images/thunder_storm.png"},
             {names:["snow","light snow","heavy snow","sleet","light shower sleet","shower sleet","light rain and snow","rain and snow","shower snow","light shower snow","heavy shower snow"],icon:"./css/images/snow.png"},
             {names:["mist","smoke","haze","fog","sand/dust whirls","sand","dust","volcanic ash","squalls","tornado"],icon:"./css/images/mist.png"},
            {names:["light intensity drizzle","drizzle","heavy intensity drizzle","light intensity drizzle rain","drizzle rain","heavy intensity drizzle rain","shower rain and drizzle","heavy shower rain and drizzle","shower drizzle"],icon:"./css/images/drizzle.png"}
            ]

          function getWeathericon(des){
            for(let group of icons){
              if(group.names.includes(des))
                 return group.icon;
            }
            return "./css/images/clearsky.png";
          }

         document.getElementsByClassName("weather_container")[0].innerHTML="";
        document.getElementById("location").innerText=city;

         const weather_card=document.createElement('div');
         weather_card.className="mastercard0";

           const options1={
            hour:"numeric",
            minute:"numeric",
            hour12:"true"                        //inbuilt property
        }
        srtime=getLongFormatDate(data.sys.sunrise,options1);
        sstime=getLongFormatDate(data.sys.sunset,options1);

        const temp=Math.round(data.main.temp);
        const iconpath=data.weather[0].description;

         weather_card.innerHTML=`<h5 style="color:hsl(200, 100%, 70%)">Current Weather</h5>
         <div class="d-flex gap-1 justify-content-center mt-4">
         <img src="${getWeathericon(iconpath)}" width="45px" height="45px">
         <div class="d-flex flex-column gap-1">
         <h4 class="m-0">${temp}&deg;C</h4>
         <p class="m-0">${data.weather[0].description}</p>
         </div>
         </div>
         
         <div class="weather_grid">
          <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Humidity</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-water fa-lg" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="hValue m-0">${data.main.humidity}%</h5>
       </div>
        </div>
         <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Wind Speed</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-wind fa-lg" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="wind_speed m-0">${data.wind.speed}km/h</h5>
       </div>
        </div>
         <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Visibility</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-eye fa-lgh" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="visibility m-0">${data.visibility}km</h5>
       </div>
        </div>
         <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Pressure</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-gauge-high fa-lg" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="PValue m-0">${data.main.pressure}%</h5>
       </div>
        </div>
         <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Sun rise</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-cloud-sun fa-lg" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="srise m-0">${srtime}</h5>
       </div>
        </div>
         <div class="card-0 mt-3 d-flex flex-column gap-1  align-items-center">
       <p>Sunset</p>
       <div class="info d-flex gap-1"><!--icon and text-->
        <span><i class="fa-solid fa-water fa-lg" style="color: hsl(200, 100%, 40%) "></i></span>
       <h5 class="sset m-0">${sstime}</h5>
       </div>
        </div>
        </div>`
         document.getElementsByClassName("weather_container")[0].appendChild(weather_card);

         const Next_5Days=`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_Key}&units=metric` 

        fetch(Next_5Days).then(response=>response.json()).then((forecastdata)=>{ //gives weather for every 3 hrs

            console.log(forecastdata); 
         const now=new Date();
        const futuredata=forecastdata.list.filter(item=>{
            const forecastTime=new Date(item.dt *1000);
            return forecastTime>=now;
           });

        const hoursForeCast=futuredata.slice(0,7);
         document.getElementsByClassName("Next_3hrs")[0].innerHTML="";
       
       

         const Nexthrs=document.createElement('div');
        Nexthrs.className='mastercard1';
        document.getElementsByClassName('Next_3hrs')[0].appendChild(Nexthrs);

       const heading=document.createElement('h5');
       heading.textContent="Today's Forecast";
       heading.style.color="hsl(200, 100%, 70%) ";

       Nexthrs.appendChild(heading);

       const cardholder=document.createElement('div');
       cardholder.className='cardholder';
       Nexthrs.appendChild(cardholder);


          hoursForeCast.forEach(element => {
            
            let Next3hrscard= document.createElement('div');
            Next3hrscard.className='card-1';
            const iconpath1=element.weather[0].description;

           const dateStr=element.dt_txt;
           const date=new Date(dateStr);
           const options2={month:'short',day:'numeric'};
           const formatteddate=date.toLocaleDateString('en-US',options2);

           const options3={hour:'numeric',hour12:'true'};
           const formattedtime=date.toLocaleTimeString([],options3);

            Next3hrscard.innerHTML=`
             <h6>${formatteddate}</h6>
             <h6>${formattedtime}</h6>
             <div class="d-flex gap-1 align-items-center">
            <img src="${getWeathericon(iconpath1)}" width="40px" height="40px">
            <p style="color:white m-0"><strong>${Math.round(element.main.temp)}&deg;C</strong></p></div>
            <p>${element.weather[0].description}</p>`;

            document.getElementsByClassName('cardholder')[0].appendChild(Next3hrscard);
            
           });

            document.getElementsByClassName("Next_5days")[0].innerHTML="";
              const Next5Days=document.createElement('div');
              Next5Days.className='mastercard2';
             // Next_5Days.innerHTML=`<div><h6>Next 5 Days</h6></div>`

                document.getElementsByClassName('Next_5days')[0].appendChild(Next5Days);

                const heading2=document.createElement('h5');
                 heading2.textContent="Next 5 Days";
                 heading2.style.color="hsl(200, 100%, 70%) ";

                Next5Days.appendChild(heading2);

                const cardholder2=document.createElement('div');
                cardholder2.className='cardholder2';
                Next5Days.appendChild(cardholder2);

              

               const dailyForeCast=forecastdata.list.filter(item=>item.dt_txt.includes("12:00:00")); 



                 dailyForeCast.forEach(element => {

                      const dateStr=element.dt_txt;
                      let date=new Date(dateStr);
                       const options4={weekday:'long'};
                      const customday=date.toLocaleDateString([],options4);
                      const options5={month:'short',day:'numeric'};
                      const customtime=date.toLocaleDateString([],options5);
           
            const temp=element.main.temp;
            const des=element.weather[0].description;
            
            let Next5days= document.createElement('div');
            Next5days.className='card-2';
            Next5days.innerHTML=` <h6>${customday}</h6>
            <h6>${customtime}</h6>
            <img src="${getWeathericon(des)}" width="30px" height="30px">
            <p><strong>${temp}&deg;C</strong></p>
             <p>${des}</p>`;
            document.getElementsByClassName('cardholder2')[0].appendChild(Next5days);
            
           });

       
       });
      
      
           
       }
        });
      
    } 
})

function formatUnixTimezone(dtValue,options={}){
       const date=new Date(dtValue*1000);
       return date.toLocaleTimeString([],options);
   }

   function getLongFormatDate(dtValue,options){
    return formatUnixTimezone(dtValue,options);
   }