import { Outlet } from "react-router-dom";
import "../styles/Dashboard.css";

const StudentLayout = () => {
  return (
    <div className="dashboard-shell min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold">
          HM Dance Studio - Student
        </h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;