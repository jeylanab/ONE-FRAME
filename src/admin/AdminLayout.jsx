import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  HomeIcon, CubeIcon, RectangleStackIcon, BeakerIcon, 
  Squares2X2Icon, Cog6ToothIcon, ArchiveBoxIcon, SunIcon, 
  SpeakerWaveIcon, TruckIcon, ClipboardDocumentCheckIcon, 
  TableCellsIcon, Bars3Icon, XMarkIcon 
} from "@heroicons/react/24/outline";
import AdminRoutes from "./AdminRoutes";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Design Type", path: "design-type", icon: CubeIcon },
    { name: "Shape", path: "shape", icon: RectangleStackIcon },
    { name: "Set Up", path: "setup", icon: RectangleStackIcon },
    { name: "Corners", path: "corners", icon: Squares2X2Icon },
    { name: "Frame", path: "frame", icon: BeakerIcon },
    { name: "Fabric", path: "fabric", icon: Cog6ToothIcon },
    { name: "Lighting", path: "lighting", icon: SunIcon },
    { name: "Controls", path: "controls", icon: SunIcon },
    { name: "Acoustics", path: "acoustics", icon: SpeakerWaveIcon },
    { name: "Prebuild", path: "prebuild", icon: ArchiveBoxIcon },
    { name: "Freight", path: "freight", icon: TruckIcon },
    { name: "User", path: "user", icon: TableCellsIcon },
  ];

  // Helper to get current page title from path
  const currentTitle = links.find(l => location.pathname.includes(l.path))?.name || "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 transform 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static 
        ${collapsed ? "lg:w-20" : "lg:w-72"} 
        bg-indigo-700 text-white shadow-2xl`}
      >
        <div className="flex items-center justify-between p-5 border-b border-indigo-500/30">
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white">ONEFRAME</span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-200">Admin Control</span>
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-indigo-800 transition"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link, idx) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={`/admin/${link.path}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-lg font-bold"
                      : "hover:bg-indigo-800/50 text-indigo-100"
                  }`
                }
              >
                <Icon className={`w-6 h-6 shrink-0 ${collapsed ? "mx-auto" : ""}`} />
                {(!collapsed || mobileOpen) && (
                  <div className="flex flex-col">
                    <span className="text-sm truncate">{link.name}</span>
                    <span className="text-[10px] opacity-50 font-normal">Section {idx + 1}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              {currentTitle}
            </h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-400 uppercase">System Status</p>
              <p className="text-sm font-bold text-green-500 flex items-center gap-1 justify-end">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
              </p>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full">
          {/* Welcome Dashboard Text (Only show on specific routes if desired) */}
          <div className="mb-8 p-6 bg-gradient-to-r from-white to-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-indigo-900">Welcome back, Administrator</h2>
            <p className="text-sm text-indigo-600 opacity-80">
              Manage your technical specifications, inventory pricing, and user logistics. 
              Any changes made here will update the quote engine in real-time.
            </p>
          </div>

          {/* Actual Route Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[60vh] p-4 sm:p-6">
            <AdminRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}