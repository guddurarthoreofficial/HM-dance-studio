
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-7">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            HM Dance Studio Management Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs capitalize text-gray-500">
            {user?.role}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e5c3] font-bold text-gray-900">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
