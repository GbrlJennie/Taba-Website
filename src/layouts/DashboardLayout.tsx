import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, BookOpen, FileQuestion, GraduationCap, LogOut, Home } from "lucide-react";

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/dashboard/course", icon: BookOpen, label: "Course" },
    { to: "/dashboard/quiz", icon: FileQuestion, label: "Quiz" },
    { to: "/dashboard/rapor", icon: GraduationCap, label: "Rapor" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Taba Web</h1>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-indigo-600 mt-1">Student</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}