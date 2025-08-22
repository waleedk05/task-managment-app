"use client";
import React from "react";
import {useState, useEffect} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");

    if (!userData) {
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } catch (error) {
      console.log("Error getting user data", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return {currentUser, logout, loading};
}
