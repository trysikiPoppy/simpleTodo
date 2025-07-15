import React, { useState, useRef } from "react";
import { Task } from "../../types";
import { useClickOutside } from "@shelf/react-outside-click";
import {
  monthNames,
  shortDayNames,
  hasTasksForDate,
  isToday,
  getMonthDetails,
} from "./calendarUtils";
import "../../styles/calendarStyles.css";

interface FullCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setShowCalendar: (show: boolean) => void;
  tasks: Task[];
}

function FullCalendar({
  selectedDate,
  setSelectedDate,
  setShowCalendar,
  tasks,
}: FullCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate)
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    calendarRef as unknown as React.RefObject<HTMLElement>,
    () => {
      setShowCalendar(false);
    }
  );

  const { firstDay, daysInMonth, year, month } = getMonthDetails(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="calendar-day-header">
          {shortDayNames[i]}
        </div>
      );
    }

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isTodayDate = isToday(date);

      const isSelectedDate =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const hasTasks = hasTasksForDate(date, tasks);

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isTodayDate ? "today" : ""} ${
            isSelectedDate ? "selected" : ""
          }`}
          onClick={() => handleDateClick(i)}
        >
          {i}
          {hasTasks && <div className="task-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="full-calendar-overlay">
      <div className="full-calendar" ref={calendarRef}>
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h2>
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth}>&gt;</button>
          <button
            className="close-calendar-btn"
            onClick={() => setShowCalendar(false)}
          >
            ×
          </button>
        </div>

        <div className="calendar-grid">{renderCalendarDays()}</div>
      </div>
    </div>
  );
}

export default FullCalendar;
