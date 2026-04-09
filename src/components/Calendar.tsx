import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventContentArg } from '@fullcalendar/core';
import type { WeatherDay } from '../types/weather';
import { WeatherCell } from './WeatherCell';

interface Props {
  weatherData: WeatherDay[];
}

export function Calendar({ weatherData }: Props) {
  const events = weatherData.map(day => ({
    date: day.date,
    allDay: true,
    extendedProps: { day },
  }));

  function renderEventContent(arg: EventContentArg) {
    const day = arg.event.extendedProps.day as WeatherDay;
    return <WeatherCell day={day} />;
  }

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={false}
      />
    </div>
  );
}
