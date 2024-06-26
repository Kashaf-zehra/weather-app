import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

const WeatherUpdate = () => {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [tenDayForecast, setTenDayForecast] = useState([]);

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
  const search = async (event, isButtonClick = false) => {
    if (isButtonClick || (event.key && event.key === 'Enter')) {
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
          setWeather({ data: res.data, loading: false, error: false });
          fetchTenDayForecast(res.data.coord.lat, res.data.coord.lon);
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput('');
          console.log('error', error);
        });
    }
  };
  const fetchTenDayForecast = async (lat, lon) => {
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
        if (res.data && res.data.daily) {
          setTenDayForecast(res.data.daily.slice(0, 10));
        }
      })
      .catch((error) => {
        console.log('ten-day forecast error', error);
        setTenDayForecast([]);
      });
  };
  return (
    <Box
      component={Paper}
      elevation={3}
      p={4}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      sx={{
        width: '80%',
        minHeight: '640px',
        margin: '128px auto',
        borderRadius: '10px',
        backgroundImage: "url('images/sky.jpg')",
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography
        variant='h4'
        sx={{ color: 'black', padding: '6px', fontFamily: 'cursive' }}
      >
        Weather Updates
      </Typography>
      <Box width='100%' maxWidth='400px' padding='20px'>
        <TextField
          variant='outlined'
          fullWidth
          placeholder='Enter City Name'
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={(event) => search(event)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={(event) => search(event, true)}>
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
        <Box mt={4}>
          <FontAwesomeIcon icon={faFrown} />
          <span style={{ fontSize: '20px', marginLeft: '10px' }}>
            City not found
          </span>
        </Box>
      )}
      <Box
        sx={{
          mx: 'auto',
          border: '1px solid #fff',
          width: '400px',
          textAlign: 'center',
          background: '#fff',
          padding: '6px',
        }}
      >
        <Typography variant='h5' sx={{ color: 'black', fontWeight: 'bold' }}>
          Today's Forecast
        </Typography>
        {weather.data && weather.data.main && (
          <Box mt={4}>
            <Typography variant='h5'>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </Typography>
            <Typography variant='body1' className='date'>
              {toDateFunction()}
            </Typography>
            <Box>
              <Box>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png`}
                  alt={weather.data.weather[0].description}
                />
                <Typography variant='h3'>
                  {Math.round(weather.data.main.temp)}
                  <sup className='deg'>°C</sup>
                </Typography>
              </Box>
              <Box>
                <Typography variant='body1'>
                  {weather.data.weather[0].description.toUpperCase()}
                </Typography>
                <Typography variant='body1'>
                  Wind Speed: {weather.data.wind.speed} m/s
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {tenDayForecast.length > 0 && (
        <Box
          sx={{
            width: '90%',
            padding: '10px',
          }}
          mt={4}
        >
          <Typography
            variant='h4'
            sx={{
              textAlign: 'center',
              fontFamily: 'cursive',
              paddingBottom: '15px',
            }}
          >
            10-Day Forecast
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent transparent',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {tenDayForecast.map((day, index) => (
              <Box
                key={index}
                className='weather-info'
                sx={{
                  border: '1px solid #F6F6F6',
                  padding: '10px',
                  textAlign: 'center',
                  borderBottom: '10px solid #fff ',
                }}
              >
                <Typography variant='h6'>
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <Box>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                  />
                  <Typography variant='h6'>
                    {Math.round(day.temp.day)}
                    <sup className='deg'>°C</sup>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body1'>
                    {day.weather[0].description.toUpperCase()}
                  </Typography>
                  <Typography variant='body1'>
                    Wind Speed: {day.wind_speed} m/s
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WeatherUpdate;
