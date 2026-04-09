import type { GeoResult, WeatherDay, WeatherCondition } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function geocode(city: string): Promise<GeoResult> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=ja&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding API error');
  const json = await res.json();
  if (!json.results?.length) throw new Error(`「${city}」が見つかりませんでした`);
  const r = json.results[0];
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  };
}

function codeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'sunny';
  if (code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code <= 48) return 'foggy';
  if (code <= 57) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'showers';
  return 'thunderstorm';
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherDay[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto',
    forecast_days: '7',
  });
  const res = await fetch(`${WEATHER_URL}?${params}`);
  if (!res.ok) throw new Error('Weather API error');
  const json = await res.json();

  const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_sum } =
    json.daily;

  return (time as string[]).map((date: string, i: number) => ({
    date,
    temp_max: Math.round(temperature_2m_max[i]),
    temp_min: Math.round(temperature_2m_min[i]),
    weather: codeToCondition(weather_code[i]),
    rain: Math.round(precipitation_sum[i] ?? 0),
  }));
}
