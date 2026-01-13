import { useState } from "react";

export default function StepPrebuild({ quote, setQuote, onNext }) {
  // Prebuild shapes
  const PREBUILDS = [
    { shape: "SQUARE", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "RECTANGLE", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "ROUND", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "TRIANGLE", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "OVAL", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "DIAMOND", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "TRAPEZIUM", description: "Full prebuild to view prior to dispatch", sell: 249 },
    { shape: "CUSTOM", description: "Full prebuild to view prior to dispatch", sell: 249 },
  ];

  const [selectedShape, setSelectedShape] = useState(quote?.prebuild?.shape || "");

  const handleSelect = (prebuild) => {
    setSelectedShape(prebuild.shape);
    setQuote({
      ...quote,
      prebuild: prebuild,
    });
  };

  const handleNext = () => {
    if (!selectedShape) {
      alert("Please select a prebuild shape to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Prebuild Shape
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {PREBUILDS.map((item) => (
          <div
            key={item.shape}
            onClick={() => handleSelect(item)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedShape === item.shape ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{item.shape}</h3>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <p className="font-bold text-[#3D85C6]">Sell: ${item.sell}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-[#0D004C] text-white font-semibold rounded-lg hover:bg-[#3D85C6] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
