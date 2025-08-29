"use client";
import {useState, useEffect} from "react";
import {toast} from "sonner";

export default function TasksHook() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    try {
      const tasksData = localStorage.getItem("tasks");
      if (!tasksData) {
        return [];
      }
      return JSON.parse(tasksData);
    } catch (error) {
      console.error("Error fetching the tasks!", error);
      toast.error("Failed to load tasks");
      return [];
    }
  };

  const getTasks = () => {
    setLoading(true);
    try {
      const allTasks = fetchTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status) => {
    const allTasks = fetchTasks();
    return allTasks.filter((task) => task.status === status);
  };

  const getTasksByUser = (userId) => {
    const allTasks = fetchTasks();
    return allTasks.filter((task) => task.assignedTo === userId);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    try {
      const allTasks = fetchTasks();
      const updatedTasks = allTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      });

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      toast.success("Task status updated!");
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return false;
    }
  };

  const deleteTask = (taskId) => {
    try {
      const allTasks = fetchTasks();
      const filteredTasks = allTasks.filter((task) => task.id !== taskId);

      localStorage.setItem("tasks", JSON.stringify(filteredTasks));
      setTasks(filteredTasks);
      toast.success("Task deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  // Load tasks on hook initialization
  useEffect(() => {
    getTasks();
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    getTasks,
    getTasksByStatus,
    getTasksByUser,
    updateTaskStatus,
    deleteTask,
  };
}
