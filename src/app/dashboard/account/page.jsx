"use client";
import React from "react";
import useAuth from "@/hooks/useAuth";
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
import {Label} from "@/components/ui/label";

export default function AccountPage() {
  const {currentUser, loading} = useAuth();
  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Name:</Label>
              <Input
                id="name"
                type="text"
                value={currentUser?.name || "Your Name"}
                readOnly
                required
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={currentUser?.email || "m@example.com"}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="text">Role:</Label>
              </div>
              <Input
                id="role"
                disabled
                type="text"
                value={currentUser?.role || ""}
                readOnly
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memberSince">Member Since:</Label>
              <Input
                id="memberSince"
                type="text"
                value={new Date(currentUser?.createdAt).toLocaleDateString() || ""}
                readOnly
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
