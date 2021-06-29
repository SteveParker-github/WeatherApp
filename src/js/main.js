import { weatherData } from "./modules/weather-api.js";

//create table
let table = document.createElement('table');
document.getElementById("table_container").appendChild(table);

//call the apis
weatherData()
    .then(weatherDatas => { sortAPIs(weatherDatas) })

//makes the tidal API sync up with the wind API
function sortAPIs(weatherDatas) {
    let mainData = combineData(weatherDatas);

    addDataToWebsite(mainData);
}

//combines the APIs data into one data
function combineData(weatherDatas) {
    let mainData = {
        "dates": weatherDatas.dates,
        "times": weatherDatas.times,
        "icon": weatherDatas.icon,
        "temp": weatherDatas.temp,
        "windDirections": weatherDatas.windDirections,
        "windSpeeds": weatherDatas.windSpeeds,
    };
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
    let textNode = document.createTextNode('test');
    let checkDate = "";
    for (let i = 0; i < mainData.times.length; i++) {
        for (let j = 0; j < tableHeaders.length; j++) {
            let td = document.createElement('td');
            switch (tableHeaders[j]) {
                case "windSpeeds":
                    td.setAttribute('id', checkSpeeds(mainData.windSpeeds[i]));
                    textNode = document.createTextNode(mainData.windSpeeds[i] + " km/hr");
                    td.appendChild(textNode);
                    break;

                case "icon":
                    let img = document.createElement("img");
                    img.src = mainData.icon[i];
                    td.appendChild(img);
                    break;

                case "temp":
                    textNode = document.createTextNode(mainData.temp[i] + "\u00B0C");
                    td.appendChild(textNode);
                    break;

                case "dates":
                    let text = mainData[tableHeaders[j]][i];
                    if ((text != checkDate) && (text != "")) {
                        checkDate = text;
                        textNode = document.createTextNode(text);
                        console.log(textNode);
                        td.setAttribute('id', "sticky");
                        let distance = (countDistance(mainData.dates, text) * 123) + 3; 
                        td.setAttribute('style', "margin-Right:" + distance + "px");
                        td.appendChild(textNode);
                    }
                    else {
                        td.setAttribute('style', 'border: 0');
                    }
                    break;

                default:
                    textNode = document.createTextNode(mainData[tableHeaders[j]][i]);
                    td.appendChild(textNode);
                    break;

            }
            if (textNode != null) {
                trs[j].appendChild(td);
            }
        }

        for (let i = 0; i < trs.length; i++) {
            table.appendChild(trs[i]);
        }
    }
}

//Counts how many to span across
function countDistance(checkArray, check) {
    let startingPoint = 0;
    let totalGap = 0;
    console.log(checkArray);
    for (let i = 0; i < checkArray.length; i++) {
        if (checkArray[i] == check) {
            startingPoint = i + 1;
        }
    } 
    console.log(startingPoint); 

    for (let i = startingPoint; i < checkArray.length; i++) {
        if (checkArray[i] != "") {
            totalGap = i - startingPoint;
            break;
        }
    } 
    console.log(totalGap);
    let result = checkArray.length - (totalGap + startingPoint);
    if ((startingPoint != 0) && (totalGap == 0))
    {
        result = 0;
    }
    console.log(result);
    return result;
}

//Checks if wind is safe to walk
function checkSpeeds(windSpeed) {
    let lowLimit = 15;
    let mediumLimit = 30;
    let highLimit = 40;

    if (windSpeed < lowLimit) {
        return "safe";
    }
    else if ((windSpeed >= lowLimit) && (windSpeed < mediumLimit)) {
        return 'lowRisk';
    }
    else if ((windSpeed >= mediumLimit) && (windSpeed < highLimit)) {
        return 'mediumRisk';
    }
    else {
        return "highRisk";
    }
}