
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/Dashboard.css";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    "/student/dashboard": "Dashboard",
    "/student/profile": "My Profile",
    "/student/packages": "My Packages",
    "/student/payments": "Payment History",
    "/student/certificates": "My Certificates",
    "/student/settings": "Settings",
  };

  return (
    <div className="dashboard-shell min-h-screen bg-gray-50">
      <Sidebar
        role="student"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeader
          title={pageTitles[location.pathname] || "Student Portal"}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
