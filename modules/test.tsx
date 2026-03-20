'use client'
import React from 'react';
import styles from './test.module.css';

// Your Test Starts Here

import { useState } from "react";

//Defining Task object
type Task = {
    id: number;
    title: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
};

export default function TaskManager(): JSX.Element {

    //Storing task using useState
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Task["priority"]>("Low"); //default to low
    const [error, setError] = useState("");

    //Adds new Task to the list
    const addTask = () => {
        // Prevent empty title
        if (!title.trim()) {
            setError("Task title cannot be empty");
            return;
        }
        //Creating new task
        const newTask: Task = {
            id: Date.now(),
            title,
            priority,
            completed: false,
        };
        //Adding new task on top of the list
        setTasks([newTask, ...tasks]);
        //Reseting input and error
        setTitle("");
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

    
    return <div className={styles.container}>
            <h2>Task Manager</h2>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
            />

            <select
                value={priority}
                onChange={(e) =>
                    setPriority(e.target.value as Task["priority"])
                }
            >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <button onClick={addTask}>Add Task</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                        />
                        <span
                            style={{
                                textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            {task.title} ({task.priority})
                        </span>
                        <button onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
    </div>;
};