import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
export default function Layout() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        {/* Container ngang, chiếm toàn màn hình */}
        <AppSidebar />
        <main className="flex-1 p-4 overflow-auto">
          <SidebarTrigger className="w-10 h-10" />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
