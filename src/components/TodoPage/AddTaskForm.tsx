import React, { useState, FormEvent } from 'react';

interface AddTaskFormProps {
    addTask: (text: string, category: string) => void;
    setShowCalendar: (show: boolean) => void;
}

function AddTaskForm({ addTask, setShowCalendar }: AddTaskFormProps) {
    const [taskText, setTaskText] = useState<string>('');
    const [category, setCategory] = useState<string>('PERSONAL');

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (taskText.trim() === '') return;

        addTask(taskText, category);
        setTaskText('');
    };

    return (
        <div className="add-task-form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        className="task-input"
                        placeholder="Write a task..."
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                    />

                    <button
                        type="button"
                        className="calendar-btn"
                        onClick={() => setShowCalendar(true)}
                    >
                        📅
                    </button>

                    <button type="submit" className="add-btn">
                        Add
                    </button>
                </div>

                <div className="category-selector">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="PERSONAL">Personal</option>
                        <option value="WORK">Work</option>
                        <option value="DESIGN">Design</option>
                        <option value="HOUSE">House</option>
                    </select>
                </div>
            </form>
        </div>
    );
}

export default AddTaskForm;
