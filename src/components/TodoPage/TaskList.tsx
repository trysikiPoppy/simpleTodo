import React, { useRef, useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Task } from '../../types';
import '../../styles/todoAnimations.css';

interface TaskListProps {
    tasks: Task[];
    toggleTaskStatus: (taskId: number) => void;
    deleteTask: (taskId: number) => void;
}

function TaskList({ tasks, toggleTaskStatus, deleteTask }: TaskListProps) {
    const nodeRefs = useRef(new Map());
    const [previousCompletedIds, setPreviousCompletedIds] = useState<number[]>([]);
    const [taskSources, setTaskSources] = useState<Record<number, string>>({});
    const [animatingTasks, setAnimatingTasks] = useState<Record<number, boolean>>({});

    // Отслеживаем изменения в задачах для определения источника задачи
    useEffect(() => {
        const completedIds = tasks.filter(task => task.completed).map(task => task.id);

        // Находим задачи, которые были выполнены, а теперь активны
        const fromCompletedIds = previousCompletedIds.filter(id =>
            !completedIds.includes(id) && tasks.some(task => task.id === id)
        );

        // Обновляем источники задач
        if (fromCompletedIds.length > 0) {
            const newSources = { ...taskSources };
            fromCompletedIds.forEach(id => {
                newSources[id] = 'completed';
            });
            setTaskSources(newSources);
        }

        // Запоминаем текущие выполненные задачи для следующего сравнения
        setPreviousCompletedIds(completedIds);
    }, [tasks]);

    const getOrCreateRef = (id: number) => {
        if (!nodeRefs.current.has(id)) {
            nodeRefs.current.set(id, React.createRef<HTMLLIElement>());
        }
        return nodeRefs.current.get(id);
    };

    const handleCheckboxClick = (taskId: number, isCompleted: boolean) => {
        if (!isCompleted) {
            // Если задача не выполнена, добавляем класс для анимации галочки
            const checkbox = document.getElementById(`checkbox-${taskId}`);
            if (checkbox) {
                checkbox.classList.add('animate-checkmark');

                // Отмечаем задачу как анимирующуюся
                setAnimatingTasks(prev => ({ ...prev, [taskId]: true }));

                // Задержка для анимации галочки (300мс вместо 600мс)
                setTimeout(() => {
                    // Изменяем статус задачи
                    toggleTaskStatus(taskId);

                    // Сбрасываем флаг анимации через время, равное времени анимации исчезновения
                    setTimeout(() => {
                        setAnimatingTasks(prev => {
                            const newState = { ...prev };
                            delete newState[taskId];
                            return newState;
                        });
                    }, 300); // Уменьшенное время для более быстрого перехода
                }, 300); // Уменьшенное время анимации галочки
            }
        } else {
            // Для выполненных задач сразу меняем статус
            const newSources = { ...taskSources };
            newSources[taskId] = 'completed';
            setTaskSources(newSources);
            toggleTaskStatus(taskId);
        }
    };

    // Определяем класс анимации в зависимости от источника задачи
    const getAnimationClass = (taskId: number) => {
        if (taskSources[taskId] === 'completed') {
            return 'task-from-completed';
        }
        return 'task-active';
    };

    // Очищаем источник задачи после завершения анимации
    const handleExited = (taskId: number) => {
        const newSources = { ...taskSources };
        delete newSources[taskId];
        setTaskSources(newSources);
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const groupedActiveTasks = activeTasks.reduce<Record<string, Task[]>>((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
    }, {});

    return (
        <div className="tasks-section">
            {/* Активные задачи */}
            {Object.entries(groupedActiveTasks).map(([category, categoryTasks]) => (
                <div key={category} className="task-category">
                    <h3 className="category-title">{category}</h3>

                    <TransitionGroup component="ul" className="task-list active-list">
                        {categoryTasks.map(task => (
                            <CSSTransition
                                key={task.id}
                                timeout={300} // Уменьшенное время анимации
                                classNames={getAnimationClass(task.id)}
                                nodeRef={getOrCreateRef(task.id)}
                                onExited={() => handleExited(task.id)}
                            >
                                <li ref={getOrCreateRef(task.id)} className="task-item">
                                    <div className="task-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => {}}
                                            id={`task-${task.id}`}
                                            className="active-checkbox"
                                        />
                                        <label
                                            htmlFor={`task-${task.id}`}
                                            className="custom-checkbox"
                                            id={`checkbox-${task.id}`}
                                            onClick={() => handleCheckboxClick(task.id, task.completed)}
                                        ></label>
                                    </div>

                                    <span className="task-text">{task.text}</span>

                                    <button
                                        className="delete-task-btn"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        ×
                                    </button>
                                </li>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            ))}

            {/* Выполненные задачи */}
            {completedTasks.length > 0 && (
                <div className="completed-section">
                    <h3 className="completed-title">Completed</h3>
                    <TransitionGroup component="ul" className="task-list completed-list">
                        {completedTasks.map(task => (
                            <CSSTransition
                                key={task.id}
                                timeout={300} // Уменьшенное время анимации
                                classNames="task-completed"
                                nodeRef={getOrCreateRef(task.id)}
                                appear={animatingTasks[task.id]} // Применяем анимацию только для новых задач
                            >
                                <li ref={getOrCreateRef(task.id)} className="task-item completed">
                                    <div className="task-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => {}}
                                            id={`task-${task.id}`}
                                            className="completed-checkbox"
                                        />
                                        <label
                                            htmlFor={`task-${task.id}`}
                                            className="custom-checkbox completed"
                                            onClick={() => handleCheckboxClick(task.id, task.completed)}
                                        ></label>
                                    </div>

                                    <span className="task-text">{task.text}</span>

                                    <button
                                        className="delete-task-btn"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        ×
                                    </button>
                                </li>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            )}
        </div>
    );
}

export default TaskList;
