'use client'
import React from 'react';
import styles from './test.module.css';

// Your Test Starts Here

import { useState,useEffect,useRef } from "react";

//Defining Task object
type Task = {
    id: number;
    name: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
};

const STORAGE_KEY = "tasks";

//Component for prioty on list
function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  return (
    <span className={`${styles.badge} ${styles[priority.toLowerCase()]}`}>
      {priority}
    </span>
  );
}

//Task listed item component
function TaskItem({
    task,
    onToggle,
    onDelete,
    onEdit,
}: {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}) {
  return (
    <li className={styles.taskItem}>
      <label className={styles.taskLeft}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span
          className={task.completed ? styles.completed : ""}
        >
          {task.name}
        </span>
      </label>

      <div className={styles.taskRight}>
        <PriorityBadge priority={task.priority} />
        <button className={styles.editBtn} onClick={() => onEdit(task)}>
            ✎
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(task.id)}
        >
          ✕
        </button>
      </div>
    </li>
  );
}


export default function TaskManager(): JSX.Element {

    //Storing task using useState
    const [tasks, setTasks] = useState<Task[]>([]);
    const [name, setName] = useState("");
    const [priority, setPriority] = useState<Task["priority"]>("Low"); //default to low
    const [error, setError] = useState("");

    //search useState
    const [search, setSearch] = useState("");

    //fileter useState
    const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

    //editing useStates
    const [editingId, setEditingId] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);


    //Load tasks list on render
    useEffect(() => {
        try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setTasks(JSON.parse(stored));
        }
        } catch (err) {
            console.error("Failed to load tasks:", err);
        }
    }, []);

    //Save task list on-change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (err) {
            console.error("Failed to save tasks:", err);
        }
    }, [tasks]);

    //Task Filter by iscompleted or with search input
    const filteredTasks = tasks
    .filter(task =>
        task.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(task => {
        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });


    //Adds new Task to the list
    const addTask = () => {
        // Prevent empty name
        if (!name.trim()) {
            setError("Task name cannot be empty");
            return;
        }
        if (editingId !== null) {
            // Editing existing task
            setTasks(prev =>
            prev.map(t =>
                t.id === editingId
                ? { ...t, name, priority }
                : t
            )
            );
            setEditingId(null);
        } else {
            //Creating new task
            const newTask: Task = {
                id: Date.now(),
                name,
                priority,
                completed: false,
            };

            //Adding new task on top of the list
            setTasks([newTask, ...tasks]);

        }
        //Reseting input and error
        setName("");
        setPriority("Low");
        setError("");
    };

    //Toggle task completed state
    const toggleTask = (id: number) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };
    //Deleting task
    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    

    //Edinting task
    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setName(task.name);
        setPriority(task.priority);

        // Set focus on the input bar when editing starts
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    //Canceling edit
    const cancelEdit = () => {
        setEditingId(null);
        setName("");
        setError("");
    };
    
    return <div className={styles.container}>
      <div className={styles.card}>
            <h2 className={styles.header}>Task Manager</h2>

            {/* Input Row */}
            <div className={styles.inputRow}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What needs to be done?"
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                />

                <select
                    className={styles.select}
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value as Task["priority"])
                    }
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
            {/*Button Row*/}
            <div className={styles.buttons}>
                <button 
                    className={styles.addBtn}
                    onClick={addTask}
                    disabled={!name.trim()}>
                    {editingId !== null ? "Save" : "Add "}
                </button>
                {editingId !== null && (
                    <button onClick={cancelEdit} className={styles.cancelBtn}>
                        Cancel
                    </button>
                )}
            </div>

            {/*Error notification*/}
            {error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <p className={styles.error}> {"\u00A0"}</p>
            )}        

            <div className={styles.filters}>

                {/*Search input*/}
                <input
                    className={styles.input}
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/*Filter*/}
                <select
                    className={styles.select}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "All" | "Active" | "Completed")}
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Task List */}
            <ul className={styles.list}>
                {filteredTasks.length === 0 ? (
                    <p className={styles.empty}>
                    {search ? "No matching tasks" : "No tasks yet"}
                    </p>
                ) : (
                    filteredTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onEdit={startEdit}
                    />
                    ))
                )}
            </ul>
        </div>
    </div>
};