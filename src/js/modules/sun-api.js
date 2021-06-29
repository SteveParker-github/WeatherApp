const lat = '-45.754';
const long = '170.692';
const units = 'metric';
const exclude = 'current,minutely,daily,alerts'
const key = '2bfcb9be32a7dd2607900e3d435f9b44';

const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=' + units + '&appid=' + key;


export function sunData() {
    return fetch(url)
        .then(response => response.json())
        .then(json => {
            return sortData(json);
        })
}

function sortData(data)
{
    let sunriseTimes = [];
    let sunsetTimes = [];

    for(let i = 0; i<7; i++)
        {
            let timeSunrise = data.daily[i].sunrise;
            let timeSunset = data.daily[i].sunset;
            let sunriseDate = new Date(timeSunrise*1000);
            let sunsetDate = new Date(timeSunset*1000);
            let sunriseHours = sunriseDate.getHours();
            let sunsetHours = sunsetDate.getHours();
            let sunriseMinutes = sunriseDate.getMinutes();
            let sunsetMinutes = sunsetDate.getMinutes();
            let sunriseFormattedTime = sunriseHours + ":" + sunriseMinutes; 
            let sunsetFormattedTime = sunsetHours + ":" + sunsetMinutes; 
            sunriseTimes.push(sunriseFormattedTime);
            sunsetTimes.push(sunsetFormattedTime);
        }
        console.log(sunriseTimes);
        console.log(sunsetTimes);  
}


/*function Sunset()
{
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        for(let i = 0; i<7; i++)
        {
            let timeSunset = data.daily[i].sunset;
            console.log(timeSunset);
            let date = new Date(timeSunset*1000);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let formattedTime = hours + ":" + minutes; 
            console.log(formattedTime);
        }
        
    })
}

Sunrise();
Sunset()
*/
