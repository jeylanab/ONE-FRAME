import { useState } from "react";

const SHAPES = [
  { 
    id: "SQUARE", 
    description: "A plane figure with four equal straight sides and four right angles.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 249.0 
  },
  { 
    id: "RECTANGLE", 
    description: "A plane figure with unequal adjacent straight sides and four right angles.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 249.0 
  },
  { 
    id: "ROUND", 
    description: "A circular plane figure with perfect symmetry on all sides.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 2495.0 
  },
  { 
    id: "TRIANGLE", 
    description: "A plane figure with three straight sides and three angles.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 1500.0 
  },
  { 
    id: "OVAL", 
    description: "An elongated circular plane figure with perfect symmetry on adjacent sides.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 2495.0 
  },
  { 
    id: "DIAMOND", 
    description: "A plane figure with four equal sides and equal opposite angles.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 1995.0 
  },
  { 
    id: "TRAPEZIUM", 
    description: "A plane figure with four straight sides with at least one pair of parallel sides.", 
    setupDescription: "Set-up of machines + sewing templates + sewing jigs", 
    sell: 1994.0 
  },
  { 
    id: "CUSTOM", 
    description: "Custom setup for unique designs.", 
    setupDescription: "Set-up of machines + templates + jigs for unique designs", 
    sell: 2995.0 
  },
];

export default function StepShape({ quote, setQuote, onNext }) {
  const [selectedId, setSelectedId] = useState(quote?.shape?.id || "");

  const handleSelect = (shape) => {
    setSelectedId(shape.id);
    setQuote({
      ...quote,
      shape: {
        id: shape.id,
        description: shape.description,
        setupDescription: shape.setupDescription, // ✅ Added
        sell: shape.sell,
      },
    });
  };

  const handleNext = () => {
    if (!selectedId) {
      alert("Please select a shape to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Your Shape
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {SHAPES.map((shape) => (
          <div
            key={shape.id}
            onClick={() => handleSelect(shape)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedId === shape.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{shape.id}</h3>
            <p className="text-gray-600 mb-2">{shape.description}</p> {/* geometric info */}
            <p className="text-gray-700 mb-4 font-medium">{shape.setupDescription}</p> {/* setup info */}
            <p className="font-bold text-[#3D85C6]">${shape.sell.toLocaleString()}</p>
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
