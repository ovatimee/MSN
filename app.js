const dom = {
  country: document.getElementById("country"),
  icon: document.querySelector("#icon"),
  temperature: document.querySelector("#degree"),
  describtion: document.querySelector("#description"),
  humidity: document.querySelector(".humidity_deg"),
  wind: document.querySelector(".wind_deg"),
  pressure: document.querySelector(".pressure_deg"),
  forecasts: document.getElementById("forecasts"),
};

// Dark Mode
const content = document.getElementsByTagName('body')[0];
        const darkMode = document.getElementById('dark-change');
        darkMode.addEventListener('click', function(){
            darkMode.classList.toggle('active');
            content.classList.toggle('night');
        })

const getIp = async () => {
  const apiKey = "8895711f8bdd40debb989a97caf85f89";

  const res = await fetch(
    `https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`
  );
  const ipData = await res.json();
  const location = `${ipData.city.name}, ${ipData.country.name}`;
  const lat = ipData.location.latitude;
  const lon = ipData.location.longitude;
  await fetchData(location, lat, lon);
};

/* 
  -Show Input Menu
*/

const locationMenu = () => {
  const editBtn = document.getElementById("svg");
  editBtn.addEventListener("click", () => {
    const inputMenu = document.getElementById("location-input");
    inputMenu.style.display = "block";
  });
};
/* 
	The addressAutocomplete takes as parameters:
  - a container element (div)
  - callback to notify about address selection
  - geocoder options:
  	 - placeholder - placeholder text for an input element
*/
const addressAutocomplete = (containerElement, callback, options) => {
  // create input element
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  // add input field clear button
  const clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = "";
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  containerElement.appendChild(clearButton);

  /* Current autocomplete items data (GeoJSON.Feature) */
  let currentItems;

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  let currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  let focusedItemIndex;

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function (e) {
    const currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true,
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
      return false;
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    /* Create a new promise and send geocoding request */
    const promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      const apiKey = "8895711f8bdd40debb989a97caf85f89";
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        currentValue
      )}&limit=5&apiKey=${apiKey}`;

      if (options.type) {
        url += `&type=${options.type}`;
      }

      fetch(url).then((response) => {
        // check if the call was successful
        if (response.ok) {
          response.json().then((data) => resolve(data));
        } else {
          response.json().then((data) => reject(data));
        }
      });
    });

    promise.then(
      (data) => {
        currentItems = data.features;

        /*create a DIV element that will contain the items (values):*/
        const autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        containerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.features.forEach((feature, index) => {
          /* Create a DIV element for each element: */
          const itemElement = document.createElement("DIV");
          /* Set formatted address as item value */
          itemElement.innerHTML = feature.properties.formatted;

          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function (e) {
            inputElement.value = currentItems[index].properties.formatted;

            callback(currentItems[index]);

            /* Close the list of autocompleted values: */
            closeDropDownList();
          });

          autocompleteItemsElement.appendChild(itemElement);
        });
      },
      (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      }
    );
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function (e) {
    const autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      const itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.key == "ArrowDown") {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== itemElements.length - 1
            ? focusedItemIndex + 1
            : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.key == "ArrowUp") {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== 0
            ? focusedItemIndex - 1
            : (focusedItemIndex = itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.key == "Enter") {
        /* If the ENTER key is pressed and value as selected, close the list and Updata Weather*/

        e.preventDefault();
        callback(currentItems[focusedItemIndex]);
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.key == "ArrowDown") {
        /* Open dropdown list again */
        const event = document.createEvent("Event");
        event.initEvent("input", true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].properties.formatted;
  }

  function closeDropDownList() {
    const autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      containerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("height", "24");

    const iconElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    iconElement.setAttribute(
      "d",
      "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    );
    iconElement.setAttribute("fill", "currentColor");
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }

  /* Close the autocomplete dropdown when the document is clicked. 
  	Skip, when a user clicks on the input field */
  document.addEventListener("click", function (e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent("Event");
      event.initEvent("input", true, true);
      inputElement.dispatchEvent(event);
    }
  });
};

addressAutocomplete(
  document.getElementById("autocomplete-container"),
  (data) => {
    console.log("Selected city: ");
    const location = `${data.properties.city}, ${data.properties.country}`;
    const lat = `${data.properties.lat}`;
    const lon = `${data.properties.lon}`;
    fetchData(location, lat, lon);
  },
  {
    placeholder: "Enter a city name here",
  }
);

const fetchData = async (city, lon, lat) => {
  const apiKey = "36da0d00f84b61dd59358f82c0f640fe";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely&appid=${apiKey}`
  );
  const data = await response.json();
  const weather = {
    location: `${city}`,
    icon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
    temperature: data.current.temp,
    describtion: data.current.weather[0].description,
    feelslike: data.current.feels_like,
    humidity: data.current.humidity,
    pressure: data.current.pressure,
    wind: data.current.wind_speed,
    forecasts: data.daily,
  };
  updateWeather(weather);
};
// Update Weather To User
const updateWeather = (data) => {
  dom.country.innerHTML = `${data.location}`;
  dom.icon.src = data.icon;
  dom.temperature.innerHTML = `${data.temperature}°`;
  dom.describtion.innerHTML = data.describtion;
  dom.humidity.innerHTML = data.humidity;
  dom.wind.innerHTML = data.wind;
  dom.pressure.innerHTML = data.pressure;

  const fragment = document.createDocumentFragment();

  data.forecasts.map((daily) => {
    const forecastItem = document.createElement("div");
    const pong = document.createElement("div");
    pong.className = "pong";
    forecastItem.className = "forcastItem";
    const day = document.createElement("h2");
    day.innerHTML = new Date(daily.dt * 1000).toString().slice(0, 3);
    forecastItem.appendChild(day);
    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`;
    pong.appendChild(icon);
    const wind = document.createElement("p");
    wind.innerHTML = "25°";
    const humidity = document.createElement("p");
    humidity.innerHTML = "76°";
    const dong = document.createElement("div");
    dong.appendChild(wind);
    dong.appendChild(humidity);
    pong.appendChild(dong);
    forecastItem.appendChild(pong);

    fragment.appendChild(forecastItem);
  });
  dom.forecasts.appendChild(fragment);
};



// Forcast Slider

// Weather News
const newsData = async () => {

  const response = await fetch('https://free-news.p.rapidapi.com/v1/search?q=Weather', {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'b7b485002cmsha3b3d753d222112p1240f0jsn1aeaa47692d4',
    'X-RapidAPI-Host': 'free-news.p.rapidapi.com'
  },
});

const data = await response.json() 


  data.articles.map(element =>{

 const elementGrid = document.querySelector(".grid-box")
  const newsImage = document.createElement("img")
    newsImage.src = element.media
  const gridItem = document.createElement("div")
    const link = document.createElement("a")
    link.href = element.url
    gridItem.className = "grid-item"
    gridItem.style.backgroundImage = `url("${element.media}")` 
    const titleDiv = document.createElement("div")
    titleDiv.className = "title"
    const newsTitle = document.createElement("h3")
    newsTitle.innerHTML = element.title
    const imageBox = document.createElement("div")
    titleDiv.appendChild(newsTitle)
    imageBox.appendChild(newsImage)
    gridItem.appendChild(imageBox)
    gridItem.appendChild(titleDiv)
    link.appendChild(gridItem)
    elementGrid.appendChild(link)
  })
};

newsData();

window.addEventListener("DOMContentLoaded", getIp);

