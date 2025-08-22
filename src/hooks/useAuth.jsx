"use client";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("currentUser");

      if (!userData) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when user logs in from another tab or same tab)
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes in the same tab
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    } finally {
      setLoading(false);
    }
  };

  return {currentUser, loading, logout};
}
