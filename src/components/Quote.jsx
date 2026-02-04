import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Icons for the discreet utility menu
import { 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/outline";

// Individual Step Components
import StepDesignType from "./StepDesignType";
import StepGeometry from "./StepGeometry"; 
import StepFrame from "./StepFrame"; 
import StepFabricAndLighting from "./StepFabricAndLighting";
import StepAcoustics from "./StepAcoustics";
import StepLogistics from "./StepLogistics"; 
import QuoteSummary from "./QuoteSummary";

const STEPS = [
  { key: "DESIGN", component: StepDesignType },
  { key: "GEOMETRY", component: StepGeometry }, 
  { key: "FRAME", component: StepFrame },
  { key: "FABRIC_LIGHT", component: StepFabricAndLighting },
  { key: "ACOUSTICS", component: StepAcoustics },
  { key: "LOGISTICS", component: StepLogistics },
  { key: "SUMMARY", component: QuoteSummary },
];

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quote, setQuote] = useState(null);
  const [quoteId, setQuoteId] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const StepComponent = STEPS[currentStep].component;

  /**
   * Global update function
   * Maintains data persistence across steps
   */
  const updateQuote = (data) => {
    setQuote((prev) => ({
      ...prev,
      ...data,
      updatedAt: new Date(),
    }));
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen font-sans bg-gray-50/50 flex flex-col">
      
      {/* MINIMALIST UTILITY HEADER */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]"></div>
           <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
               System Terminal
             </span>
             <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
               User: {user?.email}
             </span>
           </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Admin Portal - Discrete Link */}
          {user?.role === "admin" && (
            <button 
              onClick={() => navigate("/admin")}
              className="group flex items-center gap-2 text-gray-400 hover:text-black transition-all"
            >
              <Cog6ToothIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Management</span>
            </button>
          )}

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Configuration Interface */}
      <div className="bg-white border border-gray-200 shadow-sm min-h-[600px] p-6 md:p-16 relative overflow-hidden flex flex-col">
        
        {/* Step Counter: A more "backend" way to show progress without a bar */}
        <div className="absolute top-6 left-6">
          <span className="text-[10px] font-mono text-gray-300">
            LOG_STEP: 0{currentStep + 1} / 0{STEPS.length}
          </span>
        </div>

        {/* Subtle Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none select-none">
          <h1 className="text-9xl font-black uppercase transform rotate-12">OneFrame</h1>
        </div>

        <div className="relative z-10 flex-1">
          <StepComponent
            quote={quote}
            setQuote={setQuote}
            updateQuote={updateQuote}
            onNext={nextStep}
            onBack={prevStep}
            setQuoteId={setQuoteId}
            quoteId={quoteId}
          />
        </div>
      </div>

      {/* Persistence Status */}
      {quote && (
        <div className="mt-6 flex justify-between items-center px-4">
          <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">
            State: <span className="text-green-500">Live_Sync</span>
          </p>
          <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">
            Object_ID: <span className="text-black">{quoteId || "Wait..."}</span>
          </p>
        </div>
      )}
    </div>
  );
}