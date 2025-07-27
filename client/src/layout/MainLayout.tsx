import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
// import { Toaster } from "sonner";
export default function Layout() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        {/* Container ngang, chiếm toàn màn hình */}
        <AppSidebar />
        <SidebarTrigger className="w-10 h-10" />
        <main className="flex-1 pl-1 pt-14 p-10 overflow-auto ">
          <Outlet />
          {/* <Toaster
            position="top-right"
            richColors
            expand={true}
            closeButton
            toastOptions={{
              duration: 3000, // Thời gian hiển thị
            }}
          /> */}
        </main>
      </SidebarProvider>
    </div>
  );
}
