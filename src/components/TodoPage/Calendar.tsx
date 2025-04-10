//   Назначение: Отображает компактный календарь с ближайшими днями.
//   Основные функции:
// - Показывает текущую дату или "Today" в заголовке
// - Отображает 5 дней (по умолчанию) в виде карточек
// - Позволяет выбрать дату из этих дней
// - Показывает индикаторы для дней с задачами
// - Предоставляет кнопку "MORE" для открытия полного календаря
// - Управляет отображением компонента FullCalendar
import React from 'react';
import { DayInfo } from '../../types';
import FullCalendar from './FullCalendar';
import { dayNames, hasTasksForDate, isToday, formatDate } from './calendarUtils';
import '../../styles/calendarStyles.css';

interface CalendarProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    showCalendar: boolean;
    setShowCalendar: (show: boolean) => void;
    tasks: any[]; // Для определения дней с задачами
    showDaysCount?: number; // Количество дней для отображения (по умолчанию 5)
}

function Calendar({
                      selectedDate,
                      setSelectedDate,
                      showCalendar,
                      setShowCalendar,
                      tasks,
                      showDaysCount = 5 // По умолчанию показываем 5 дней
                  }: CalendarProps) {
    // Получаем текущую дату
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Создаем массив дней для отображения (сегодня и дни вперед)
    const getDaysArray = (): DayInfo[] => {
        const days: DayInfo[] = [];

        for (let i = 0; i < showDaysCount; i++) {
            const date = new Date(currentYear, currentMonth, currentDay + i);
            days.push({
                dayName: dayNames[date.getDay()],
                dayNumber: date.getDate(),
                date: date,
                isToday: i === 0
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
            <h1>{isToday(selectedDate) ? 'Today' : formatDate(selectedDate)}</h1>

            <div className="days-row">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`day-item ${day.isToday ? 'today' : ''} ${
                            selectedDate.getDate() === day.dayNumber &&
                            selectedDate.getMonth() === day.date.getMonth() ?
                                'selected' : ''
                        }`}
                        onClick={() => handleDateClick(day.date)}
                    >
                        <div className="day-name">{day.dayName}</div>
                        <div className="day-number">{day.dayNumber}</div>
                        {hasTasksForDate(day.date, tasks) && <div className="task-indicator"></div>}
                    </div>
                ))}

                {/* Кнопка "Ещё" вместо 6-го дня */}
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
