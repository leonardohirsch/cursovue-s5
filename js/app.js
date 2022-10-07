"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//clases
class Joke {
    constructor(api, id, joke) {
        this.rateJoke = (score) => {
            this.score = score;
            this.date = new Date().toISOString();
        };
        this.api = api; //de cuál api proviene
        this.id = id;
        this.joke = joke;
        this.score = 0; //En realidad quería dejar solamente <<this.score;>> pero TS me marca como error. Puse Cero para que no me marque error, aunque me gustaría haber dejado la variable sin valor por default, pero no sé si es posible.
        this.date = "";
    }
}
//DOM elements
const weatherBox = document.querySelector(".weather_box");
const weatherIconBox = document.querySelector(".weather_icon_box");
const weatherTempBox = document.querySelector(".weather_temp_box");
const container = document.querySelector(".container");
const jokeTxt = document.querySelector(".joke_txt");
const nextJoke = document.querySelector(".joke_btn");
const jokeValue = document.querySelector(".joke_value");
const jokeValueBtns = document.querySelectorAll(".joke_value_btn");
//Otras Variables y Arrays
const apis = [
    { name: "icanhazdadjoke", url: new URL("https://icanhazdadjoke.com/"), headers: { Accept: "application/json;" }, },
    { name: "chucknorris", url: new URL("https://api.chucknorris.io/jokes/random"), headers: { "Accept": "application/json;" }, }
];
let apiNum = 0;
let theJoke;
const reportAcudits = [];
const blobFiles = ["./imgs/blob-0.svg", "./imgs/blob-1.svg", "./imgs/blob-2.svg", "./imgs/blob-3.svg"];
let blobFile = 0;
//Funciones
const ratingJoke = (btn) => {
    let qualification = 0;
    switch (btn) {
        case "badjoke":
            qualification = 1;
            break;
        case "neutraljoke":
            qualification = 2;
            break;
        case "greatjoke":
            qualification = 3;
            break;
    }
    theJoke.rateJoke(qualification); //TypeScript me obliga a definir la variable antes para que no de error, por eso antes definí let qualification=0. Aunque no sé si es correcto hacerlo así
    //console.log(theJoke);
    reportAcudits.push(theJoke);
    console.log(reportAcudits);
    jokeValue.style.display = "none";
};
const getJoke = (apiName, apiUrl, apiHeaders) => {
    fetch(apiUrl, {
        headers: apiHeaders
    })
        .then(response => response.json())
        .then(json => {
        let jsonJokeTxt;
        switch (apiName) {
            case "icanhazdadjoke":
                jsonJokeTxt = json.joke;
                break;
            case "chucknorris":
                jsonJokeTxt = json.value;
                break;
        }
        theJoke = new Joke(apiName, json.id, jsonJokeTxt);
        jokeTxt.textContent = '"' + jsonJokeTxt + '"';
        jokeTxt.style.display = "block";
        jokeValue.style.display = "flex";
        blobFile++;
        if (blobFile == blobFiles.length)
            blobFile = 0;
        container.style.backgroundImage = "url(" + blobFiles[blobFile] + ")";
    })
        .catch((error) => console.log('Ocurrió un error: ', error));
    apiNum = apiNum == 0 ? 1 : 0;
};
const getWeather = () => {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=41.38&lon=2.15&lang=es&appid=af2fcd143cdb75825b65836040d30964")
        .then(response => response.json())
        .then(json => {
        let weatherTemp = (parseFloat(json.main.temp) - 273.15).toFixed(1);
        let weatherIcon = "https://openweathermap.org/img/wn/" + json.weather[0].icon + ".png";
        weatherBox.style.display = "flex";
        weatherIconBox.innerHTML = "<img src='" + weatherIcon + "'>";
        weatherTempBox.innerHTML = weatherTemp + " Cº";
    })
        .catch((error) => console.log('Ocurrió un error: ', error));
};
//window.addEventListener("load", () => {
//    getJoke(apis[apiNum].name, apis[apiNum].url, apis[apiNum].headers);
//});
window.addEventListener("load", getWeather);
nextJoke.addEventListener("click", () => {
    getJoke(apis[apiNum].name, apis[apiNum].url, apis[apiNum].headers);
});
for (const jokeValBtn of jokeValueBtns) {
    jokeValBtn.addEventListener("click", () => {
        ratingJoke(jokeValBtn.id);
    });
}
