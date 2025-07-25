import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "@tanstack/react-router"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data. Use route paths instead of URLs.
const data = {
    navMain: [
        {
            title: "Sales",
            to: "/sales",
            items: [
                {
                    title: "Add Sales Record",
                    to: "/employee/add-sales",
                    isActive: false,
                },
                {
                    title: "All Sales Record",
                    to: "/employee/",
                    isActive: false,
                },
            ],
        },
        {
            title: "Me",
            items: [
                {
                    title: "My Profile",
                    to: "/employee/profile",
                    isActive: false,
                },
                {
                    title: "Apply For Leave",
                    to: "/employee/apply-Leave",
                    isActive: false,
                }
            ],
        },
        {
            title: "Notifications",
            items: [
                {
                    title: "Inbox",
                    to: "/employee/notifications",
                    isActive: false,
                }
            ],
        },
    ],
}

export function EmployeeDashboard({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Employee DashBoard</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.to} className="font-medium">
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                                                    <Link to={subItem.to}>{subItem.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
