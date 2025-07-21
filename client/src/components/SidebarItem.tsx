// SidebarItem.tsx
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

export const SidebarItem = ({ icon: Icon, label, to }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2 w-full text-left text-sm rounded-md transition-all",
        isActive
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:bg-muted"
      )
    }
  >
    <Icon className="w-4 h-4" />
    {label}
  </NavLink>
);
