import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      navigate("/quote");
    } catch (err) {
      setError("Authentication failed. Please verify your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
      
      {/* LHS: 60% Width | Pure Black BG */}
      <div className="w-full lg:w-[60%] bg-black flex items-center justify-center p-12">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={heroImage} 
          alt="Logo" 
          // 'invert' makes the black logo white to be visible on black background
          className="w-64 lg:w-[500px] h-auto object-contain invert"
        />
      </div>

      {/* RHS: 40% Width | Original Login Box Design */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-24 bg-white">
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
              <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
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
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all text-sm"
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
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
            >
              Access System 
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <div className="pt-6 text-center">
  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
    New here?{" "}
    <button
      type="button"
      onClick={() => navigate("/signup")}
      className="text-black hover:underline transition"
    >
      Create an account
    </button>
  </span>
</div>

          </form>

          {/* Text below login box removed as requested by Jacq */}
        </motion.div>
      </div>
    </div>
  );
}