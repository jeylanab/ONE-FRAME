import { useState } from "react";
import ProgressBar from "../components/ProgressBar";

// Individual Step Components
import StepIntro from "./StepIntro";
import StepDesignType from "./StepDesignType";
import StepGeometry from "./StepGeometry"; // Merged Shape + Measurements
import StepFrame from "./StepFrame";       // Now includes Corners logic
import StepFabric from "./StepFabric";
import StepLightingAndDriver from "./StepLightingAndDriver"; // Merged Lighting + Controls
import StepAcoustics from "./StepAcoustics";
import StepLogistics from "./StepLogistics"; // Merged Prebuild + Freight
import QuoteSummary from "./QuoteSummary";

const STEPS = [
  { key: "INTRO", label: "Intro", component: StepIntro },
  { key: "DESIGN", label: "Design Type", component: StepDesignType },
  { key: "GEOMETRY", label: "Shape & Size", component: StepGeometry }, 
  { key: "FRAME", label: "Frame & Corners", component: StepFrame },
  { key: "FABRIC", label: "Fabric & Finish", component: StepFabric },
  { key: "ELECTRICAL", label: "Lighting & Controls", component: StepLightingAndDriver },
  { key: "ACOUSTICS", label: "Acoustics", component: StepAcoustics },
  { key: "LOGISTICS", label: "Delivery & Setup", component: StepLogistics },
  { key: "SUMMARY", label: "Final Quote", component: QuoteSummary },
];

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quote, setQuote] = useState(null);
  const [quoteId, setQuoteId] = useState(null);

  const StepComponent = STEPS[currentStep].component;

  /**
   * Global update function
   * This maintains price continuity by allowing any step to inject 
   * new data into the master 'quote' object without wiping previous steps.
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen font-sans bg-gray-50/50">
      <div className="mb-10">
        <ProgressBar
          steps={STEPS.map((s) => s.label)}
          currentStep={currentStep}
        />
      </div>

      {/* Main Container with dynamic height for different step content sizes */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 min-h-[550px] p-6 md:p-12 transition-all duration-500 ease-in-out">
        <StepComponent
          quote={quote}
          setQuote={setQuote}      // Initializer (StepIntro)
          updateQuote={updateQuote}  // Continuity manager (All steps)
          onNext={nextStep}
          onBack={prevStep}
          setQuoteId={setQuoteId}
          quoteId={quoteId}
        />
      </div>

      {/* Footer / Status Indicator */}
      {quote && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <div className="h-[1px] w-12 bg-gray-200"></div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Syncing Draft: <span className="text-indigo-500">{quoteId || "connecting..."}</span>
          </p>
          <div className="h-[1px] w-12 bg-gray-200"></div>
        </div>
      )}
    </div>
  );
}