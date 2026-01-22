import { useState } from "react";
import ProgressBar from "../components/ProgressBar";

// Individual Step Components
import StepIntro from "./StepIntro";
import StepDesignType from "./StepDesignType";
import StepGeometry from "./StepGeometry"; 
import StepFrame from "./StepFrame"; 
import StepFabricAndLighting from "./StepFabricAndLighting"; // THE NEW MERGED COMPONENT
import StepAcoustics from "./StepAcoustics";
import StepLogistics from "./StepLogistics"; 
import QuoteSummary from "./QuoteSummary";

const STEPS = [
  { key: "INTRO", label: "Intro", component: StepIntro },
  { key: "DESIGN", label: "Design Type", component: StepDesignType },
  { key: "GEOMETRY", label: "Shape & Size", component: StepGeometry }, 
  { key: "FRAME", label: "Structural", component: StepFrame },
  { key: "FABRIC_LIGHT", label: "Graphics & Light", component: StepFabricAndLighting }, // Merged Step
  { key: "ACOUSTICS", label: "Acoustics", component: StepAcoustics },
  { key: "LOGISTICS", label: "Logistics", component: StepLogistics },
  { key: "SUMMARY", label: "Final Quote", component: QuoteSummary },
];

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quote, setQuote] = useState(null);
  const [quoteId, setQuoteId] = useState(null);

  const StepComponent = STEPS[currentStep].component;

  /**
   * Global update function
   * Using the spread operator (...prev) ensures that when we add
   * Fabric data, we DON'T lose the Frame or Geometry data.
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

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 min-h-[550px] p-6 md:p-12 transition-all duration-500 ease-in-out">
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