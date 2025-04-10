import { Task } from './types';

const API_URL = 'https://jsonplaceholder.typicode.com';

// Преобразование данных с сервера в наш формат Task
const transformTodoToTask = (todo: any): Task => ({
    id: todo.id,
    text: todo.title,
    completed: todo.completed,
    date: new Date(),
    category: todo.userId === 1 ? 'PERSONAL' : todo.userId === 2 ? 'WORK' : todo.userId === 3 ? 'DESIGN' : 'HOUSE'
});

// Получение всех задач
export const fetchTasks = async (): Promise<Task[]> => {
    try {
        const response = await fetch(`${API_URL}/todos?_limit=9`);
        const data = await response.json();
        return data.map(transformTodoToTask);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

// Добавление новой задачи
export const addTask = async (text: string, category: string): Promise<Task | null> => {
    try {
        const userId = category === 'PERSONAL' ? 1 : category === 'WORK' ? 2 : category === 'DESIGN' ? 3 : 4;

        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            body: JSON.stringify({
                title: text,
                completed: false,
                userId
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const data = await response.json();
        return transformTodoToTask(data);
    } catch (error) {
        console.error('Error adding task:', error);
        return null;
    }
};

// Обновление статуса задачи
export const updateTaskStatus = async (taskId: number, completed: boolean): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/todos/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Error updating task:', error);
        return false;
    }
};

// Удаление задачи
export const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/todos/${taskId}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
};
