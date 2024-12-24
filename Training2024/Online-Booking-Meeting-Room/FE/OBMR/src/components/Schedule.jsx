import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'

import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import { calendars } from '../data/calendarData'
import { events } from '../data/eventData'

const CalendarApp = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0]

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    calendars: calendars,
    events: events,
    plugins: [eventsService]
  })


  return (
      <ScheduleXCalendar calendarApp={calendar} />
  )
}

export default CalendarApp