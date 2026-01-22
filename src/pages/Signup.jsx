import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebase"; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { motion } from "framer-motion";
import { UserPlusIcon, LockClosedIcon, EnvelopeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import heroImage from "../assets/hero.png";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Security credentials do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
        company: "", 
        status: "active",
        quotesCount: 0
      });

      navigate("/quote");
    } catch (err) {
      setError(err.message || "Failed to initialize account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* LHS Section: Now visible on all screens (Top on Mobile, Left on Desktop) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full lg:w-1/2 bg-[#F8F8F8] flex items-center justify-center p-8 lg:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100"
      >
        <div className="max-w-xs lg:max-w-md text-center">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={heroImage}
            alt="OneFrame Logo" 
            className="w-48 lg:w-full h-auto mx-auto object-contain mb-6 lg:mb-8 grayscale"
          />
          <div className="space-y-1 lg:space-y-2">
            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">System Registration</p>
            <h1 className="text-xl lg:text-2xl font-black text-black uppercase tracking-tighter text-balance">Request Specification Access</h1>
          </div>
        </div>
      </motion.div>

      {/* RHS Section: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter mb-2">Create Account</h2>
            <div className="h-1.5 w-16 bg-black" />
          </div>

          <form onSubmit={handleSignup} className="space-y-5 lg:space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2 lg:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <EnvelopeIcon className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-3 lg:p-4 font-bold transition-all text-sm"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2 lg:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <LockClosedIcon className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-3 lg:p-4 font-bold transition-all text-sm"
              />
            </div>

            <div className="space-y-2 lg:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <CheckBadgeIcon className="w-3 h-3" /> Confirm Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-3 lg:p-4 font-bold transition-all text-sm"
              />
            </div>

            <div className="pt-2 lg:pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white p-4 lg:p-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0D004C]'}`}
              >
                {loading ? "Initializing..." : "Register"}
                {!loading && <UserPlusIcon className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-100">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest text-center lg:text-left">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-black hover:underline decoration-2 underline-offset-8 transition ml-2">
                Sign In Now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}