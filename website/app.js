/* Global Variables */
//Needed for the fetch data and urls
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '&appid=c9a9ab3a10bdd9e5940cee3846c8ffe3&units=imperial'; //i prefer process.env.API_KEY for security
const zip = document.querySelector('#zip');
const userResponse = document.querySelector('#feelings');
const generateBtn = document.querySelector('#generate');

//Needed for updating the UI
const temp = document.querySelector('#temp');
const date = document.querySelector('#date');
const content = document.querySelector('#content');
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

generateBtn.addEventListener('click', function () {
  if(zip.value && userResponse.value)
    generateEntry(zip.value, userResponse.value);
  console.log('clicked');
});

//====================Main Function===================================
function generateEntry(zip, userResponse) {
  zip = 'zip=' + zip;
  //First: get the weather temperature from OpenWeatherAPI
  getWeather(baseURL + zip + apiKey)
    .then((temp) => {
      //after grabbing temperature you know have (temp, date, userResponse)!
      //Second: addData() to the server endpoint
      //make the data object needed for addData()
      const dataObj = {
        temp: temp,
        date: newDate,
        userResponse: userResponse,
      };
      return addData(dataObj);
    })
    .then((data) => getData())
    .then((data) => updateUi(data));
}
//==================================================
// helper functions
//====================OpenWeather API==============================

//gets weather info needed for (temperature)
// url = baseURL + zip + apiKey
async function getWeather(url) {
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data.main.temp;
  } catch (error) {
    console.log('error', error);
  }
}
//=========================================================
//====================Get and Post functions==============================
async function getData() {
  const response = await fetch('/getData');
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('error in getData', error);
  }
}

async function addData(dataObj) {
  const options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataObj),
  };
    //The server returns a success message
  const response = await fetch('/addData', options);

  try {
    const message = await response.json();
    console.log(message.message);
  } catch (error) {
    console.log('error in addData', error);
  }
}
//====================Update Ui================================
function updateUi(generatedData) {
  date.innerHTML = 'Date: ' + generatedData.date;
  //if temp is undefiend then the zip code entered is wrong
  temp.innerHTML = generatedData.temp ? 'Temperature: ' + generatedData.temp + ' Fahrenheit' : 'Please provide a valid Zip';
  content.innerHTML = 'Feelings: ' + generatedData.userResponse;
}
//====================================================
