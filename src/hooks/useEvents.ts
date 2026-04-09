import { useState, useCallback } from 'react';
import type { CalendarEvent } from '../types/weather';

const STORAGE_KEY = 'weather-calendar-events';

function load(): CalendarEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function persist(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(load);

  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents(prev => {
      const next = [...prev, event];
      persist(next);
      return next;
    });
  }, []);

  const updateEvent = useCallback((event: CalendarEvent) => {
    setEvents(prev => {
      const next = prev.map(e => (e.id === event.id ? event : e));
      persist(next);
      return next;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { events, addEvent, updateEvent, deleteEvent };
}
