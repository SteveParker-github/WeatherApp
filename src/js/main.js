//import { windData } from "./modules/wind-api.js";
import { tidalData } from "./modules/tidal-api.js";
import { weatherData } from "./modules/weather-api.js";

//create table
let table = document.createElement('table');
document.getElementById("table_container").appendChild(table);

//call the apis
tidalData().then(tidalDatas => {
    weatherData()
        .then(weatherDatas => { syncAPIs(tidalDatas, weatherDatas) })
})

//makes the tidal API sync up with the wind API
function syncAPIs(tidalDatas, weatherDatas) {
    let counter = 0;
    let match = 0;

    tidalDatas.times.forEach(element => {
        if (element == weatherDatas.times[0]) {
            match = counter;
        }
        counter++;
    })

    tidalDatas.json.values.splice(0, match);
    tidalDatas.times.splice(0, match);

    let windLength = weatherDatas.times.length;
    let tidalLength = tidalDatas.json.values.length;

    tidalDatas.json.values.splice(windLength, tidalLength - windLength);
    tidalDatas.times.splice(windLength, tidalLength - windLength);

    let mainData = combineData(tidalDatas, weatherDatas);
    addDataToWebsite(mainData);
}

//combines the APIs data into one data
function combineData(tidalDatas, weatherDatas) {
    let mainData = {
        "times": weatherDatas.times,
        "icon": weatherDatas.icon,
        "temp": weatherDatas.temp,
        "windDirections": weatherDatas.windDirections,
        "windSpeeds": weatherDatas.windSpeeds,
        "tidalValues": []
    };

    let tidalValues = [];

    tidalDatas.json.values.forEach(element => {
        tidalValues.push(element.value);
    });

    mainData.tidalValues = tidalValues;

    return mainData;
}

//add data to the table
function addDataToWebsite(mainData) {
    let trs = [];
    for (let i = 0; i < Object.keys(mainData).length; i++) {
        trs.push(document.createElement('tr'));
    }
    let tableHeaders = [Object.keys(mainData)];
    tableHeaders = tableHeaders[0];

    for (let i = 0; i < mainData.times.length; i++) {
        for (let j = 0; j < tableHeaders.length; j++) {
            let td = document.createElement('td');
            if (tableHeaders[j] == "windSpeeds") {
                td.setAttribute('id', checkSpeeds(mainData.windSpeeds[i], mainData.windDirections[i]));
            }

            if (tableHeaders[j] == "icon") {
                let img = document.createElement("img");
                img.src = mainData.icon[i];
                td.appendChild(img);
            }
            else {
                //adds the unit values for temp and windSpeeds
                switch (tableHeaders[j]) {
                    case "windSpeeds":
                        {
                            let textNode = document.createTextNode(mainData.windSpeeds[i] + " km/hr");
                            td.appendChild(textNode);
                        }
                        break;

                    case "temp":
                        {
                            let textNode = document.createTextNode(mainData.temp[i] + "\u00B0C");
                            td.appendChild(textNode);
                        }
                        break;

                    default:
                        {
                            let textNode = document.createTextNode(mainData[tableHeaders[j]][i]);
                            td.appendChild(textNode);
                        }
                        break;
                }
            }
            trs[j].appendChild(td);
        }
    }

    for (let i = 0; i < trs.length; i++) {
        table.appendChild(trs[i]);
    }
}

//Checks if wind is safe to walk
function checkSpeeds(windSpeed, windDirection) {
    let lowLimit = 15;
    let highLimit = 20;

    switch (windDirection) {
        case 'S':
        case 'SW':
        case 'W':
            {
                lowLimit = 10;
                highLimit = 15;
            }
    }

    if (windSpeed < lowLimit) {
        return "low";
    }
    else if ((windSpeed >= lowLimit) && (windSpeed < highLimit)) {
        return 'medium';
    }
    else {
        return "high";
    }
}