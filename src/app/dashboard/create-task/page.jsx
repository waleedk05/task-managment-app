"use client";
import React, {useState, useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

const tasksFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().min(1, {
    message: "Description must not be empty",
  }),
  status: z.string().min(1, {
    message: "Please select a status",
  }),
  assignedTo: z.string().min(1, {
    message: "Task must be assigned to a user",
  }),
});

export default function CreateTaskPage() {
  const [statusOpen, setStatusOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);

  const router = useRouter();
  const {currentUser, loading, getUsersByRole} = useAuth();

  const statusTypes = [
    {label: "Pending", value: "pending"},
    {label: "In Progress", value: "in_progress"},
    {label: "Completed", value: "completed"},
  ];

  // Fix the useEffect to prevent infinite loop
  useEffect(() => {
    if (currentUser) {
      try {
        // Get only team members
        const teamMembers = getUsersByRole("team_member");

        // Fix the mapping to include value and label
        const formattedUsers = teamMembers.map((user) => ({
          label: `${user.name}`,
          value: user.id, // Use user ID as value
          name: user.name,
          email: user.email,
        }));

        setUsersList(formattedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Failed to load users");
      }
    }
  }, [currentUser]); // Remove the functions from dependencies

  const form = useForm({
    resolver: zodResolver(tasksFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      assignedTo: "",
    },
  });

  async function onSubmit(data) {
    try {
      const tasksData = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        status: data.status,
        assignedTo: data.assignedTo, // Fix: Use assignedTo, not status
        createdBy: currentUser.id, // Store user ID instead of name
        createdByName: currentUser.name, // Also store name for display
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      existingTasks.push(tasksData);
      localStorage.setItem("tasks", JSON.stringify(existingTasks));

      console.log("Task successfully created:", tasksData);
      toast.success("Task created successfully!");

      // Reset form and close dropdowns
      form.reset();
      setStatusOpen(false);
      setUserOpen(false);

      // Optional: Redirect after success
      // setTimeout(() => {
      //   router.push("/dashboard/all-tasks");
      // }, 1500);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  // Only allow team leads to create tasks
  if (currentUser?.role !== "team_lead") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">Only team leads can create tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <h1 className="text-center font-bold text-3xl">Create Task</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Combobox - Fix the open state */}
            <FormField
              control={form.control}
              name="status"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Task Status</FormLabel>
                  <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value
                            ? statusTypes.find((status) => status.value === field.value)?.label
                            : "Select status"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0">
                      <Command>
                        <CommandGroup>
                          {statusTypes.map((status) => (
                            <CommandItem
                              value={status.label}
                              key={status.value}
                              onSelect={() => {
                                form.setValue("status", status.value);
                                setStatusOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  status.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {status.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Users Combobox */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign To</FormLabel>
                  <Popover open={userOpen} onOpenChange={setUserOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value
                            ? usersList.find((user) => user.value === field.value)?.label
                            : "Select user"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0">
                      <Command>
                        <CommandGroup>
                          {usersList.length === 0 ? (
                            <CommandItem disabled>No users available</CommandItem>
                          ) : (
                            usersList.map((user) => (
                              <CommandItem
                                value={user.label}
                                key={user.value}
                                onSelect={() => {
                                  form.setValue("assignedTo", user.value);
                                  setUserOpen(false);
                                }}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user.value === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.label}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
