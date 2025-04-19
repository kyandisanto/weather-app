import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiBarometer } from 'react-icons/wi';
import { FaSearch } from 'react-icons/fa';
import { WEATHER_API_KEY, WEATHER_API_URL } from './config';
import './App.css';

// Import weather background images
const sunnyBg = "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920&q=80";
const rainyBg = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&q=80";
const snowyBg = "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80";
const cloudyBg = "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80";

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const getWeatherBackground = (weatherId) => {
    console.log('Weather ID:', weatherId);
    let selectedBackground = null;

    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) selectedBackground = rainyBg; // thunderstorm
    if (weatherId >= 300 && weatherId < 400) selectedBackground = rainyBg; // drizzle
    if (weatherId >= 500 && weatherId < 600) selectedBackground = rainyBg; // rain
    if (weatherId >= 600 && weatherId < 700) selectedBackground = snowyBg; // snow
    if (weatherId >= 700 && weatherId < 800) selectedBackground = cloudyBg; // fog
    if (weatherId === 800) selectedBackground = sunnyBg; // clear
    if (weatherId > 800) selectedBackground = cloudyBg; // cloudy

    console.log('Selected background:', selectedBackground);
    return selectedBackground;
  };

  const searchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${WEATHER_API_URL}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      setWeather(data);
      const bgImage = getWeatherBackground(data.weather[0].id);
      console.log('Weather data:', data);
      console.log('Weather ID:', data.weather[0].id);
      console.log('Setting background image:', bgImage);
      setBackgroundImage(bgImage);
      setError(null);
    } catch (err) {
      setWeather(null);
      setBackgroundImage(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div 
      className="App" 
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #1e4d62, #006989, #2b7c9e, #2596be)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        transition: 'all 0.5s ease-in-out'
      }}
    >
      <div className="background-overlay">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1>Weather Forecast</h1>
            <p>Your Real-Time Weather Companion</p>
          </div>
        </header>

        <motion.div 
          className="weather-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Weather App
          </motion.h1>
          
          <motion.form 
            onSubmit={searchWeather}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="search-form"
          >
            <div className="search-input-container">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                required
              />
              <FaSearch className="search-icon" />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !city.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Searching...' : 'Search'}
            </motion.button>
          </motion.form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {weather && !error && (
              <motion.div
                className="weather-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {weather.name}, {weather.sys.country}
                </motion.h2>

                <motion.div 
                  className="weather-main"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <img 
                    src={getWeatherIcon(weather.weather[0].icon)} 
                    alt={weather.weather[0].description}
                    className="weather-icon"
                  />
                  <div className="temperature-container">
                    <h3>{Math.round(weather.main.temp)}°C</h3>
                    <p className="weather-description">{weather.weather[0].description}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="weather-details-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="weather-detail-item">
                    <WiHumidity className="detail-icon" />
                    <div>
                      <p className="detail-label">Humidity</p>
                      <p className="detail-value">{weather.main.humidity}%</p>
                    </div>
                  </div>

                  <div className="weather-detail-item">
                    <WiStrongWind className="detail-icon" />
                    <div>
                      <p className="detail-label">Wind Speed</p>
                      <p className="detail-value">{weather.wind.speed} m/s</p>
                    </div>
                  </div>

                  <div className="weather-detail-item">
                    <WiBarometer className="detail-icon" />
                    <div>
                      <p className="detail-label">Pressure</p>
                      <p className="detail-value">{weather.main.pressure} hPa</p>
                    </div>
                  </div>

                  <div className="weather-detail-item">
                    <WiSunrise className="detail-icon" />
                    <div>
                      <p className="detail-label">Sunrise</p>
                      <p className="detail-value">{formatTime(weather.sys.sunrise)}</p>
                    </div>
                  </div>

                  <div className="weather-detail-item">
                    <WiSunset className="detail-icon" />
                    <div>
                      <p className="detail-label">Sunset</p>
                      <p className="detail-value">{formatTime(weather.sys.sunset)}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>© 2024 Weather App by Kyan M. All rights reserved.</p>
            <p>Powered by OpenWeather API</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
