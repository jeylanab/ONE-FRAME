import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/oneframe.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          {["Home", "Quote", "Features", "Contact"].map((item) => (
            <a
              key={item}
              href={`${item.toLowerCase()}`}
              className="hover:text-[#3D85C6] transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <button className="hidden md:block px-6 py-3 rounded-full bg-[#050912] text-white font-semibold hover:bg-[#1f3a8a] transition shadow-md">
          Get a Quote
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#0D004C] focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
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
            <div className="flex flex-col p-6 gap-6 text-sm font-medium text-gray-700">
              {["Home", "Calculator", "Features", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="hover:text-[#3D85C6] transition"
                >
                  {item}
                </a>
              ))}

              <button className="mt-4 px-6 py-3 rounded-full bg-[#050912] text-white font-semibold hover:bg-[#1f3a8a] transition shadow-md">
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
