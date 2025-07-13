document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".city-input");
  const searchBtn = document.querySelector(".search-btn");
  const searchCitySection = document.getElementById("second");
  const weatherInfoSection = document.getElementById("first");
  const notFoundSection = document.getElementById("third");
  const country = document.querySelector(".country-txt");
  const datetxt = document.querySelector(".current-date-txt");
  const temp = document.querySelector(".temp-txt");
  const condn = document.querySelector(".condition-txt");
  const humidity = document.querySelector(".humidity-value-txt");
  const air = document.querySelector(".wind-value-txt");
  const weatherPic = document.querySelector(".weather-summary-img");
  const bgchange = document.querySelector(".bg");
  const forecastItemsContainer = document.querySelector(
    ".forecast-items-container"
  );
  const apiKey = "b735a97fb4bd24ba59cfd0ed3925c178";
  searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    cityInput.value = "";
    if (city === "") {
      notFoundSection.classList.remove("hidden");
      weatherInfoSection.classList.add("hidden");
    } else {
      try {
        const weatherData = await getFetchData(city);
        //console.log(weatherData)
        updateWeatherInfo(weatherData);
      } catch (error) {
        searchCitySection.classList.add("hidden");
        notFoundSection.classList.remove("hidden");
        weatherInfoSection.classList.add("hidden");
      }
    }
  });

  cityInput.addEventListener("keydown", async (event) => {
    if (event.key == "Enter") {
      const city = cityInput.value.trim();
      cityInput.value = "";
      if (city === "") {
        searchCitySection.classList.add("hidden");
        notFoundSection.classList.remove("hidden");
        weatherInfoSection.classList.add("hidden");
      } else {
        try {
          const weatherData = await getFetchData(city);
          //console.log(weatherData)
          updateWeatherInfo(weatherData);
        } catch (error) {
          searchCitySection.classList.add("hidden");
          notFoundSection.classList.remove("hidden");
          weatherInfoSection.classList.add("hidden");
        }
      }
    }
  });
  function updateWeatherInfo(data) {
    searchCitySection.classList.add("hidden");
    notFoundSection.classList.add("hidden");
    weatherInfoSection.classList.remove("hidden");
    const { list, city } = data;
    country.textContent = city.name;
    datetxt.textContent = getCurrentTime();
    temp.textContent = `${Math.round(list[0].main.temp)} °C`;
    condn.textContent = list[0].weather[0].description.toUpperCase();
    humidity.textContent = `${list[0].main.humidity}%`;
    air.textContent = `${list[0].wind.speed} M/s`;
    const ID = list[0].weather[0].id;
    weatherPic.src = `${getWeatherId(ID)}`;
    bgchange.style.backgroundImage = `${getbackground(ID)}`;
    forecastItemsContainer.innerHTML = ``;
    let idx = 0;
    for (let i = 1; i < 40; i++) {
      const str = list[i].dt_txt.substring(11, 20);
      if (str === "00:00:00") {
        idx = i;
        break;
      }
    }
    for (let i = idx; i <= idx + 3 * 8; i += 8) {
      //console.log(list[i].dt_txt);
      const str = list[i].dt_txt.substring(0, 10);
      const date = new Date(str);
      const options = { day: "2-digit", month: "short" };
      const formattedDate = date.toLocaleDateString("en-GB", options);
      //console.log(formattedDate);
      let temperature = list[i].main.temp;
      let info = list[i].weather[0].id;
      const forecastItem = `
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
                <img src="${getWeatherId(
                  info
                )}" alt="" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(
                  temperature
                )} °C</h5>
            </div>`;
      forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
      //console.log(list[i].date_txt)
    }
  }
  function getbackground(id) {
    if (id <= 232) return "url(thunder.jpeg)";
    if (id <= 321) return "url(drizzle.jpg)";
    if (id <= 531) return "url(rain.jpg)";
    if (id <= 622) return "url(snow.jpg)";
    if (id <= 781) return "url(atomos.jpg)";
    if (id <= 800) return "url(clea.jpeg)";
    if (id <= 804) return "url(cloud.jpg)";
  }
  function getWeatherId(id) {
    if (id <= 232) return "thunderstorm.svg";
    if (id <= 321) return "drizzle.svg";
    if (id <= 531) return "rain.svg";
    if (id <= 622) return "snow.svg";
    if (id <= 781) return "atmosphere.svg";
    if (id <= 800) return "clear.svg";
    if (id <= 804) return "clouds.svg";
  }
  async function getFetchData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      notFoundSection.classList.remove("hidden");
      weatherInfoSection.classList.add("hidden");
    } else {
      const data = await response.json();
      return data;
    }
  }

  function getCurrentTime() {
    const date = new Date();
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
    };
    return date.toLocaleDateString("en-GB", options);
  }
});
