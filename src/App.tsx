import { useWeather } from './hooks/useWeather';
import { LocationInput } from './components/LocationInput';
import { Calendar } from './components/Calendar';
import './index.css';

export default function App() {
  const { data, location, loading, error, load } = useWeather();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">天気カレンダー</h1>
        <LocationInput onSearch={load} loading={loading} />
        {location && (
          <p className="location-label">
            {location.name}
            {location.admin1 ? `, ${location.admin1}` : ''}, {location.country}
          </p>
        )}
        {error && <p className="error-msg">{error}</p>}
      </header>

      <main className="app-main">
        <Calendar weatherData={data} />
      </main>
    </div>
  );
}
