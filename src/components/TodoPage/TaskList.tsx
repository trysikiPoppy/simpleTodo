import React, { useRef, useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Task } from "../../types";
import "../../styles/todoAnimations.css";

interface TaskListProps {
  tasks: Task[];
  toggleTaskStatus: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
}

function TaskList({ tasks, toggleTaskStatus, deleteTask }: TaskListProps) {
  const nodeRefs = useRef(new Map());
  const [previousCompletedIds, setPreviousCompletedIds] = useState<number[]>(
    []
  );
  const [taskSources, setTaskSources] = useState<Record<number, string>>({});
  const [animatingTasks, setAnimatingTasks] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const completedIds = tasks
      .filter((task) => task.completed)
      .map((task) => task.id);

    const fromCompletedIds = previousCompletedIds.filter(
      (id) => !completedIds.includes(id) && tasks.some((task) => task.id === id)
    );

    if (fromCompletedIds.length > 0) {
      const newSources = { ...taskSources };
      fromCompletedIds.forEach((id) => {
        newSources[id] = "completed";
      });
      setTaskSources(newSources);
    }

    setPreviousCompletedIds(completedIds);
  }, [tasks, previousCompletedIds, taskSources]);

  const getOrCreateRef = (id: number) => {
    if (!nodeRefs.current.has(id)) {
      nodeRefs.current.set(id, React.createRef<HTMLLIElement>());
    }
    return nodeRefs.current.get(id);
  };

  const handleCheckboxClick = (taskId: number, isCompleted: boolean) => {
    if (!isCompleted) {
      const checkbox = document.getElementById(`checkbox-${taskId}`);
      if (checkbox) {
        checkbox.classList.add("animate-checkmark");

        setAnimatingTasks((prev) => ({ ...prev, [taskId]: true }));

        setTimeout(() => {
          toggleTaskStatus(taskId);

          setTimeout(() => {
            setAnimatingTasks((prev) => {
              const newState = { ...prev };
              delete newState[taskId];
              return newState;
            });
          }, 300);
        }, 300);
      }
    } else {
      const newSources = { ...taskSources };
      newSources[taskId] = "completed";
      setTaskSources(newSources);
      toggleTaskStatus(taskId);
    }
  };

  const getAnimationClass = (taskId: number) => {
    if (taskSources[taskId] === "completed") {
      return "task-from-completed";
    }
    return "task-active";
  };

  const handleExited = (taskId: number) => {
    const newSources = { ...taskSources };
    delete newSources[taskId];
    setTaskSources(newSources);
  };

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const groupedActiveTasks = activeTasks.reduce<Record<string, Task[]>>(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    },
    {}
  );

  return (
    <div className="tasks-section">
      {Object.entries(groupedActiveTasks).map(([category, categoryTasks]) => (
        <div key={category} className="task-category">
          <h3 className="category-title">{category}</h3>

          <TransitionGroup component="ul" className="task-list active-list">
            {categoryTasks.map((task) => (
              <CSSTransition
                key={task.id}
                timeout={300}
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
                      onClick={() =>
                        handleCheckboxClick(task.id, task.completed)
                      }
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

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <h3 className="completed-title">Completed</h3>
          <TransitionGroup component="ul" className="task-list completed-list">
            {completedTasks.map((task) => (
              <CSSTransition
                key={task.id}
                timeout={300}
                classNames="task-completed"
                nodeRef={getOrCreateRef(task.id)}
                appear={animatingTasks[task.id]}
              >
                <li
                  ref={getOrCreateRef(task.id)}
                  className="task-item completed"
                >
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
                      onClick={() =>
                        handleCheckboxClick(task.id, task.completed)
                      }
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
