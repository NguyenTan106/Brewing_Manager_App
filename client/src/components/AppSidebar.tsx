import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  House,
  Settings,
  Users,
  Boxes,
  FlaskConical,
  ClipboardList,
  ChevronDown,
  NotebookText,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem"; // tách riêng component
import { NavUser } from "./NavUser";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { checkUser } from "./Auth/Check";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export default function AppSidebar() {
  const user = checkUser();
  const role = user?.role;
  const items = [
    { title: "Trang chủ", path: "/", icon: House },
    { title: "Nguyên liệu", path: "/ingredients", icon: Boxes },
    { title: "Mẻ nấu", path: "/batchs", icon: FlaskConical },
    { title: "Công thức", path: "/recipes", icon: ClipboardList },
    { title: "Nhật kí hoạt động", path: "/activity-logs", icon: NotebookText },
    // Chỉ hiển thị nếu là SUPER_ADMIN
    ...(role === "SUPER_ADMIN"
      ? [{ title: "Quản lí", path: "/users", icon: Users }]
      : []),
    { title: "Cài đặt", path: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="mt-2">
        <h2 className="font-bold text-2xl">📦 Quản lí kho</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full my-2 text-md">
              Chọn workspace <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem>Acme Inc</DropdownMenuItem>
            <DropdownMenuItem>Acme Corp</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <Separator className="" />

      <SidebarContent className="p-3">
        {items.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            label={item.title}
            to={item.path}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* <SidebarItem icon={Settings} label="Cài đặt tài khoản" to="/settings" /> */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
