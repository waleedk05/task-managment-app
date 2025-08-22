"use client";
import React from "react";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar";
import useAuth from "@/hooks/useAuth";
import {Button} from "@/components/ui/button";

export default function DashboardLayout({children}) {
  const {currentUser, loading, logout} = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return null; // useAuth will handle redirect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="border-b p-4 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">Welcome, {currentUser?.name || "User"}!</h1>
              </div>
            </div>

            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </header>

          {/* Main Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
