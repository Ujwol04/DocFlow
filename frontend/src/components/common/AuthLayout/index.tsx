import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@Components/common/ThemeToggle";
import { AppSidebar } from "@Components/HOC/AppSidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarProvider,
  SidebarTrigger,
} from "@Components/index";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();
  const { logout: clearAuth, user } = useAuth();

  async function logoutUser(): Promise<void> {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch {
      clearAuth();
      navigate("/login");
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <>
      <SidebarProvider className="">
        <AppSidebar />
        <main className="min-w-0 flex-1">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-background z-50">
            <SidebarTrigger className="" />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center cursor-pointer gap-2">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>
                      <span className="text-primary">{initials}</span>
                    </AvatarFallback>
                  </Avatar>

                  <section className="flex flex-col text-xs">
                    <span className="font-semibold text-left">
                      {user?.name ?? "Guest"}
                    </span>
                    <span className="text-left text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </section>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="capitalize">
                    {user?.name || "Settings"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={`/change-password`}>Change Password</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={`/activity-log`}>Activity Log</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutUser}
                    className={`w-full ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}