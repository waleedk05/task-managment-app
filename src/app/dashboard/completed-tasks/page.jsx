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
import {Trash2, User, Calendar, UserCheck, CheckCircle, Award, RotateCcw} from "lucide-react";
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

export default function CompletedTasks() {
  const {tasks, loading, updateTaskStatus, deleteTask} = TasksHook();
  const {currentUser, fetchUsers} = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  // Load users when component mounts
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
  }, [currentUser]);

  // Function to get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Filter tasks - only show completed tasks
  const completedTasks = tasks.filter((task) => task.status === "completed");

  // Further filter by search term
  const filteredTasks = completedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate completion time
  const getCompletionTime = (createdAt, updatedAt) => {
    const created = new Date(createdAt);
    const completed = new Date(updatedAt);
    const diffInDays = Math.floor((completed - created) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Same day";
    if (diffInDays === 1) return "1 day";
    return `${diffInDays} days`;
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Completed Tasks</h1>
              <p className="text-gray-600 mt-1">
                {filteredTasks.length} completed task{filteredTasks.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search completed tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                <p className="text-sm text-gray-600">Total Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTasks.filter((task) => task.assignedTo === currentUser?.id).length}
                </p>
                <p className="text-sm text-gray-600">Completed by You</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    completedTasks.filter((task) => {
                      const created = new Date(task.createdAt);
                      const completed = new Date(task.updatedAt);
                      const diffInDays = Math.floor((completed - created) / (1000 * 60 * 60 * 24));
                      return diffInDays <= 1; // Completed within 1 day
                    }).length
                  }
                </p>
                <p className="text-sm text-gray-600">Quick Completions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto h-12 w-12 text-emerald-400 mb-4">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {completedTasks.length === 0 ? "No completed tasks yet" : "No tasks found"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms"
              : completedTasks.length === 0
              ? "Complete some tasks to see them here!"
              : "No completed tasks match your search"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-emerald-500 bg-emerald-50/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                    {task.title}
                  </CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium px-3 py-1 text-xs shrink-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
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
                        <span className="text-gray-500">Completed by:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {getUserName(task.assignedTo)}
                        </span>
                        {task.assignedTo === currentUser?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <UserCheck className="h-4 w-4 text-gray-500 shrink-0" />
                      <div>
                        <span className="text-gray-500">Created by:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {task.createdByName || getUserName(task.createdBy)}
                        </span>
                        {task.createdBy === currentUser?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                      <div>
                        <span className="text-gray-500">Completed on:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(task.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Completion time */}
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-gray-500">Completion time:</span>
                        <span className="ml-2 font-medium text-emerald-700">
                          {getCompletionTime(task.createdAt, task.updatedAt)}
                        </span>
                        {getCompletionTime(task.createdAt, task.updatedAt) === "Same day" && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs text-emerald-700 border-emerald-300">
                            Quick!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Only show if user is team lead */}
                  {currentUser?.role === "team_lead" && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1 min-w-[120px]"
                          onClick={() => handleStatusChange(task.id, "pending")}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reopen Task
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="hover:bg-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Completed Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the completed task "{task.title}"?
                                This will permanently remove this task and its completion record
                                from the system. This action cannot be undone.
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
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
