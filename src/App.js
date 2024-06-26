import logo from './logo.svg';
import WeatherUpdate from './component/weatherApp';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <WeatherUpdate />
      </QueryClientProvider>
      ,
    </div>
  );
}

export default App;
