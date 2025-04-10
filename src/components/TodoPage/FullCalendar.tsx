//   Назначение: Отображает полноэкранный календарь с месяцами.
//   Основные функции:
// - Показывает полный месяц в виде сетки дней
// - Позволяет переключаться между месяцами
// - Выделяет текущий день и выбранную дату
// - Отображает индикаторы для дней с задачами
// - Закрывается при клике на крестик или вне области календаря
// - Передает выбранную дату обратно в родительский компонент
import React, { useState, useRef } from 'react';
import { Task } from '../../types';
import { useClickOutside } from '@shelf/react-outside-click';
import {
    monthNames,
    shortDayNames,
    hasTasksForDate,
    isToday,
    getMonthDetails
} from './calendarUtils';
import '../../styles/calendarStyles.css';

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
                          tasks
                      }: FullCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedDate));
    const calendarRef = useRef<HTMLDivElement>(null);

    // Используем хук useClickOutside для закрытия календаря при клике вне его
    useClickOutside(calendarRef as unknown as React.RefObject<HTMLElement>, () => {
        setShowCalendar(false);
    });

    const { firstDay, daysInMonth, year, month } = getMonthDetails(currentMonth);

    // Переход к предыдущему месяцу
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Переход к следующему месяцу
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Обработчик клика по дате
    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
        setShowCalendar(false);
    };

    // Создаем массив дней для отображения в календаре
    const renderCalendarDays = () => {
        const days = [];

        // Добавляем названия дней недели
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={`header-${i}`} className="calendar-day-header">
                    {shortDayNames[i]}
                </div>
            );
        }

        // Добавляем пустые ячейки для выравнивания
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Добавляем дни месяца
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
                    className={`calendar-day ${isTodayDate ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`}
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
                    <h2>{monthNames[month]} {year}</h2>
                    <button onClick={nextMonth}>&gt;</button>
                    <button
                        className="close-calendar-btn"
                        onClick={() => setShowCalendar(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="calendar-grid">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
}

export default FullCalendar;
