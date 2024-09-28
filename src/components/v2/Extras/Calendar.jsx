import { useState } from "react";
import './Calendar.css';

function getCurrentMonthAndYear() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export default function Calendar({ schedule }) {
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthAndYear());

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

  return (
    <div className="calendar">
      <div className="calendar-navigation">
        <button onClick={goToPreviousMonth}>Previous</button>
        <h2>{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</h2>
        <button onClick={goToNextMonth}>Next</button>
      </div>

      <div className="calendar-header">
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
              <div key={j} className="calendar-cell">
                {day && (
                  <>
                    <span className="calendar-date">{day < 10 ? `0${day}` : day}</span>
                    {schedule[formatDate(year, month, day)] && (
                      <div className="calendar-events">
                        {schedule[formatDate(year, month, day)].map((event, index) => (
                          <div key={index} style={{display: 'flex'}}>
                            <div className={`calendar-event ${event.type}`}></div>
                            <span>
                              {new Date(event.openingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                              -{" "}
                              {new Date(event.closingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
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
      </div>
    </div>
  );
}
