import weatherCodesData from "./weather-codes.js";

const searchCity = document.getElementById("search-city");
const button = document.getElementById("btn");
const cityName = document.getElementById("city-name");
const display = document.getElementById("display-temperature");
const weatherImage = document.getElementById("weather-image");
const weatherDescription = document.getElementById("weather-description");
const advice = document.getElementById("user-advice");
const now = document.getElementById("now");

now.innerText = `${new Date().getDate()}.${
  new Date().getMonth() + 1
}.${new Date().getFullYear()}`;

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP err! Status : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
}

async function getGeolocation(city = "Bern") {
  const dt = await fetchData(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
  );

  const locations = {
    latitude: dt.results[0]["latitude"],
    longitude: dt.results[0]["longitude"],
    city: dt.results[0]["name"],
  };

  return locations;
}

function getAllData(city) {
  let weather_code = 0;
  let temperature = 0;
  const locations = getGeolocation(city);
  locations.then((data) => {
    cityName.innerText = data.city;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current=temperature_2m%2Crelative_humidity_2m%2Crain%2Cweather_code`;

    const weatherAPIData = fetchData(url);
    weatherAPIData.then((data) => {
      temperature = data.current.temperature_2m;
      weather_code = data.current.weather_code;
      const weatherCodes = weatherCodesData;

      let desc = weatherCodesData[weather_code].day.description;
      let img = weatherCodesData[weather_code].day.image;

      display.innerHTML = `${temperature} ºC`;
      weatherImage.innerHTML = `<img src="${img}" >`;
      weatherDescription.innerHTML = ` ${desc} `;

      switch (desc) {
        case "Cloudy":
          advice.textContent = "Gloomy day, ideal for indoor plans.";
          break;

        case "Partly Cloudy":
          advice.textContent = "Some sun, bring a light jacket.";
          break;

        case "Rain":
          advice.textContent = "Carry umbrella, wear waterproof shoes.";
          break;

        case "Light Rain":
          advice.textContent = "Light rain, keep raincoat handy.";
          break;

        case "Heavy Rain":
          advice.textContent = "Heavy rain, stay indoors, be cautious.";
          break;

        case "Sunny":
          advice.textContent = "Bright sun, wear sunglasses, hydrate.";
          document.body.style.backgroundImage =
            "url('https://www.bpmcdn.com/f/files/similkameen/import/2019-04/16560263_web1_180604_KCN_weather-update.jpg;w=900')";
          break;

        case "Partly Sunny":
          advice.textContent = "Sun and clouds, apply sunscreen.";
          document.body.style.backgroundImage =
            "url('https://www.bpmcdn.com/f/files/similkameen/import/2019-04/16560263_web1_180604_KCN_weather-update.jpg;w=900')";
          break;

        case "Mainly Sunny":
          advice.textContent = "Mostly sunny, enjoy outdoor activities.";
          document.body.style.backgroundImage =
            "url('https://www.bpmcdn.com/f/files/similkameen/import/2019-04/16560263_web1_180604_KCN_weather-update.jpg;w=900')";
          break;

        case "Clear":
          advice.textContent = "Clear skies, perfect for stargazing.";
          break;

        case "Mainly Clear":
          advice.textContent = "Calm and clear, enjoy fresh air.";
          break;

        case "Foggy":
          advice.textContent = "Low visibility, drive carefully.";
          break;

        case "Rime Fog":
          advice.textContent = "Frosty fog, dress warmly, move cautiously.";
          break;

        case "Drizzle":
          advice.textContent = "Light drizzle, wear waterproof footwear.";
          break;

        case "Light Drizzle":
          advice.textContent = "Slight drizzle, take small umbrella.";

          break;

        case "Light Freezing Drizzle":
          advice.textContent = "Freezing drizzle, watch for ice.";
          break;

        case "Snow":
          advice.textContent = "Snowfall, bundle up, beware slippery.";
          break;

        case "Showers":
          advice.textContent = "Rain showers, keep umbrella available.";
          break;

        case "Thunderstorm":
          advice.textContent = "Thunderstorms, stay indoors, avoid open.";
          break;

        default:
          advice.textContent = "No specific advice for today.";
          break;
      }
    });
  });
}

searchCity.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    getAllData(searchCity.value);
  }
});

getAllData("Bern");
