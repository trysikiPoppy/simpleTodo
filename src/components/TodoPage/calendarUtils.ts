import { Task } from "../../types";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const hasTasksForDate = (date: Date, tasks: Task[]): boolean => {
  return tasks.some((task) => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const formatDate = (date: Date): string => {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
};

export const getMonthDetails = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth, year, month };
};
