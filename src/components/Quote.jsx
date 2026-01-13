import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import StepIntro from "./StepIntro";
import StepDesignType from "./StepDesignType";
import StepShape from "./StepShape";
import StepMeasurements from "./StepMeasurements";
import StepCorners from "./StepCorners";
import StepFrame from "./StepFrame";
import StepFabric from "./StepFabric";
import StepLighting from "./StepLightingAndDriver";
import StepAcoustics from "./StepAcoustics";
import StepPrebuild from "./StepPrebuild";
import StepFreight from "./StepFreight";
import QuoteSummary from "./QuoteSummary";


const STEPS = [
    { key: "INTRO", label: "Intro", component: StepIntro },
    { key: "DESIGN", label: "Design Type", component: StepDesignType },
    { key: "SHAPE", label: "Shape", component: StepShape },
    { key: "MEASUREMENTS", label: "Measurements", component: StepMeasurements },
    { key: "CORNERS", label: "Corners", component: StepCorners },
  { key: "FRAME", label: "Frame", component: StepFrame },
  { key: "FABRIC", label: "Fabric", component: StepFabric },
  { key: "LIGHTING", label: "Lighting and Controls", component: StepLighting },
  { key: "ACOUSTICS", label: "Acoustics", component: StepAcoustics },
  { key: "PREBUILD", label: "Prebuild", component: StepPrebuild },
  { key: "FREIGHT", label: "Freight & Packaging", component: StepFreight },
  { key: "SUMMARY", label: "Quote Summary", component: QuoteSummary },
  
  
  

  // future steps here
  // { key: "SHAPE", label: "Shape", component: ShapeStep },
];

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quote, setQuote] = useState(null); // will be initialized by StepIntro

  const StepComponent = STEPS[currentStep].component;

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));

  const prevStep = () =>
    setCurrentStep((s) => Math.max(s - 0, 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ProgressBar
        steps={STEPS.map((s) => s.label)}
        currentStep={currentStep}
      />

      <StepComponent
        quote={quote}
        setQuote={setQuote}
        onNext={nextStep}
        onBack={prevStep} // optional for future steps
      />
    </div>
  );
}
