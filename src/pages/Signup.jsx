import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { UserPlusIcon, LockClosedIcon, EnvelopeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Security credentials do not match.");
      return;
    }
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-stretch bg-white">
      {/* Left Side: Sustainability & Brand Message */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center p-20"
      >
        <div className="absolute inset-0 opacity-10">
          {/* Subtle Grid Pattern to represent framing */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        </div>
        
        <div className="relative z-10 max-w-md">
          <span className="text-[#0D004C] font-black tracking-[0.5em] uppercase text-xs">Sustainability First</span>
          <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mt-4 mb-8">
            Join the <br />
            <span className="text-gray-500 italic">Evolution.</span>
          </h1>
          <p className="text-gray-400 font-medium leading-relaxed">
            Become a partner in New Zealand’s most sustainable architectural fabric ecosystem. Access 2nd Thread™ circularity programs and high-performance specifications.
          </p>
          
          <div className="mt-12 space-y-4">
            {["NZ Made Systems", "Certified Acoustics", "Sustainable Materials"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/70 text-xs font-black uppercase tracking-widest">
                <CheckBadgeIcon className="w-5 h-5 text-[#0D004C]" /> {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Create Account</h2>
            <div className="h-1 w-12 bg-[#0D004C]" />
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <EnvelopeIcon className="w-3 h-3" /> Professional Email
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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <LockClosedIcon className="w-3 h-3" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <CheckBadgeIcon className="w-3 h-3" /> Confirm
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-[#0D004C] transition-all shadow-2xl group"
              >
                Register Account
                <UserPlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            Already registered?{" "}
            <Link to="/login" className="text-black font-black uppercase tracking-tighter hover:text-[#0D004C] transition underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}