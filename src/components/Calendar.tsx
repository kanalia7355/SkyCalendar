import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventContentArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { WeatherDay, CalendarEvent } from '../types/weather';
import { WeatherCell } from './WeatherCell';
import { EventModal } from './EventModal';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'create'; date: string }
  | { mode: 'edit'; event: CalendarEvent };

interface Props {
  weatherData: WeatherDay[];
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export function Calendar({ weatherData, events, onAddEvent, onUpdateEvent, onDeleteEvent }: Props) {
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

  const weatherEvents = weatherData.map(day => ({
    id: `weather-${day.date}`,
    date: day.date,
    allDay: true,
    editable: false,
    order: -1,
    extendedProps: { type: 'weather' as const, day },
  }));

  const userEvents = events.map(ev => ({
    id: ev.id,
    title: ev.title,
    start: ev.startTime ? `${ev.date}T${ev.startTime}` : ev.date,
    end: ev.endTime ? `${ev.date}T${ev.endTime}` : undefined,
    allDay: !ev.startTime,
    backgroundColor: ev.color,
    borderColor: ev.color,
    editable: true,
    extendedProps: { type: 'user' as const, event: ev },
  }));

  function handleDateClick(arg: DateClickArg) {
    setModal({ mode: 'create', date: arg.dateStr });
  }

  function handleEventClick(arg: EventClickArg) {
    if (arg.event.extendedProps.type === 'user') {
      setModal({ mode: 'edit', event: arg.event.extendedProps.event as CalendarEvent });
    }
  }

  function handleEventDrop(arg: EventDropArg) {
    if (arg.event.extendedProps.type !== 'user') {
      arg.revert();
      return;
    }
    const ev = arg.event.extendedProps.event as CalendarEvent;
    const newDate = arg.event.startStr.slice(0, 10);
    onUpdateEvent({ ...ev, date: newDate });
  }

  function renderEventContent(arg: EventContentArg) {
    if (arg.event.extendedProps.type === 'weather') {
      const day = arg.event.extendedProps.day as WeatherDay;
      return <WeatherCell day={day} />;
    }
    const ev = arg.event.extendedProps.event as CalendarEvent;
    return (
      <div className="user-event-content">
        {ev.startTime && <span className="user-event-time">{ev.startTime}</span>}
        <span className="user-event-title">{ev.title}</span>
      </div>
    );
  }

  function closeModal() {
    setModal({ mode: 'closed' });
  }

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={[...weatherEvents, ...userEvents]}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        editable={true}
        droppable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        dayMaxEvents={false}
      />

      {modal.mode === 'create' && (
        <EventModal
          initialDate={modal.date}
          onSave={onAddEvent}
          onClose={closeModal}
        />
      )}
      {modal.mode === 'edit' && (
        <EventModal
          event={modal.event}
          onSave={onUpdateEvent}
          onDelete={onDeleteEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
