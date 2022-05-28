const search = document.querySelector(".search-btn");

const weather = {
  apiKey: "359221094c7ecb023336502d09da89a7",

  fetchData: (city) => {
    fetch(
      "http://api.weatherstack.com/current?access_key=" +
        apiKey +
        "&query=" +
        city
    )
      .then((response) => response.json())
      .then((data) => this.displayData(data));
  },

  displayData: (data) => {
    document.querySelector("#country").innerHTML = data.location.name;
  },
};
search.addEventListener("click", displayData("Dubai"));
