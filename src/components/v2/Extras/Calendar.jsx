import { useState } from "react";
import './Calendar.css';
import { capitalizeFirstLetter } from "../../../functions/common";

function getCurrentMonthAndYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

function formatDate(year, month, day) {
  return `${('0' + (month + 1)).slice(-2)}/${('0' + day).slice(-2)}/${year}`;
}

function formatTime(datetime, timezone) {
  return new Date(datetime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

function formatReadableDate(dateString) {
  return capitalizeFirstLetter(
    new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  );
}

export default function Calendar({ schedule, timezone }) {
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthAndYear());
  const [eventsInfo, setEventsInfo] = useState(null);

  function generateCalendarDays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const weeks = [];
    let currentDay = 1;

    // Add initial padding for the first week
    let firstWeek = Array.from({ length: 7 }, (_, i) => (
      i < firstDayOfWeek ? null : currentDay++
    ));
    weeks.push(firstWeek);

    // Fill remaining weeks
    while (currentDay <= daysInMonth) {
      const week = Array.from({ length: 7 }, () => (
        currentDay > daysInMonth ? null : currentDay++
      ));
      weeks.push(week);
    }

    return weeks;
  }

  function handleMonthChange(direction) {
    if (direction === "previous") {
      setMonthYear(month === 0
        ? { month: 11, year: year - 1 }
        : { month: month - 1, year }
      );
    } else if (direction === "next") {
      setMonthYear(month === 11
        ? { month: 0, year: year + 1 }
        : { month: month + 1, year }
      );
    }
  }

  function selectDate(year, month, day) {
    const dateEvents = schedule?.[formatDate(year, month, day)]?.filter(
      (e) => !["INFO", "ATTRACTION"].includes(e.type)
    );
    setEventsInfo(dateEvents);
  }

  const weeks = generateCalendarDays(year, month);
  const monthName = capitalizeFirstLetter(
    new Date(year, month).toLocaleString('en-US', { month: 'long' })
  );

  return (
    <div className="calendar">
      <CalendarNavigation
        monthName={monthName}
        year={year}
        onPrevious={() => handleMonthChange("previous")}
        onNext={() => handleMonthChange("next")}
      />

      <CalendarHeader />

      <CalendarGrid
        weeks={weeks}
        year={year}
        month={month}
        schedule={schedule}
        onDateSelect={selectDate}
      />

      <CalendarEvents events={eventsInfo} timezone={timezone} />

      <CalendarLegend />
    </div>
  );
}

function CalendarNavigation({ monthName, year, onPrevious, onNext }) {
  return (
    <div className="calendar-navigation">
      <button onClick={onPrevious}>{"<"}</button>
      <h2>{`${monthName} ${year}`}</h2>
      <button onClick={onNext}>{">"}</button>
    </div>
  );
}

function CalendarHeader() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="calendar-header calendar-row">
      {days.map((day) => (
        <div key={day} className="calendar-day-header">
          {day}
        </div>
      ))}
    </div>
  );
}

function CalendarGrid({ weeks, year, month, schedule, onDateSelect }) {
  return (
    <div className="calendar-grid">
      {weeks.map((week, i) => (
        <div key={i} className="calendar-row">
          {week.map((day, j) => (
            <div
              key={j}
              className={`calendar-cell ${
                day && isToday(year, month, day) ? "calendar-today" : ""
              }`}
            >
              {day ? (
                <div
                  className="existing-calendar-cell"
                  onClick={() => onDateSelect(year, month, day)}
                >
                  <span className="calendar-date">{day < 10 ? `0${day}` : day}</span>
                  <CalendarEventsPreview
                    events={schedule?.[formatDate(year, month, day)]}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarEventsPreview({ events }) {
  const filteredEvents = events?.filter(
    (e) => !["INFO", "ATTRACTION"].includes(e.type)
  );

  return (
    <div className="calendar-date-events">
      {filteredEvents?.map((event, index) => (
        <div key={index} className={`calendar-cell-event ${event.type}`} />
      ))}
    </div>
  );
}

function CalendarEvents({ events, timezone }) {
  if (!events?.length) return null;

  return (
    <div className="calendar-info-div">
      <h5>Opening hours for {formatReadableDate(events[0].date)}</h5>
      <div className="calendar-info">
        {events.map((event, index) => (
          <div key={index} className="calendar-info-item">
            <span>
              <div className={`calendar-cell-event ${event.type}`}></div>
              {`${formatTime(event.openingTime, timezone)} - ${formatTime(
                event.closingTime,
                timezone
              )}`}
            </span>
            <span>{event.description || "Park Hours"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarLegend() {
  const legendItems = [
    { type: "OPERATING", label: "Normal Hours" },
    { type: "EXTRA_HOURS", label: "Extra Hours" },
    { type: "TICKETED_EVENT", label: "Ticketed Event" },
  ];

  return (
    <div className="calendar-legend">
      <h3>Legend</h3>
      {legendItems.map((item) => (
        <div key={item.type} className="legend-item">
          <div className={`calendar-event ${item.type}`}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}