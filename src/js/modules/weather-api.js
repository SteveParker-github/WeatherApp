
const lat = '-45.754';
const long = '170.692';
const units = 'metric';
const exclude = 'current,minutely,daily,alerts'
const key = process.env.weather_key;

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
    let dates = getDates(json);
    let windDirections = getWindDirections(json);
    let windSpeeds = getWindSpeeds(json);
    let temp = getTemp(json);
    let icon = getWeatherIcon(json);

    return {
        "dates": dates,
        "times": times,
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

function getDates(data) {
    let results = [];
    
    let checkDuplicate = "";

    for (let i = 0; i < data.hourly.length; i++) {
        let test = convertDate(data.hourly[i].dt);
        if (test != checkDuplicate) {
            checkDuplicate = test;
            results.push(checkDuplicate);
            console.log(checkDuplicate);
        }
        else {
            results.push("");
        }
    }
/*
    for (let i = 0; i < data.hourly.length; i++) {
        results.push(convertDate(data.hourly[i].dt));
    }*/
    return results;
}

function convertDate(unixTimestamp) {
    let myDate = new Date(unixTimestamp * 1000);

    const months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days_arr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let day = days_arr[myDate.getDay()];
    let date = myDate.getDate();
    let month = months_arr[myDate.getMonth()];

    let result = day + " " + date + " " + month;

    return result;
}

//convert the unix timestamp to readable times for users
function convertTime(unixTimestamp) {
    let myDate = new Date(unixTimestamp * 1000);

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
    let time = hours;
    return time;
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