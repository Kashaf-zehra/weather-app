import axios from 'axios';

const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

export const fetchTenDayForecast = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall`;
  const exclude = 'current,minutely,hourly';
  try {
    const response = await axios.get(url, {
      params: {
        lat: lat,
        lon: lon,
        exclude: exclude,
        units: 'metric',
        appid: apiKey,
      },
    });

    if (response.data && response.data.daily) {
      return response.data.daily.slice(0, 10);
    }
  } catch (error) {
    console.error('Ten-day forecast error', error);
    throw error;
  }
};

export const fetchTodayForecast = async (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  try {
    const response = await axios.get(url, {
      params: {
        q: location,
        units: 'metric',
        appid: apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Today forecast error', error);
    throw error;
  }
};
