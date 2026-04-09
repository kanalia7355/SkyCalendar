export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'foggy'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm';

export interface WeatherDay {
  date: string;
  temp_max: number;
  temp_min: number;
  weather: WeatherCondition;
  rain: number;
}

export interface WeatherResponse {
  data: WeatherDay[];
}

export interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
