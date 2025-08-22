import {
  Calendar,
  Inbox,
  Settings,
  Plus,
  Clock,
  Check,
  LogOut,
  User2,
  ChevronUp,
  Loader,
  User,
  BadgeCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// Menu items.

export function AppSidebar() {
  const {currentUser, loading, logout} = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Additional items for team leads
  const teamLeadItems = [
    {
      title: "Create Task",
      url: "/dashboard/create-task",
      icon: Plus,
    },
  ];

  const baseItems = [
    {
      title: "All Tasks",
      url: "/dashboard/all-tasks",
      icon: Calendar,
    },
    {
      title: "Completed Tasks",
      url: "/dashboard/completed-tasks",
      icon: Check,
    },
    {
      title: "Pending Tasks",
      url: "/dashboard/pending-tasks",
      icon: Clock,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };
  const menuItems =
    currentUser?.role === "team_lead" ? [...teamLeadItems, ...baseItems] : baseItems;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Task Managment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {" "}
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold">{currentUser?.name || "User"}</span>
                    <p className="text-sm text-gray-600">{currentUser?.email || "Email"}</p>
                  </div>

                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-popper-anchor-width] min-w-59">
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck color="black" />
                  <Link href="/dashboard/profile-settings">
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    // Prevent dropdown from closing
                    e.preventDefault();
                    handleLogout();
                  }}
                  disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <Loader className=" animate-spin" />
                  ) : (
                    <LogOut className=" text-red-500" />
                  )}
                  <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
