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
} from "@Components/index";
import { ChevronRight, Home, FileStack, FileText } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

interface ItemsType {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  dropdown?: {
    title: string;
    url: string;
    icon: React.ComponentType<any>;
    notify?: number;
  }[];
  notify?: number;
  permissions?: string[];
}

export function AppSidebar() {
  const pathname = useLocation().pathname;
  // const { toggleSidebar } = useSidebar();

  const [openDropdowns, setOpenDropdowns] = React.useState<boolean[]>([]);

  const handleDropdownToggle = useCallback((idx: number) => {
    setOpenDropdowns((prev) => {
      const newState = [...prev];
      newState[idx] = !newState[idx];
      return newState;
    });
  }, []);

  const items: ItemsType[] = useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Templates",
        url: "/templates",
        icon: FileStack,
      },
      {
        title: "Documents",
        url: "/documents",
        icon: FileText,
      },
    ],
    [],
  );

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(itemUrl);
  };

  return (
    <Sidebar className="h-screen">
      <SidebarContent className="sidebar-content">
        <SidebarGroup>
          <SidebarGroupLabel className="p-4 flex items-center h-20 justify-center sticky top-2 bg-sidebar z-20 border-b border-sidebar-border">
            <div className="text-lg font-semibold text-sidebar-foreground">
              DocFlow
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2 p-2">
            <SidebarMenu>
              {items?.map((item: ItemsType, idx: number) => (
                <SidebarMenuItem key={item.title}>
                  {item.dropdown ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => handleDropdownToggle(idx)}
                        isActive={isActive(item.url)}
                        className={`${
                          isActive(item.url)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                        } rounded-lg transition-colors`}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.title}
                        {item?.dropdown?.some(
                          (subItem) => subItem.notify && subItem.notify > 0,
                        ) && !openDropdowns[idx] ? (
                          <span className="text-secondary bg-accent rounded-sm w-2 h-2"></span>
                        ) : (
                          " "
                        )}
                        <ChevronRight
                          className={`h-5 w-5 ml-auto transition-transform ${
                            openDropdowns[idx] ? "rotate-90" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                      {openDropdowns[idx] && (
                        <SidebarMenu className="mt-2">
                          {item.dropdown.map((subItem: any) => (
                            <SidebarMenuItem key={subItem.title}>
                              <Link to={subItem.url}>
                                <SidebarMenuButton
                                  isActive={isActive(subItem.url)}
                                  className={`${
                                    isActive(subItem.url)
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                                  } rounded-lg transition-colors justify-between`}
                                >
                                  <span className="flex items-center">
                                    <subItem.icon className="h-5 w-5 mr-2" />
                                    {subItem.title}
                                  </span>
                                  {subItem?.notify && subItem.notify > 0 ? (
                                    <span className="text-secondary bg-accent px-1 min-w-4 text-center rounded-sm">
                                      {subItem.notify}
                                    </span>
                                  ) : null}
                                </SidebarMenuButton>
                              </Link>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      )}
                    </>
                  ) : (
                    <Link to={item.url} key={idx}>
                      <SidebarMenuButton
                        isActive={isActive(item.url)}
                        className={`${
                          isActive(item.url)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                        } rounded-lg transition-colors justify-between`}
                      >
                        <span className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </span>
                        {item?.notify && item.notify > 0 ? (
                          <span className="text-secondary bg-accent px-1 min-w-4 text-center rounded-sm">
                            {item.notify}
                          </span>
                        ) : null}
                      </SidebarMenuButton>
                    </Link>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 flex items-center justify-center">
        <div className="text-sm font-semibold text-sidebar-foreground">
           DocFlow-v1
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}