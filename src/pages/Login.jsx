import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRightIcon, LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import heroImage from "../assets/hero.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // Directly navigating to quote page as per Jacq's requirement
      navigate("/quote");
    } catch (err) {
      let msg = "Authentication failed. Please verify your credentials.";
      if (err.code === "auth/user-not-found") msg = "Account not discovered.";
      else if (err.code === "auth/wrong-password") msg = "Invalid security credentials.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side: Logo/Hero Section (LHS) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex w-1/2 bg-[#F8F8F8] items-center justify-center p-12 border-r-2 border-gray-100"
      >
        <div className="max-w-md text-center">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src ={heroImage} 
            alt="OneFrame Logo" 
            className="w-full h-auto object-contain mb-8 grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Specifying Excellence</p>
            <h1 className="text-2xl font-black text-black uppercase tracking-tighter">Internal Specification Portal</h1>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Login Box (RHS) */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Sign In</h2>
            <div className="h-1.5 w-16 bg-black" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <EnvelopeIcon className="w-3 h-3" /> Email Identity
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all placeholder:text-gray-300 text-sm"
                placeholder="name@oneframe.co.nz"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <LockClosedIcon className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all placeholder:text-gray-300 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-black text-white p-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#0D004C] transition-all shadow-[8px_8px_0px_0px_rgba(13,0,76,0.2)] active:translate-y-1 active:shadow-none"
              >
                Access System 
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Authorized Personnel Only.
            </p>
            <Link to="/signup" className="text-[10px] text-black font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
              Request System Access
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}