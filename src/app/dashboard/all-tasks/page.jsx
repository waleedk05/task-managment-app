"use client";
import React, {useState, useEffect} from "react";
import {toast} from "sonner";
import TasksHook from "@/hooks/TasksHook";
import useAuth from "@/hooks/useAuth";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Trash2, User, Calendar, UserCheck} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AllTasksPage() {
  const {tasks, loading, getTasks, updateTaskStatus, deleteTask} = TasksHook();
  const {currentUser, fetchUsers} = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  // Fix: Remove fetchUsers from dependencies and load users only once
  useEffect(() => {
    if (currentUser) {
      try {
        const allUsers = fetchUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Failed to load users");
      }
    }
  }, [currentUser]); // Remove fetchUsers from dependencies

  // Function to get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color and variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          className: "bg-amber-100 text-amber-800 border-amber-200",
          label: "Pending",
        };
      case "in_progress":
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200",
          label: "In Progress",
        };
      case "completed":
        return {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
          label: "Completed",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
        };
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search terms" : "No tasks have been created yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);

            return (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-all duration-200 border-l-4 ">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                      {task.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`${statusBadge.className} font-medium px-3 py-1 text-xs shrink-0`}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed mt-3 line-clamp-3">
                    {task.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Task Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-gray-500 shrink-0" />
                        <div>
                          <span className="text-gray-500">Assigned to:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {getUserName(task.assignedTo)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <UserCheck className="h-4 w-4 text-gray-500 shrink-0" />
                        <div>
                          <span className="text-gray-500">Created by:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {task.createdByName || getUserName(task.createdBy)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(task.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions - Only show if user is team lead or assigned to task */}
                    {(currentUser?.role === "team_lead" || task.assignedTo === currentUser?.id) && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-2">
                          {task.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="  text-white flex-1 min-w-[120px]"
                              onClick={() => handleStatusChange(task.id, "completed")}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}

                          {currentUser?.role === "team_lead" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="hover:bg-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the task "{task.title}"? This
                                    action cannot be undone and will permanently remove the task
                                    from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteTask(task.id)}>
                                    Delete Task
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
