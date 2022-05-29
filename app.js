  const search = document.querySelector(".search-btn");
  const apiKey = "359221094c7ecb023336502d09da89a7"
  const input = document.querySelector(".search__input")
  const city = "Dubai"

const updateWeather = async ()=>{

  const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`)
  const data = await response.json()

  const input = {
    country: data.request.query,
    icon: "",
    deg: "",
    describtion: data.current.weather_description[0],
    feelsLike: data.curent.feelslike,
    localTime: data.current.observation_time,
    date: data.location.localTime,
    humidity: data.current.humidity,
    wind: data.current.wind,
    pressure: data.current.pressure
  }

  const output = {
    country: document.getElementById("country"),
    icon: document.querySelector("#icon"),
    deg: document.querySelector("#degree"),
    describtion: document.querySelector("#description") ,
    feelsLike: "",
    localTime: document.querySelector,
    date: '',
    humidity: document.querySelector(".humidity_deg"),
    wind: document.querySelector(".wind_deg").innerHTML,
    pressure: document.querySelector(".pressure_deg").innerHTML = input.pressure
  }
  output.country.innerHTML = input.country
  console.log(data.location.name)
}

search.addEventListener("click", updateWeather)
