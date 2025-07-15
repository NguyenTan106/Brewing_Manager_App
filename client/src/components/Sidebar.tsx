import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaHome, FaBoxOpen, FaCog } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { GiBeerStein } from "react-icons/gi";
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { path: "/", icon: <FaHome />, label: "Trang chủ" },
  { path: "/ingredients", icon: <FaBoxOpen />, label: "Nguyên liệu" },
  { path: "/batch", icon: <GiBeerStein />, label: "Mẻ nấu" },
  { path: "/settings", icon: <FaCog />, label: "Cài đặt" },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div
      style={{
        width: isCollapsed ? "72px" : "220px",
        backgroundColor: "#f8f9fa",
        padding: "20px 10px",
        borderRight: "1px solid #dee2e6",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: isCollapsed ? "center" : "stretch",
      }}
    >
      {/* Header */}
      <div
        className={`d-flex ${
          isCollapsed ? "justify-content-center" : "justify-content-between"
        } align-items-center mb-4 w-100`}
      >
        {!isCollapsed && <h5 className="fw-bold mb-0">Quản lý kho</h5>}
        <IoMenu
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={toggleSidebar}
        />
      </div>

      {/* Nav items */}

      <Nav className="flex-column gap-2 ">
        {navItems.map(({ path, icon, label }) => (
          <OverlayTrigger
            key={path}
            placement="right"
            overlay={isCollapsed ? <Tooltip>{label}</Tooltip> : <></>}
          >
            <NavLink
              to={path}
              className={({ isActive }) =>
                `d-flex align-items-center px-2 py-2 rounded text-decoration-none ${
                  isActive ? "bg-primary text-white" : "text-dark"
                }`
              }
              style={{
                whiteSpace: "nowrap",
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "30px",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                {icon}
              </div>
              {!isCollapsed && <span className="">{label}</span>}
            </NavLink>
          </OverlayTrigger>
        ))}
      </Nav>
    </div>
  );
}
