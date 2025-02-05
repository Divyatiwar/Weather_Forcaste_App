//created weather forcaste app

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; //styling file
import clearSkyImage from "../img/clear sky.jpg";
import cloudyImage from "../img/fog.jpg";
import rainyImage from "../img/rain.jpg";
import defaultImage from "../img/clear sky.jpg";

//created a function to call api

const Weather = () => {
  const [weather, setWeather] = useState(null); //to update weather state
  const [forecast, setForecast] = useState([]); // set forcaste to show
  const [city, setCity] = useState("Delhi"); //set default weather data
  const [dateTime, setDateTime] = useState(new Date()); //to update datetime
  const [searchTerm, setSearchTerm] = useState(""); //set to search
  const [errorMessage, setErrorMessage] = useState(null); //shows error msg if any
  const [backgroundImage, setBackgroundImage] = useState(clearSkyImage); //set bg image to display accordingly

  const API_KEY = "f4b094f39e90ddd02beac79e26fb45c9"; //personal api key to fetch data

  // Fetch Current Weather
  const fetchWeatherData = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json(); //set http response in js & store data

      if (response.ok) {
        setWeather(data);
        setErrorMessage(null); // remove previous errors
        updateBackgroundImage(data.weather[0].main); //update background image
      } else {
        setWeather(null);
        setForecast([]);
        setErrorMessage("Please enter a valid city or country name.");
        setBackgroundImage(defaultImage);
        alert("Invalid city or country name. Please try again.");
        // Reset to default page after alert
        setCity("Delhi"); // You can reset to any default city or state
        setBackgroundImage(defaultImage); //default background image
        setWeather(null);
        setForecast([]); //set forcaste
      }
    } catch (error) {
      setWeather(null);
      setForecast([]);
      setErrorMessage("Network error. Please try again.");
      setBackgroundImage(defaultImage);
      alert("Network error. Please try again.");
      // Reset to default page after alert
      setCity("Delhi"); //reset to default city
      setBackgroundImage(defaultImage); //reset to default background image
      setWeather(null);
      setForecast([]); //default forcaste
      console.error("Network error:", error); //shows error
    }
  };
  //function to show images based to condition of weathers
  const updateBackgroundImage = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case "clear":
        setBackgroundImage(clearSkyImage);
        break;
      case "clouds":
        setBackgroundImage(cloudyImage);
        break;
      case "rain":
      case "drizzle":
        setBackgroundImage(rainyImage);
        break;
      default:
        setBackgroundImage(defaultImage);
        break;
    }
  };
  //function state with the value enteres in search bar
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // fucntion to make search bar submit
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      setCity(searchTerm);
      setSearchTerm("");
    }
  };

  const handleSearchButtonClick = () => {
    if (searchTerm.trim() !== "") {
      setCity(searchTerm);
      setSearchTerm("");
    }
  };
  //useeffect
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      )
      .then((response) => {
        const filteredData = response.data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(filteredData);
      })
      .catch((error) => console.error("Error fetching forecast data:", error));
  }, [city]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="weather-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="weather-info">
        <div className="search-container">
          {/*search bar container */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
          {/*input button to take inputs from search bar */}
          <button className="search-button" onClick={handleSearchButtonClick}>
            <img
              src="https://img.icons8.com/ios-filled/50/ffffff/search.png"
              alt="search icon"
            />
          </button>
        </div>

        {/* Show error message when there's an invalid name */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {weather && (
          <div className="weather-detail">
            <h3>Weather Detail</h3>
            <ul>
              <div className="cont">
                <li className="one">Max Temperature </li>
                <li className="two">
                  {weather.main.temp_max}°C
                  <img
                    src="https://img.icons8.com/?size=100&id=9021&format=png&color=FFFFFF"
                    alt="drop"
                  />
                </li>
              </div>
              <div className="cont">
                <li className="one">Min Temperature </li>
                <li className="two">
                  {weather.main.temp_min}°C{" "}
                  <img
                    src="https://img.icons8.com/?size=100&id=26ojf2AsdaXp&format=png&color=FFFFFF"
                    alt="thermo"
                  />
                </li>
              </div>
              <div className="cont">
                <li className="one">Humidity </li>
                <li className="two">
                  {weather.main.humidity}%{" "}
                  <img
                    src="https://img.icons8.com/?size=100&id=18504&format=png&color=FFFFFF"
                    alt="humidity"
                  />
                </li>
              </div>
              <div className="cont">
                <li className="one">Wind </li>
                <li className="two">
                  {weather.wind.speed} km/h{" "}
                  <img
                    src="https://img.icons8.com/?size=100&id=EWjiSSGn5H9O&format=png&color=FFFFFF"
                    alt="wind"
                  />
                </li>
              </div>
            </ul>
          </div>
        )}

        <hr className="line" />

        <div className="weather-forecast">
          <h3>Weather Forecast</h3>
          <ul>
            {forecast.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                      style={{ marginRight: "10px" }}
                    />
                    {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}{" "}
                    at{" "}
                    {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <span
                    style={{
                      marginTop: "5px",
                      color: "#f0f0f0",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.weather[0].description}
                  </span>
                </div>
                <span
                  style={{
                    marginLeft: "20px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.main.temp}°C
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/*footer part to show city  */}
      <footer className="main-info">
        <h1 className="temperature">
          {weather ? `${weather.main.temp}°C` : "Loading..."}
        </h1>
        <div className="loc">
          <h2 className="location">{city}</h2>
          <div className="dc">
            <p className="date-time">
              {dateTime.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}{" "}
              -
              {dateTime
                .toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })
                .replace(",", "")}
            </p>

            <p className="condition">
              {weather ? weather.weather[0].description : "..."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Weather;
