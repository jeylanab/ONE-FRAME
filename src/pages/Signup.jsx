import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebase"; // Ensure this path is correct
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { motion } from "framer-motion";
import { UserPlusIcon, LockClosedIcon, EnvelopeIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for UX
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
      // 1. Create the user in Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // 2. Create the 'users' document in Firestore using the Auth UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user", // Default role
        createdAt: serverTimestamp(),
        company: "", // Placeholder for architectural firm details
        status: "active",
        quotesCount: 0
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to initialize account.");
    } finally {
      setLoading(false);
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
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        </div>
        
        <div className="relative z-10 max-w-md">
          <span className="text-[#0D004C] font-black tracking-[0.5em] uppercase text-xs">Account Initialization</span>
          <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mt-4 mb-8">
            Start Your <br />
            <span className="text-gray-500 italic">Portfolio.</span>
          </h1>
          <p className="text-gray-400 font-medium leading-relaxed">
            By joining the OneFrame network, you gain access to our precision configurator and specialized 2nd Thread™ architectural data.
          </p>
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
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-2 text-center md:text-left">Register</h2>
            <div className="h-1 w-12 bg-[#0D004C] mx-auto md:mx-0" />
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all placeholder:text-gray-200 disabled:opacity-50"
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
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <CheckBadgeIcon className="w-3 h-3" /> Confirm
                </label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-100 focus:border-black outline-none py-3 font-bold transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl group ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0D004C]'}`}
              >
                {loading ? "Initializing..." : "Register Account"}
                {!loading && <UserPlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
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