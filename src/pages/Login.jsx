import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRightIcon, LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

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
      navigate("/");
    } catch (err) {
      let msg = "Authentication failed. Please verify your credentials.";
      if (err.code === "auth/user-not-found") msg = "Account not discovered.";
      else if (err.code === "auth/wrong-password") msg = "Invalid security credentials.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-stretch bg-white">
      {/* Left Side: Brand Visual (Hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-1/2 bg-[#0D004C] relative overflow-hidden items-center justify-center p-20"
      >
        <div className="absolute inset-0 opacity-20">
            {/* Architectural Grid Pattern */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Access <br />
            <span className="opacity-50">The Portal.</span>
          </h1>
          <p className="mt-6 text-indigo-200 font-medium max-w-sm">
            Manage your architectural specifications and custom fabric tension configurations.
          </p>
        </div>
      </motion.div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Login</h2>
            <div className="h-1 w-12 bg-[#0D004C]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-xs font-bold uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <EnvelopeIcon className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all placeholder:text-gray-200"
                placeholder="architect@studio.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <LockClosedIcon className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all placeholder:text-gray-200"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-[#0D004C] transition-all shadow-2xl group"
              >
                Authenticate 
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            New to OneFrame?{" "}
            <Link to="/signup" className="text-black font-black uppercase tracking-tighter hover:text-[#0D004C] transition underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}