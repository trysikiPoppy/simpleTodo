import React from "react";
import { DayInfo } from "../../types";
import FullCalendar from "./FullCalendar";
import {
  dayNames,
  hasTasksForDate,
  isToday,
  formatDate,
} from "./calendarUtils";
import "../../styles/calendarStyles.css";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  tasks: any[];
  showDaysCount?: number;
}

function Calendar({
  selectedDate,
  setSelectedDate,
  showCalendar,
  setShowCalendar,
  tasks,
  showDaysCount = 5,
}: CalendarProps) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getDaysArray = (): DayInfo[] => {
    const days: DayInfo[] = [];

    for (let i = 0; i < showDaysCount; i++) {
      const date = new Date(currentYear, currentMonth, currentDay + i);
      days.push({
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        date: date,
        isToday: i === 0,
      });
    }

    return days;
  };

  const days = getDaysArray();

  const handleDateClick = (date: Date): void => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-section">
      <h1>{isToday(selectedDate) ? "Today" : formatDate(selectedDate)}</h1>

      <div className="days-row">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-item ${day.isToday ? "today" : ""} ${
              selectedDate.getDate() === day.dayNumber &&
              selectedDate.getMonth() === day.date.getMonth()
                ? "selected"
                : ""
            }`}
            onClick={() => handleDateClick(day.date)}
          >
            <div className="day-name">{day.dayName}</div>
            <div className="day-number">{day.dayNumber}</div>
            {hasTasksForDate(day.date, tasks) && (
              <div className="task-indicator"></div>
            )}
          </div>
        ))}

        <div
          className="day-item more-btn"
          onClick={() => setShowCalendar(true)}
        >
          <div className="day-name">MORE</div>
          <div className="day-number">...</div>
        </div>
      </div>

      {showCalendar && (
        <FullCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setShowCalendar={setShowCalendar}
          tasks={tasks}
        />
      )}
    </div>
  );
}

export default Calendar;
