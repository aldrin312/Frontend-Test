'use client'
import React from 'react';
import styles from './test.module.css';

// Your Test Starts Here

import { useState,useEffect } from "react";

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
}: {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
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

    const [search, setSearch] = useState("");

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

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(search.toLowerCase())
    );


    //Adds new Task to the list
    const addTask = () => {
        // Prevent empty name
        if (!name.trim()) {
            setError("Task name cannot be empty");
            return;
        }
        //Creating new task
        const newTask: Task = {
            id: Date.now(),
            name,
            priority,
            completed: false,
        };
        //Adding new task on top of the list
        setTasks([newTask, ...tasks]);
        //Reseting input and error
        setName("");
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
      <div className={styles.card}>
        <h2 className={styles.header}>Task Manager</h2>

        {/* Input Row */}
        <div className={styles.inputRow}>
          <input
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

          <button
            className={styles.addBtn}
            onClick={addTask}
            disabled={!name.trim()}
          >
            Add
          </button>
        </div>

        {/*Error notification if empty task name*/}
        {error ? (
            <p className={styles.error}>{error}</p>
        ) : (
            <p className={styles.error}> {"\u00A0"}</p>
        )}        

        {/*Search input row*/}
        <input
            className={styles.input}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

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
            />
            ))
        )}
        </ul>
      </div>
    </div>
};