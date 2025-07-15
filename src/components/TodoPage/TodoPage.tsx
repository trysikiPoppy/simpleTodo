import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import { Task } from "../../types";
import * as api from "../../api";
import "../../styles/todoStyles.css";
import "../../styles/todoAnimations.css";

function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const fetchedTasks = await api.fetchTasks();
      setTasks(fetchedTasks);
      setLoading(false);
    };

    loadTasks();
  }, []);

  const handleAddTask = async (
    text: string,
    category: string
  ): Promise<void> => {
    if (text.trim() === "") return;

    const uniqueId = Date.now();

    const newTask: Task = {
      id: uniqueId,
      text: text,
      completed: false,
      date: new Date(selectedDate.getTime()),
      category: category,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    await api.addTask(text, category);
  };

  const handleToggleTaskStatus = async (taskId: number): Promise<void> => {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );

      await api.updateTaskStatus(taskId, !task.completed);
    }
  };

  const handleDeleteTask = async (taskId: number): Promise<void> => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    await api.deleteTask(taskId);
  };

  const filteredTasks = tasks.filter((task) => {
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
        tasks={tasks}
        showDaysCount={5}
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

      <AddTaskForm addTask={handleAddTask} setShowCalendar={setShowCalendar} />
    </div>
  );
}

export default TodoPage;
