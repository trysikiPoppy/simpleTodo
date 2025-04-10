//   Назначение: Содержит общие утилиты и константы для работы с датами и задачами.
//   Основные функции:
// - monthNames, dayNames, shortDayNames - массивы с названиями месяцев и дней недели
// - hasTasksForDate() - проверяет наличие задач на определенную дату
// - isToday() - определяет, является ли дата сегодняшней
// - formatDate() - форматирует дату в виде "DD Month"
// - getMonthDetails() - возвращает информацию о месяце (первый день, количество дней)
import { Task } from '../../types';

// Массив названий месяцев
export const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Массив названий дней недели (полные)
export const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Массив названий дней недели (сокращенные)
export const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Проверка наличия задач на определенную дату
export const hasTasksForDate = (date: Date, tasks: Task[]): boolean => {
    return tasks.some(task => {
        const taskDate = new Date(task.date);
        return (
            taskDate.getDate() === date.getDate() &&
            taskDate.getMonth() === date.getMonth() &&
            taskDate.getFullYear() === date.getFullYear()
        );
    });
};

// Проверка, является ли дата сегодняшней
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// Форматирование даты в виде "DD Month"
export const formatDate = (date: Date): string => {
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
};

// Получение деталей месяца (первый день, количество дней и т.д.)
export const getMonthDetails = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
};
