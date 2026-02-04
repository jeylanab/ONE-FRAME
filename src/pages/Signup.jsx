import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
      
      {/* LHS Section: 60% Width | Pure Black BG (Same as Login) */}
      <div className="w-full lg:w-[60%] bg-black flex items-center justify-center p-12">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={heroImage}
          alt="Logo" 
          // 'invert' makes the black logo white for visibility on black
          className="w-64 lg:w-[450px] h-auto object-contain invert"
        />
      </div>

      {/* RHS Section: 40% Width | Signup Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-20 bg-white border-l border-gray-100">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">Create Account</h2>
            <div className="h-1.5 w-16 bg-black" />
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-[10px] font-black uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <EnvelopeIcon className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all text-sm"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <LockClosedIcon className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <CheckBadgeIcon className="w-3 h-3" /> Confirm Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white outline-none p-4 font-bold transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white p-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
            >
              {loading ? "Initializing..." : "Register Account"}
              {!loading && <UserPlusIcon className="w-4 h-4" />}
            </button>
            <div className="pt-6 text-center">
  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
    Already have an account?{" "}
    <button
      type="button"
      onClick={() => navigate("/login")}
      className="text-black hover:underline transition"
    >
      Sign In Here
    </button>
  </span>
</div>

          </form>
          
        </motion.div>
      </div>
    </div>
  );
}