
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/Dashboard.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/students": "Students",
    "/admin/admissions": "Admissions",
    "/admin/courses": "Courses",
    "/admin/packages": "Packages",
    "/admin/payments": "Payments",
    "/admin/certificates": "Certificates",
    "/admin/settings": "Settings",
  };

  const title = pageTitles[location.pathname] || "Admin Portal";

  return (
    <div className="dashboard-shell min-h-screen bg-gray-50">
      <Sidebar
        role="admin"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
