import { useState, useCallback } from 'react';
import type { WeatherDay, GeoResult } from '../types/weather';
import { geocode, fetchWeather } from '../services/weatherService';

interface WeatherState {
  data: WeatherDay[];
  location: GeoResult | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: [],
    location: null,
    loading: false,
    error: null,
  });

  const load = useCallback(async (city: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const geo = await geocode(city);
      const data = await fetchWeather(geo.latitude, geo.longitude);
      setState({ data, location: geo, loading: false, error: null });
    } catch (e) {
      setState(s => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : '取得失敗',
      }));
    }
  }, []);

  return { ...state, load };
}
