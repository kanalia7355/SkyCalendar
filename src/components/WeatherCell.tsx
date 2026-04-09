import type { WeatherDay, WeatherCondition } from '../types/weather';

const ICONS: Record<WeatherCondition, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  foggy: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '❄️',
  showers: '🌦️',
  thunderstorm: '⛈️',
};

const LABELS: Record<WeatherCondition, string> = {
  sunny: '晴れ',
  'partly-cloudy': '晴れ時々曇り',
  cloudy: '曇り',
  foggy: '霧',
  drizzle: '小雨',
  rain: '雨',
  snow: '雪',
  showers: 'にわか雨',
  thunderstorm: '雷雨',
};

interface Props {
  day: WeatherDay;
}

export function WeatherCell({ day }: Props) {
  return (
    <div className="weather-cell" title={`${LABELS[day.weather]} / 降水: ${day.rain}mm`}>
      <span className="weather-icon">{ICONS[day.weather]}</span>
      <span className="weather-temps">
        <span className="temp-max">{day.temp_max}°</span>
        <span className="temp-sep">/</span>
        <span className="temp-min">{day.temp_min}°</span>
      </span>
      {day.rain > 0 && <span className="rain-amount">{day.rain}mm</span>}
    </div>
  );
}
