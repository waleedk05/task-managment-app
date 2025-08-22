"use client";
import React, {useState} from "react";
import {email, z} from "zod";
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

// Define the options for the Combobox
const roles = [
  {label: "Team Lead", value: "team_lead"},
  {label: "Team Member", value: "team_member"},
];

const signupFormSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  password: z.string().min(8, {
    message: "Password must be 8 characters long",
  }),
  role: z.string().min(1, {
    message: "Please select a role",
  }),
});

export default function SignUp() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(data) {
    try {
      const userData = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        createdAt: new Date().toISOString(),
      };

      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const userExists = existingUsers.find((user) => user.email === data.email);

      if (userExists) {
        alert("User with this email already exists!");
        return;
      }

      existingUsers.push(userData);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Optionally store current logged-in user
      localStorage.setItem("currentUser", JSON.stringify(userData));
      console.log("User successfully registered:", userData);

      toast("User registered successfully!");
      toast.success("User registered successfully!");

      // Reset the form using react-hook-form's reset method
      form.reset();

      // Optional: Reset the combobox state as well
      setOpen(false);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to register user. Please try again.");
    }
    console.log("Form submitted with the following data", data);
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <h1 className="text-center font-bold text-3xl">Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* The Combobox field */}
            <FormField
              control={form.control}
              name="role"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Role</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
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
                            ? roles.find((role) => role.value === field.value)?.label
                            : "Select role"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0">
                      <Command>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem
                              value={role.label}
                              key={role.value}
                              onSelect={() => {
                                form.setValue("role", role.value);
                                setOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  role.value === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {role.label}
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

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>

        <p className="text-center">
          Already have an account?{" "}
          <a href="/login" className="hover:text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
