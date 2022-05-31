const dom = {
  country: document.getElementById("country"),
  icon: document.querySelector("#icon"),
  temperature: document.querySelector("#degree"),
  describtion: document.querySelector("#description"),
  humidity: document.querySelector(".humidity_deg"),
  wind: document.querySelector(".wind_deg"),
  pressure: document.querySelector(".pressure_deg"),
};

const getIp = async () => {
  const apiKey = "8895711f8bdd40debb989a97caf85f89";

  const res = await fetch(
    `https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`
  );
  const ipData = await res.json();
  const location = `${ipData.city.name}`;
  const lat = ipData.location.latitude;
  const lon = ipData.location.longitude;
  fetchData(location, lat, lon);
  console.log(lon, lat);
};

const addressAutocomplete = async (container) => {
  //Create Input Element and Set Attributes

  let inputBox = document.createElement("input");
  inputBox.setAttribute("type", "text");
  inputBox.setAttribute("placeholder", "Type your location");
  container.appendChild(inputBox);
  inputBox.classList.add("input_field");

    let rejectCurrentPromise;


  inputBox.addEventListener("input", async (e) => {
    const userInput = this.value;
    // Cancel Previous Request Promise

    if (rejectCurrentPromise) {
      rejectCurrentPromise({
        canceled: true,
      });
    }
    if (!userInput) {
      return false;
    }

    // Fetch New Promise and Geo Location on input
    const apiKey = "8895711f8bdd40debb989a97caf85f89";
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        userInput
      )}&limit=5&apiKey=${apiKey}`
    );
    const locData = await response.json();
    //fetchData(userInput);
  });
};

addressAutocomplete(document.getElementById("autocomplete_container"));

const fetchData = async (city, lon, lat) => {
  const apiKey = "36da0d00f84b61dd59358f82c0f640fe";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
  const data = await response.json();
  const weather = {
    location: `${data.name}, ${data.sys.country}`,
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    temperature: data.main.temp,
    describtion: data.weather[0].description,
    feelslike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: data.wind.speed,
  };
  updateWeather(weather);
};

const updateWeather = (info) => {
  dom.country.innerHTML = `${info.location}`;
  dom.icon.src = info.icon;
  dom.temperature.innerHTML = `${info.temperature}°`;
  dom.describtion.innerHTML = info.describtion;
  dom.humidity.innerHTML = info.humidity;
  dom.wind.innerHTML = info.wind;
  dom.pressure.innerHTML = info.pressure;
};

window.addEventListener("DOMContentLoaded", getIp);
