const lat = '-45.768';
const long = '170.705';
const interval = '60';
const numberofdays = '3';
const key = 'SYRXXl3rBGFiO1zpHGGeqrkvAbPGpA8K';

const url = 'https://api.niwa.co.nz/tides/data?lat=' + lat + '&long=' + long + '&numberOfDays=' + numberofdays + '&interval=' + interval + '&apikey=' + key;
const options = {method: 'GET', headers: {'Content-Type': 'application/json'}};

export function tidalData() {
    return fetch(url)
        .then(response => response.json())
        .then(json => {
            return sortData(json);
        })
}

function sortData(json) {
    let times = [];

    times = getTimes(json);
    return {
        "json": json,
        "times": times
    }
}

function getTimes(data){
    let results = [];
    for (let i = 0; i < data.values.length; i++){
        results.push(getTime(data.values[i].time));
    }
    return results;
}
function getTime(time){
    let myDate = new Date(time);
    let day = myDate.getDate();
    let month = myDate.getMonth() + 1;
    let hours = myDate.getHours();
    let result = 'Date ' + day + '-' + month + ", Time " + hours + ':00';
    return result;
}
