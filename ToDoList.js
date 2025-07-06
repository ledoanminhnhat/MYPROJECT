import React, { useState, useEffect } from 'react';

// --- Model ---
// This represents our data structure and basic data manipulation logic.
// In a larger application, this might be a separate file or a set of services.
const TaskModel = {
  // Function to create a new task object
  createTask: (text) => ({
    id: Date.now(), // Simple unique ID
    text: text,
    completed: false,
  }),

  // Function to add a task to a list of tasks
  addTaskToList: (tasks, newTask) => [...tasks, newTask],

  // Function to delete a task from a list of tasks
  deleteTaskFromList: (tasks, taskId) => tasks.filter(task => task.id !== taskId),

  // Function to toggle the completion status of a task
  toggleTaskCompletionInList: (tasks, taskId) =>
    tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ),
};

// --- View Components ---

// TaskItem: Renders a single to-do item
const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  return (
    <li className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm mb-3">
      <span
        className={`flex-1 text-lg cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
        onClick={() => onToggleComplete(task.id)}
      >
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
        aria-label={`Delete task: ${task.text}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
};

// TaskList: Renders the list of TaskItem components
const TaskList = ({ tasks, onDelete, onToggleComplete }) => {
  return (
    <ul className="w-full">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
};

// TaskInput: Handles input for adding new tasks
const TaskInput = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex mb-6">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <button
        type="submit"
        className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
      >
        Add Task
      </button>
    </form>
  );
};

// --- Controller (within App component) ---
// The App component acts as the main controller, managing the state (Model)
// and coordinating between the View components and the Model logic.
const App = () => {
  // State to hold our tasks (the "Model" data)
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from local storage if available
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Effect to save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Controller function to add a new task
  const handleAddTask = (text) => {
    const newTask = TaskModel.createTask(text);
    setTasks(prevTasks => TaskModel.addTaskToList(prevTasks, newTask));
  };

  // Controller function to delete a task
  const handleDeleteTask = (id) => {
    setTasks(prevTasks => TaskModel.deleteTaskFromList(prevTasks, id));
  };

  // Controller function to toggle task completion
  const handleToggleComplete = (id) => {
    setTasks(prevTasks => TaskModel.toggleTaskCompletionInList(prevTasks, id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          My To-Do List
        </h1>

        {/* TaskInput is a View component, onAddTask is passed as a Controller action */}
        <TaskInput onAddTask={handleAddTask} />

        {/* TaskList is a View component, tasks is the Model data,
            and handleDeleteTask/handleToggleComplete are Controller actions */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No tasks yet! Add one above.</p>
        ) : (
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default App;
