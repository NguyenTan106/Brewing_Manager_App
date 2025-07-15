import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
