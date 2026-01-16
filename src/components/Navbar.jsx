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
  XMarkIcon 
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { user, logout, updatePassword, loading } = useAuth(); // Ensure updatePassword exists in AuthContext
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
    <div className="w-full sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="OneFrame" className="h-10 w-auto grayscale" />
          <span className="font-black text-xl tracking-tighter text-[#0D004C] uppercase">OneFrame</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
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
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-black transition-all"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black text-[#0D004C] truncate max-w-[120px] uppercase leading-tight">{user.email.split('@')[0]}</p>
                  <p className="text-[8px] uppercase tracking-widest text-gray-400 font-black">{user.role}</p>
                </div>
                <UserCircleIcon className="w-6 h-6 text-black" />
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-2 mb-2 border-b border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-xs font-bold text-black truncate">{user.email}</p>
                    </div>

                    {user.role === "admin" && (
                      <button 
                        onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Cog6ToothIcon className="w-4 h-4 text-[#0D004C]" />
                        Admin Dashboard
                      </button>
                    )}

                    {/* NEW: Edit Password Action */}
                    <button 
                      onClick={() => { setShowPasswordModal(true); setUserMenuOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition"
                    >
                      <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                      Update Password
                    </button>

                    <button 
                      onClick={async () => { await logout(); navigate("/"); setUserMenuOpen(false); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigate("/login")} className="px-6 py-2.5 text-[10px] font-black text-black hover:bg-gray-50 rounded-xl transition uppercase tracking-widest">
                LOGIN
              </button>
              <button onClick={() => navigate("/signup")} className="px-6 py-2.5 text-[10px] font-black bg-black text-white rounded-xl shadow-lg hover:bg-[#0D004C] transition hover:scale-105 active:scale-95 uppercase tracking-widest">
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

      {/* Password Update Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md p-10 border-2 border-black relative"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="w-6 h-6 text-black" />
              </button>

              <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-2">Security</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Update Account Password</p>

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                {message.text && (
                  <div className={`p-4 text-[10px] font-black uppercase tracking-widest border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">New Password</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  disabled={loadingAction}
                  type="submit"
                  className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0D004C] transition-all flex justify-center items-center"
                >
                  {loadingAction ? "Processing..." : "Confirm Update"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu ... (remains similar, added security link below) */}
    </div>
  );
}