import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold">HM Dance Studio - Admin</h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;