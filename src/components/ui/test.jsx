"use client";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "sonner";
import {Label} from "@/components/ui/label";
// zod schema

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email address",
  }),

  password: z.string().min(8, {
    message: "Password must be 8 characters long.",
  }),
});

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    console.log("Form submitted with the following data", data);
    toast("Logged In Successfulyyyyyyy");
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
        <h1 className="text-3xl text-center font-bold">Login</h1>

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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
     
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
