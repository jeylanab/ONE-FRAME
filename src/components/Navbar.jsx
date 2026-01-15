import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/oneframe.png";
import { ChevronDownIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "Quote", path: "/quote" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="w-full sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="OneFrame" className="h-10 w-auto" />
          <span className="font-black text-xl tracking-tighter text-[#0D004C] uppercase">OneFrame</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-gray-500">
          {links.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-black transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-[11px] font-black text-[#0D004C] truncate max-w-[150px] leading-tight">{user.email}</p>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{user.role}</p>
                </div>
                <UserCircleIcon className="w-6 h-6 text-[#0D004C]" />
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden py-2"
                  >
                    {user.role === "admin" && (
                      <button 
                        onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Cog6ToothIcon className="w-5 h-5 text-indigo-500" />
                        Admin Dashboard
                      </button>
                    )}
                    <button 
                      onClick={async () => { await logout(); navigate("/"); setUserMenuOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigate("/login")} className="px-6 py-2.5 text-sm font-black text-black hover:bg-gray-50 rounded-xl transition">
                LOGIN
              </button>
              <button onClick={() => navigate("/signup")} className="px-6 py-2.5 text-sm font-black bg-black text-white rounded-xl shadow-lg hover:bg-[#0D004C] transition hover:scale-105 active:scale-95">
                JOIN FREE
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {links.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setOpen(false)} className="text-xl font-black text-[#0D004C]">
                  {link.name}
                </Link>
              ))}
              
              <div className="h-[1px] bg-gray-100 w-full" />

              {user ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{user.role}</p>
                    <p className="text-sm font-bold text-[#0D004C]">{user.email}</p>
                  </div>
                  {user.role === "admin" && (
                    <button onClick={() => {navigate("/admin"); setOpen(false);}} className="w-full p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold">
                      Admin Panel
                    </button>
                  )}
                  <button onClick={async () => {await logout(); setOpen(false); navigate("/");}} className="w-full p-4 bg-gray-50 text-gray-500 rounded-2xl font-bold">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button onClick={() => {navigate("/login"); setOpen(false);}} className="w-full p-4 border-2 border-black rounded-2xl font-black uppercase">Login</button>
                  <button onClick={() => {navigate("/signup"); setOpen(false);}} className="w-full p-4 bg-black text-white rounded-2xl font-black uppercase shadow-xl">Sign Up</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}