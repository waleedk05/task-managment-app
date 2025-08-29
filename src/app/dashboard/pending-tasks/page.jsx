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
import {Trash2, User, Calendar, UserCheck, Clock, Play} from "lucide-react";
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

export default function PendingTasks() {
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

  // Filter tasks - only show pending tasks
  const pendingTasks = tasks.filter(task => task.status === "pending");

  // Further filter by search term
  const filteredTasks = pendingTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600">Loading pending tasks...</p>
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
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pending Tasks</h1>
              <p className="text-gray-600 mt-1">
                {filteredTasks.length} pending task{filteredTasks.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search pending tasks..."
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
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
                <p className="text-sm text-gray-600">Total Pending</p>
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
                  {pendingTasks.filter(task => task.assignedTo === currentUser?.id).length}
                </p>
                <p className="text-sm text-gray-600">Assigned to You</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentUser?.role === 'team_lead' ? pendingTasks.filter(task => task.createdBy === currentUser?.id).length : 0}
                </p>
                <p className="text-sm text-gray-600">Created by You</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto h-12 w-12 text-amber-400 mb-4">
            <Clock className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {pendingTasks.length === 0 ? "No pending tasks" : "No tasks found"}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : pendingTasks.length === 0 
                ? "All tasks have been started or completed!" 
                : "No pending tasks match your search"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                    {task.title}
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-medium px-3 py-1 text-xs shrink-0">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
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
                        {task.assignedTo === currentUser?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
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
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
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

                    {/* Time since creation */}
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-gray-500">Waiting for:</span>
                        <span className="ml-2 font-medium text-amber-700">
                          {Math.floor((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Only show if user is team lead or assigned to task */}
                  {(currentUser?.role === "team_lead" || task.assignedTo === currentUser?.id) && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-[120px]"
                          onClick={() => handleStatusChange(task.id, "in_progress")}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Task
                        </Button>

                        {task.assignedTo === currentUser?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleStatusChange(task.id, "completed")}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Complete
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
                                <AlertDialogTitle>Delete Pending Task</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the pending task "{task.title}"? 
                                  This action cannot be undone and will permanently remove the task 
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
          ))}
        </div>
      )}
    </div>
  );
}