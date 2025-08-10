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
} from "@/components/ui/sidebar";
import {
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  House,
  Settings,
  Users,
  Boxes,
  FlaskConical,
  ClipboardList,
  Building2,
  Beer,
  ChevronDown,
  NotebookText,
  ChevronRight,
  BarChart3,
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
const EmptyIcon = () => null;
export default function AppSidebar() {
  const user = checkUser();
  const role = user?.role;
  const menuGroups = [
    {
      label: "Báo cáo & Thống kê",
      items: [
        { title: "Trang chủ", path: "/", icon: House },
        { title: "Thống kê mẻ", path: "/dashboard-batch", icon: BarChart3 },
      ],
    },
    {
      label: "Kho & Sản xuất",
      items: [
        { title: "Nguyên liệu", path: "/ingredients", icon: Boxes },
        { title: "Mẻ nấu", path: "/batchs", icon: FlaskConical },
        { title: "Công thức", path: "/recipes", icon: ClipboardList },
        { title: "Nhà cung cấp", path: "/suppliers", icon: Building2 },
        {
          title: "Sản phẩm bia",
          icon: Beer,
          children: [
            { title: "Danh mục sản phẩm", path: "/product-types" },
            { title: "Lô thành phẩm", path: "/beer-products" },
          ],
        },
      ],
    },
    {
      label: "Hệ thống",
      items: [
        {
          title: "Nhật kí hoạt động",
          path: "/activity-logs",
          icon: NotebookText,
        },
        ...(role === "SUPER_ADMIN"
          ? [{ title: "Quản lí người dùng", path: "/users", icon: Users }]
          : []),
        { title: "Cài đặt", path: "/settings", icon: Settings },
      ],
    },
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
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-0">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            {group.items.map((item, i) => {
              if (item.children) {
                return (
                  <Collapsible key={i} className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center w-full p-4 py-5 hover:bg-accent rounded-md text-base text-gray-500 hover:text-gray-900 group-data-[state=open]/collapsible:text-gray-900">
                        <item.icon className="mr-1" />
                        {item.title}
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 mt-1 space-y-1">
                      <SidebarMenuSub className="text-sm">
                        {item.children.map((child, j) => (
                          <SidebarItem
                            key={j}
                            icon={EmptyIcon}
                            label={child.title}
                            to={child.path}
                          />
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              return (
                <SidebarItem
                  key={i}
                  icon={item.icon}
                  label={item.title}
                  to={item.path}
                />
              );
            })}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* <SidebarItem icon={Settings} label="Cài đặt tài khoản" to="/settings" /> */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
