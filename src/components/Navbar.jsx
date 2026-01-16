import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/oneframe.png";
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  ShieldCheckIcon,
  XMarkIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { user, logout, updatePassword, loading } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "Quote", path: "/quote" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    setMessage({ type: "", text: "" });
    try {
      await updatePassword(newPassword);
      setMessage({ type: "success", text: "Security credentials updated." });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update. Re-login required." });
    }
    setLoadingAction(false);
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-white border-b-2 border-black">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="OneFrame" className="h-8 w-auto grayscale" />
          <span className="font-black text-xl tracking-tighter text-black uppercase">OneFrame</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          {links.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-black transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-100 animate-pulse"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 bg-white px-4 py-2 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black text-black truncate max-w-[120px] uppercase leading-tight">{user.email.split('@')[0]}</p>
                  <p className="text-[8px] uppercase tracking-widest text-gray-400 font-black">{user.role}</p>
                </div>
                <UserCircleIcon className="w-5 h-5 text-black" />
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden py-2"
                  >
                    <div className="px-4 py-2 mb-2 border-b-2 border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Operator</p>
                        <p className="text-xs font-bold text-black truncate">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <button onClick={() => { navigate("/admin"); setUserMenuOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition">
                        <Cog6ToothIcon className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { setShowPasswordModal(true); setUserMenuOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition">
                      <ShieldCheckIcon className="w-4 h-4 text-green-600" /> Security Info
                    </button>
                    <button onClick={async () => { await logout(); navigate("/"); setUserMenuOpen(false); }} className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition border-t-2 border-gray-50">
                      <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigate("/login")} className="px-6 py-2 text-[10px] font-black text-black border-2 border-transparent hover:border-black uppercase tracking-widest transition">LOGIN</button>
              <button onClick={() => navigate("/signup")} className="px-6 py-2 text-[10px] font-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest transition">JOIN FREE</button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-black border-2 border-black ml-4">
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t-2 border-black overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {links.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setOpen(false)} className="text-xl font-black uppercase tracking-tighter text-black border-b border-gray-100 pb-2">
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 space-y-4">
                  <div className="bg-gray-50 p-4 border-l-4 border-black">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active User</p>
                    <p className="font-bold text-black">{user.email}</p>
                  </div>
                  <button onClick={() => { setShowPasswordModal(true); setOpen(false); }} className="w-full text-left font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" /> Update Security
                  </button>
                  <button onClick={async () => { await logout(); navigate("/"); setOpen(false); }} className="w-full text-left font-black text-xs uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4">
                  <button onClick={() => { navigate("/login"); setOpen(false); }} className="w-full py-4 border-2 border-black font-black uppercase tracking-widest text-[10px]">Login</button>
                  <button onClick={() => { navigate("/signup"); setOpen(false); }} className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-[10px]">Join Free</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal (Same as your code) */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md p-10 border-4 border-black relative">
              <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition"><XMarkIcon className="w-6 h-6 text-black" /></button>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-2">Security</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border-b-4 border-gray-100 focus:border-black outline-none py-4 font-bold text-lg transition-all" placeholder="New Password" />
                <button disabled={loadingAction} type="submit" className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0D004C] transition-all">
                  {loadingAction ? "Processing..." : "Confirm Update"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}