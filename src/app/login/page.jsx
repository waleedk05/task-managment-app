"use client";
import React, {useState} from "react";
import {email, z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Loader2Icon} from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email address",
  }),

  password: z.string().min(8, {
    message: "Password must be 8 characters long.",
  }),
});

export default function CardDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      const user = existingUsers.find((user) => user.email === data.email);

      if (!user) {
        form.setError("email", {
          type: "manual",
          message: "No account found with this email address",
        });
        setIsLoading(false);
        return;
      }

      if (user.password !== data.password) {
        form.setError("password", {
          type: "manual",
          message: "Invalid Password",
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));

      form.reset();

      console.log("Form submitted with the following data", data);
      console.log("Form submitted with the following data", user);

      setTimeout(() => {
        if (user.role == "team_lead") {
          router.push("/dashboard/all-tasks");
        } else if (user.role == "team_member") {
          router.push("/dashboard/all-tasks");
        } else {
          router.push("/login");
        }
      }, 1500);

      toast.success(`Welcome Back, ${user.name}`);
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Login failed. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
              {isLoading ? (
                <Button size="sm" disabled className="w-full">
                  <Loader2Icon className="animate-spin" />
                  Logging in ...
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Login
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p>
            Already have an account?{" "}
            <a href="/signup" className="hover:text-blue-500 cursor-pointer">
              Signup
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
