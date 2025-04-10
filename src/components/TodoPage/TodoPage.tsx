import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { Task } from '../../types';
import * as api from '../../api';
import '../../styles/todoStyles.css';
import '../../styles/todoAnimations.css';

function TodoPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

    // Загрузка задач при монтировании компонента
    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            const fetchedTasks = await api.fetchTasks();
            setTasks(fetchedTasks);
            setLoading(false);
        };

        loadTasks();
    }, []);

    // Добавление новой задачи
    const handleAddTask = async (text: string, category: string): Promise<void> => {
        if (text.trim() === '') return;

        // Генерируем уникальный ID локально
        const uniqueId = Date.now();

        // Создаем новую задачу
        const newTask: Task = {
            id: uniqueId,
            text: text,
            completed: false,
            date: new Date(selectedDate.getTime()), // Создаем новый объект даты
            category: category
        };

        // Обновляем состояние, используя функциональную форму
        setTasks(prevTasks => [...prevTasks, newTask]);

        // Опционально отправляем на сервер
        await api.addTask(text, category);
    };

    // Переключение статуса задачи
    const handleToggleTaskStatus = async (taskId: number): Promise<void> => {
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            // Обновляем состояние задачи
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                )
            );

            // Отправляем изменения на сервер
            await api.updateTaskStatus(taskId, !task.completed);
        }
    };
    // Удаление задачи
    const handleDeleteTask = async (taskId: number): Promise<void> => {
        // Обновляем состояние, используя функциональную форму
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        // Опционально отправляем на сервер
        await api.deleteTask(taskId);
    };

    // Фильтрация задач по выбранной дате
    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return (
            taskDate.getDate() === selectedDate.getDate() &&
            taskDate.getMonth() === selectedDate.getMonth() &&
            taskDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    return (
        <div className="todo-page">
            <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                tasks={tasks} // Передаем все задачи для определения дней с задачами
                showDaysCount={5} // Показываем только 5 дней
            />

            {loading ? (
                <div className="loading">Loading tasks...</div>
            ) : (
                <TaskList
                    tasks={filteredTasks}
                    toggleTaskStatus={handleToggleTaskStatus}
                    deleteTask={handleDeleteTask}
                />
            )}

            <AddTaskForm
                addTask={handleAddTask}
                setShowCalendar={setShowCalendar}
            />
        </div>
    );
}

export default TodoPage;
