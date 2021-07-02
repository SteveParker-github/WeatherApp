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
    let minMaxTemps = findTempRange(mainData.temp);

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
                        let distance = (countDistance(mainData.dates, text) * 121);
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

    }

    let figure = document.createElement('figure');
    figure.setAttribute('class', 'css-chart');
    figure.setAttribute('style', "--widget-size: 200");

    let ul = document.createElement('ul');
    ul.setAttribute('class', 'line-chart');
    figure.appendChild(ul);

    for (let i = 0; i < mainData.temp.length; i++) {
        let li = document.createElement('li');
        let divLine = document.createElement('div');

        let height = ((mainData.temp[i] - minMaxTemps[0]) / (minMaxTemps[1] - minMaxTemps[0]) * 39);
        let length = (i * 123 + 57);

        let hypotenuse = 0;
        let angle = 0;

        if (i < mainData.temp.length - 1) {
            let otherHeight = ((mainData.temp[i + 1] - minMaxTemps[0]) / (minMaxTemps[1] - minMaxTemps[0]) * 39);
            let totalHeight = height - otherHeight;
            hypotenuse = Math.hypot(totalHeight, 123);

            angle = Math.asin(totalHeight/hypotenuse);
            angle = angle * (180 / Math.PI);
        }

        li.setAttribute('style', '--x:' + length + 'px; --y:' + (height - 20) + 'px');

        divLine.setAttribute('class', 'line-segment');
        divLine.setAttribute('style', '--hypotenuse: ' + hypotenuse + '; --angle:' + angle);

        li.appendChild(divLine);
        ul.appendChild(li);
    }

    for (let i = 0; i < trs.length; i++) {
        if (i == 4) {
            table.appendChild(figure);
        }
        table.appendChild(trs[i]);
    }
}

//Find the highest and lowest temps
function findTempRange(temps) {
    let results = [];

    let lowest = parseInt(temps[0]);
    let highest = parseInt(temps[0]);

    temps.forEach(element => {
        if (parseInt(element) < lowest) {
            console.log(element);
            lowest = element;
        }

        if (parseInt(element) > highest) {
            highest = element;
        }
    });

    results.push(lowest - 1, parseInt(highest) + 1);

    console.log(results);

    return results;
}

//Counts how many to span across
function countDistance(checkArray, check) {
    let startingPoint = 0;
    let totalGap = 0;

    for (let i = 0; i < checkArray.length; i++) {
        if (checkArray[i] == check) {
            startingPoint = i + 1;
        }
    }

    for (let i = startingPoint; i < checkArray.length; i++) {
        if (checkArray[i] != "") {
            totalGap = i - startingPoint;
            break;
        }
    }

    let result = checkArray.length - (totalGap + startingPoint);
    if ((startingPoint != 0) && (totalGap == 0)) {
        result = 0;
    }

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