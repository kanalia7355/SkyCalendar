import type { VercelRequest, VercelResponse } from '@vercel/node';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'foggy'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto',
    forecast_days: '7',
  });

  const upstream = await fetch(`${WEATHER_URL}?${params}`);
  if (!upstream.ok) {
    return res.status(502).json({ error: 'Upstream weather API error' });
  }

  const json = await upstream.json();
  const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_sum } =
    json.daily;

  const data = (time as string[]).map((date: string, i: number) => ({
    date,
    temp_max: Math.round(temperature_2m_max[i]),
    temp_min: Math.round(temperature_2m_min[i]),
    weather: codeToCondition(weather_code[i]),
    rain: Math.round(precipitation_sum[i] ?? 0),
  }));

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  return res.status(200).json({ data });
}
