import React, { useState } from 'react';
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
import DailyForecast from './tenDaysForecast';
import {
  fetchTenDayForecast,
  fetchTodayForecast,
} from '../utils/fetchTenDayForecast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const WeatherUpdate = () => {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const queryClient = useQueryClient();
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
      try {
        const weatherData = await fetchTodayForecast(input);
        setWeather({ data: weatherData, loading: false, error: false });
        queryClient.prefetchQuery({
          queryKey: [
            'tenDayForecast',
            weatherData.coord.lat,
            weatherData.coord.lon,
          ],
          queryFn: () =>
            fetchTenDayForecast(weatherData.coord.lat, weatherData.coord.lon),
        });
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        console.error('Error fetching weather data', error);
      }
    }
  };
  const { data: tenDayForecast = [] } = useQuery({
    queryKey: [
      'tenDayForecast',
      weather.data.coord?.lat,
      weather.data.coord?.lon,
    ],
    queryFn: () =>
      fetchTenDayForecast(weather.data.coord.lat, weather.data.coord.lon),
    enabled: !!weather.data.coord,
  });

  // const search = async (event, isButtonClick = false) => {
  //   if (isButtonClick || (event.key && event.key === 'Enter')) {
  //     event.preventDefault();
  //     setInput('');
  //     setWeather({ ...weather, loading: true });
  //     const url = `${today_forecast}`;
  //     const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
  //     await axios
  //       .get(url, {
  //         params: {
  //           q: input,
  //           units: 'metric',
  //           appid: api_key,
  //         },
  //       })
  //       .then((res) => {
  //         setWeather({ data: res.data, loading: false, error: false });
  //         fetchTenDayForecast(
  //           res.data.coord.lat,
  //           res.data.coord.lon,
  //           setTenDayForecast
  //         );
  //       })
  //       .catch((error) => {
  //         setWeather({ ...weather, data: {}, error: true });
  //         setInput('');
  //         console.log('error', error);
  //       });
  //   }
  // };
  // const fetchTenDayForecast = async (lat, lon) => {
  //   const url = `${tenDays_forecast}`;
  //   const api_key = api_weather_key;
  //   const exclude = 'current,minutely,hourly';
  //   await axios
  //     .get(url, {
  //       params: {
  //         lat: lat,
  //         lon: lon,
  //         exclude: exclude,
  //         units: 'metric',
  //         appid: api_key,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data && res.data.daily) {
  //         setTenDayForecast(res.data.daily.slice(0, 10));
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('ten-day forecast error', error);
  //       setTenDayForecast([]);
  //     });
  // };
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
      <DailyForecast tenDayForecast={tenDayForecast} />
    </Box>
  );
};

export default WeatherUpdate;
