
const lat = '-45.754';
const long = '170.692';
const units = 'metric';
const exclude = 'current,minutely,daily,alerts'
const key = '4bf77663c016d7237d16b9e8b53d800f';

const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=' + units + '&exclude=' + exclude + '&appid=' + key;


export function weatherData() {
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return sortData(json);
        })
        
}

function sortData(json) {
  console.log(json);  
    let times = getTimes(json);
    let windDegs = getWindDegs(json);
    let windDirections = getWindDirections(json);
    let windSpeeds = getWindSpeeds(json);
    let temp = getTemp(json);
    let icon = getWeatherIcon(json);

    return {
        "lon": json.lon,
        "lat": json.lat,
        "times": times,
        "windDegs": windDegs,
        "windDirections": windDirections,
        "windSpeeds": windSpeeds,
        "temp": temp,
        "icon": icon
    };
}

//gets the times and sends back a readable time stamp
function getTimes(data) {
    let results = [];

    for (let i = 0; i < data.hourly.length; i++) {
        results.push(convertTime(data.hourly[i].dt));
    }

    return results;
}

//convert the unix timestamp to readable times for users
function convertTime(unixTimestamp) {
    let myDate = new Date(unixTimestamp * 1000);

    const months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = myDate.getDate();
    let month = months_arr[myDate.getMonth()];
    let hours = myDate.getHours();
    if (hours > 12) {
        hours = hours - 12 + " pm";
    }
    else if ((hours < 12) || (hours == 0)) {
        hours += " am";
    }
    else {
        hours += " pm";
    }
    let time = day + "-" + month + " " + hours;
    return time;
}

//get wind desgrees and return an array
function getWindDegs(data) {
    let results = [];

    for (let i = 0; i < data.hourly.length; i++) {
        results.push(data.hourly[i].wind_deg);
    }

    return results;
}

//get wind degrees and returns the named direction as an array
function getWindDirections(data) {
    let results = [];

    for (let i = 0; i < data.hourly.length; i++) {
        results.push(convertWindDirection(data.hourly[i].wind_deg));
    }

    return results;
}

//converts wind deg into a named direction
function convertWindDirection(compassDirection) {
    var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    let degreesToName = Math.round(((compassDirection %= 360) < 0 ? compassDirection + 360 : compassDirection) / 45) % 8;
    let windName = directions[degreesToName];

    return windName;
}

//gets wind speeds, converts to km/h and returns an array 
function getWindSpeeds(data) {
    let results = [];

    for (let i = 0; i < data.hourly.length; i++) {
        results.push((data.hourly[i].wind_speed * 3.6).toFixed(0));
    }

    return results;
}

//gets temperature 
function getTemp(data) {
  let results = [];

  for (let i = 0; i < data.hourly.length; i++) {
    results.push((data.hourly[i].temp).toFixed(0));
  }

  return results;
}

//gets weather icon
function getWeatherIcon(data) {
  let results = [];

  for (let i = 0; i < data.hourly.length; i++) {
    let id = data.hourly[i].weather[0].icon;
    results.push('http://openweathermap.org/img/wn/' + id + '@2x.png');
  }

  return results;
}