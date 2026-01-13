import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/oneframe.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "Quote", path: "/quote" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  if (user?.role === "admin") {
    links.push({ name: "Admin", path: "/admin" });
  }

  return (
    <div className="w-full py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white/90 rounded-full px-8 py-4 flex items-center justify-between shadow-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="OneFrame" className="h-9 w-auto" />
          <span className="font-semibold text-lg text-[#0D004C]">OneFrame</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {links.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-[#3D85C6] transition">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <span className="text-gray-500 text-sm">Loading...</span>
          ) : user ? (
            <>
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-full bg-[#050912] text-white font-semibold hover:bg-[#1f3a8a] transition shadow-md"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 rounded-full bg-[#3D85C6] text-white font-semibold hover:bg-[#2f6bb3] transition shadow-md"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#0D004C] focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto mt-4 bg-white rounded-3xl shadow-lg overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-sm font-medium text-gray-700">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="hover:text-[#3D85C6] transition"
                >
                  {link.name}
                </Link>
              ))}

              {loading ? (
                <span className="text-gray-500 text-sm">Loading...</span>
              ) : user ? (
                <button
                  onClick={async () => {
                    await logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  className="mt-4 px-6 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="mt-4 px-6 py-3 rounded-full bg-[#050912] text-white font-semibold hover:bg-[#1f3a8a] transition shadow-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/signup");
                    }}
                    className="mt-4 px-6 py-3 rounded-full bg-[#3D85C6] text-white font-semibold hover:bg-[#2f6bb3] transition shadow-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
