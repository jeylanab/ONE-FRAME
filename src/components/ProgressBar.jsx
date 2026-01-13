export default function ProgressBar({
  steps = [],
  currentStep = 0,
}) {
  const progressPercent =
    steps.length > 1
      ? (currentStep / (steps.length - 1)) * 100
      : 0;

  return (
    <div className="w-full mb-10">
      {/* Step Labels */}
      <div className="flex justify-between mb-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step}
              className="flex-1 text-center"
            >
              <div
                className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted
                      ? "bg-black text-white"
                      : isActive
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {index + 1}
              </div>

              <div
                className={`mt-2 text-xs font-medium
                  ${
                    isActive || isCompleted
                      ? "text-black"
                      : "text-gray-400"
                  }`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-black transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
