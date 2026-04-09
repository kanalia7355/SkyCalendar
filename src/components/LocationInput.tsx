import { useState, type FormEvent } from 'react';

interface Props {
  onSearch: (city: string) => void;
  loading: boolean;
}

export function LocationInput({ onSearch, loading }: Props) {
  const [city, setCity] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="location-input"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="都市名を入力（例: 東京、Osaka）"
        disabled={loading}
      />
      <button type="submit" className="location-btn" disabled={loading || !city.trim()}>
        {loading ? '取得中...' : '検索'}
      </button>
    </form>
  );
}
