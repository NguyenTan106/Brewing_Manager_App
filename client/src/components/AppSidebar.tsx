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

const items = [
  { title: "Home", path: "/", icon: House },
  { title: "Nguyên liệu", path: "/ingredients", icon: Boxes },
  { title: "Mẻ nấu", path: "/batchs", icon: FlaskConical },
  { title: "Công thức", path: "/recipes", icon: ClipboardList },
  { title: "Nhật kí hoạt động", path: "/activity-logs", icon: NotebookText },
  { title: "Quản lí", path: "/users", icon: Users },
  { title: "Cài đặt", path: "/settings", icon: Settings },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h3 className="font-bold">📦 Quản lí kho</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full">
              Chọn workspace <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem>Acme Inc</DropdownMenuItem>
            <DropdownMenuItem>Acme Corp</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <Separator className="my-2" />

      <SidebarContent>
        {items.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            label={item.title}
            to={item.path}
          />
        ))}
      </SidebarContent>

      <Separator className="my-2" />

      <SidebarFooter>
        <SidebarItem icon={Settings} label="Cài đặt tài khoản" to="/settings" />
      </SidebarFooter>
    </Sidebar>
  );
}
