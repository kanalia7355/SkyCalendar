import type { GeoResult, WeatherDay, WeatherCondition } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function geocodeOpenMeteo(city: string): Promise<GeoResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=ja&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.results?.length) return null;
  const r = json.results[0];
  return { name: r.name, latitude: r.latitude, longitude: r.longitude, country: r.country, admin1: r.admin1 };
}

async function geocodeNominatim(city: string): Promise<GeoResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=ja`;
  const res = await fetch(url, { headers: { 'User-Agent': 'WeatherCalendar/1.0' } });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.length) return null;
  const r = json[0];
  return {
    name: r.display_name.split(',')[0],
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    country: r.display_name.split(',').at(-1)?.trim() ?? '',
    admin1: r.display_name.split(',')[1]?.trim(),
  };
}

export async function geocode(city: string): Promise<GeoResult> {
  const result = (await geocodeOpenMeteo(city)) ?? (await geocodeNominatim(city));
  if (!result) throw new Error(`「${city}」が見つかりませんでした`);
  return result;
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
