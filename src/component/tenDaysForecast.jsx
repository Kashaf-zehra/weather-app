import { Box, Typography } from '@mui/material';

const DailyForecast = ({ tenDayForecast }) => {
  return (
    <>
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
    </>
  );
};
export default DailyForecast;
