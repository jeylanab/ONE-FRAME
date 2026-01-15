import { motion } from "framer-motion";

export default function ProgressBar({ steps = [], currentStep = 0 }) {
  const progressPercent = steps.length > 0 
    ? ((currentStep + 1) / steps.length) * 100 
    : 0;

  return (
    <div className="w-full mb-20">
      {/* Top Meta Info */}
      <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.5em] text-gray-400 uppercase">
            System Configuration Phase
          </span>
          <div className="flex items-baseline gap-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              {steps[currentStep]}
            </h2>
            <span className="text-xl font-light text-gray-300">/ {steps.length}</span>
          </div>
        </div>
        
        <div className="hidden md:block">
           <span className="text-6xl font-black leading-none tracking-tighter opacity-10">
             0{currentStep + 1}
           </span>
        </div>
      </div>

      {/* The Bar: High Contrast Stack */}
      <div className="relative h-4 w-full bg-gray-100 group">
        {/* Background Grid Pattern (Subtle Architectural Detail) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, black 1px, transparent 1px)', backgroundSize: '10% 100%' }} />
        
        {/* The Animated Progress */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
          className="absolute top-0 left-0 h-full bg-black flex justify-end items-center px-2"
        >
          {/* Moving Percentage within the bar */}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-bold text-white tracking-widest"
          >
            {Math.round(progressPercent)}%
          </motion.span>
        </motion.div>
      </div>

      {/* Step Navigation/Labels */}
      <div className="grid grid-cols-2 md:grid-cols-6 mt-4 gap-[2px] bg-gray-100 border-t border-black">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div 
              key={step} 
              className={`p-4 transition-all duration-300 ${
                isActive ? "bg-black text-white" : "bg-white text-black opacity-40"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black font-mono">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "block" : "hidden md:block"}`}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}