const lat = '-45.85';
const long = '170.48';
const units = 'metric';
const exclude = 'current,minutely,hourly,alerts'
const key = '4bf77663c016d7237d16b9e8b53d800f';

const url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&units=' + units + '&exclude=' + exclude + '&appid=' + key;


export function daily() {
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return sortData(json);
        })
}

function sortData(json) {
    let daily = getDaily(json);
    let icon = getIcon(json);

    return {
        "daily": daily,
        "icon": icon
    }
}

function getDaily(data) {
    let results = [];

    for (let i = 0; i < data.daily.length; i++) {
        results.push(data.daily[i].temp.day.toFixed(0));
      }
      console.log(results)
      return results;
}

function getIcon(data) {
    let results = [];
    console.log(data.daily[0].weather[0].icon)

    for (let i = 0; i < data.daily.length; i++) {
        results.push("http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon  + "@2x.png");
      }
      console.log(results)
      return results;
}

