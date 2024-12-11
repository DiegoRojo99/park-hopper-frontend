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

export default function Calendar({ schedule, timezone }) {
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthAndYear());
  const [ eventsInfo, setEventsInfo ] = useState(false);

  function generateCalendarDays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const weeks = [];
    let currentDay = 1;

    let firstWeek = [];
    for (let i = 0; i < 7; i++) {
      if (i < firstDayOfWeek) {
        firstWeek.push(null);
      } else {
        firstWeek.push(currentDay);
        currentDay++;
      }
    }
    weeks.push(firstWeek);

    while (currentDay <= daysInMonth) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        if (currentDay > daysInMonth) {
          week.push(null);
        } else {
          week.push(currentDay);
          currentDay++;
        }
      }
      weeks.push(week);
    }

    return weeks;
  }

  function formatDate(year, month, day) {
    return `${('0' + (month + 1)).slice(-2)}/${('0' + day).slice(-2)}/${year}`;
  }

  function goToPreviousMonth() {
    if (month === 0) {
      setMonthYear({ month: 11, year: year - 1 });
    } else {
      setMonthYear({ month: month - 1, year });
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonthYear({ month: 0, year: year + 1 });
    } else {
      setMonthYear({ month: month + 1, year });
    }
  }

  const weeks = generateCalendarDays(year, month);
  const monthName = capitalizeFirstLetter(new Date(year, month).toLocaleString('en-US', { month: 'long' }));

  function selectDate(year, month, day){
    let dateEvents = schedule?.[formatDate(year, month, day)]?.filter(e => !["INFO", "ATTRACTION"].includes(e.type));
    setEventsInfo(dateEvents);
  }

  return (
    <div className="calendar">
      <div className="calendar-navigation">
        <button onClick={goToPreviousMonth}>{"<"}</button>
          <h2>
            {`${monthName} ${year}`}
          </h2>
        <button onClick={goToNextMonth}>{">"}</button>
      </div>

      <div className="calendar-header calendar-row">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {weeks.map((week, i) => (
          <div key={i} className="calendar-row">
            {week.map((day, j) => (
              <div key={j}  className={`calendar-cell ${
                day && isToday(year, month, day) ? "calendar-today" : ""
              }`}>
                {day ? (
                  <div className="existing-calendar-cell" onClick={() => selectDate(year, month, day)}>
                    <div className="calendar-cell-space"></div>
                    <span className="calendar-date">{day < 10 ? `0${day}` : day}</span>
                    <div className="calendar-date-events">     
                      {schedule?.[formatDate(year, month, day)]?.filter(e => !["INFO", "ATTRACTION"].includes(e.type)).map((event, index) => (
                          <div key={index} style={{display: 'flex'}}>
                            <div className={`calendar-cell-event ${event.type}`}></div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="calendar-cell-space"></div>
                  </div>
                ) : <></>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <CalendarEvents events={eventsInfo} timezone={timezone} />

      <div className="calendar-legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <div className="calendar-event OPERATING"></div>
          <span>Normal Hours</span>
        </div>
        <div className="legend-item">
          <div className="calendar-event EXTRA_HOURS"></div>
          <span>Extra Hours</span>
        </div>
        <div className="legend-item">
          <div className="calendar-event TICKETED_EVENT"></div>
          <span>Ticketed Event</span>
        </div>
      </div>
    </div>
  );
}

function CalendarEvents({events, timezone}){

  function formatTime(datetime){
    return new Date(datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: timezone })
  }

  function formatDate(dateString) {
    return capitalizeFirstLetter(new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric'}));
  }

  if(!events?.length){
    return (
      <>
      </>
    )
  }
  return (
    <div className="calendar-info-div" >
      <h5>Opening hours for {`${formatDate(events[0].date)}`}</h5>
      <div className="calendar-info">
        {events.map((event, index) => (
          <div className="calendar-info-item">
            <span>
              <div className={`calendar-cell-event ${event.type}`}></div>
              {`${formatTime(event.openingTime)} - ${formatTime(event.closingTime)}`}
            </span>
            <span>{event.description ? `${event.description}` : "Park Hours"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}