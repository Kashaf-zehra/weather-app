import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// import '../App.css'; // Assuming you have a CSS file for styling

const WeatherUpdate = () => {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [tomorrowWeather, setTomorrowWeather] = useState(null);

  const toDateFunction = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const WeekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      await axios
        .get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        })
        .then((res) => {
          console.log('res', res);
          setWeather({ data: res.data, loading: false, error: false });
          fetchTomorrowForecast(res.data.coord.lat, res.data.coord.lon);
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput('');
          console.log('error', error);
        });
    }
  };
  console.log('weather', weather);
  const fetchTomorrowForecast = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall`;
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
    const exclude = 'current,minutely,hourly';
    await axios
      .get(url, {
        params: {
          lat: lat,
          lon: lon,
          exclude: exclude,
          units: 'metric',
          appid: api_key,
        },
      })
      .then((res) => {
        console.log('tomorrow forecast res', res);
        if (res.data && res.data.daily && res.data.daily.length >= 2) {
          // Assuming res.data.daily[1] gives the forecast for tomorrow
          setTomorrowWeather(res.data.daily[1]);
        }
      })
      .catch((error) => {
        console.log('tomorrow forecast error', error);
        setTomorrowWeather(null);
      });
  };

  return (
    <Box
      className='App'
      component={Paper}
      elevation={3}
      p={4}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      sx={{
        width: '600px',
        minHeight: '440px',
        margin: '128px auto',
        borderRadius: '10px',
      }}
    >
      <Typography variant='h4' className='app-name' gutterBottom>
        Today's Forecast
      </Typography>
      <Box className='search-bar' width='100%' maxWidth='400px' mb={4}>
        <TextField
          variant='outlined'
          fullWidth
          placeholder='Enter City Name'
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={search}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {weather.loading && (
        <Box mt={4}>
          <CircularProgress />
        </Box>
      )}
      {weather.error && (
        <Box mt={4} className='error-message'>
          <FontAwesomeIcon icon={faFrown} />
          <span style={{ fontSize: '20px', marginLeft: '10px' }}>
            City not found
          </span>
        </Box>
      )}
      <Box sx={{ display: 'flex' }}>
        {weather.data && weather.data.main && (
          <Box mt={4}>
            <Typography variant='h5' className='city-name'>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </Typography>
            <Typography variant='body1' className='date'>
              {toDateFunction()}
            </Typography>
            <Box className='weather-info'>
              <div className='icon-temp'>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png`}
                  alt={weather.data.weather[0].description}
                />
                <Typography variant='h3'>
                  {Math.round(weather.data.main.temp)}
                  <sup className='deg'>°C</sup>
                </Typography>
              </div>
              <div className='des-wind'>
                <Typography variant='body1'>
                  {weather.data.weather[0].description.toUpperCase()}
                </Typography>
                <Typography variant='body1'>
                  Wind Speed: {weather.data.wind.speed} m/s
                </Typography>
              </div>
            </Box>
          </Box>
        )}
        {tomorrowWeather && (
          <Box mt={4}>
            <Typography variant='h5'>Tomorrow's Forecast</Typography>
            <Box className='weather-info'>
              <div className='icon-temp'>
                <img
                  src={`https://openweathermap.org/img/wn/${tomorrowWeather.weather[0].icon}.png`}
                  alt={tomorrowWeather.weather[0].description}
                />
                <Typography variant='h6'>
                  {Math.round(tomorrowWeather.temp.day)}
                  <sup className='deg'>°C</sup>
                </Typography>
              </div>
              <div className='des-wind'>
                <Typography variant='body1'>
                  {tomorrowWeather.weather[0].description.toUpperCase()}
                </Typography>
                <Typography variant='body1'>
                  Wind Speed: {tomorrowWeather.wind_speed} m/s
                </Typography>
              </div>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WeatherUpdate;
