import { useState } from "react";

export default function StepFabric({ quote, setQuote, onNext }) {
  const FABRICS = [
    { id: "FAB15", size: "15mm", description: "Standard 15mm fabric", weightPerSQM: 0.5, sellPerSQM: 50 },
    { id: "FAB28", size: "28mm", description: "Premium 28mm fabric", weightPerSQM: 0.7, sellPerSQM: 70 },
    { id: "FAB50", size: "50mm", description: "Luxury 50mm fabric", weightPerSQM: 1.0, sellPerSQM: 100 },
    { id: "FAB80", size: "80mm", description: "High-performance 80mm fabric", weightPerSQM: 1.5, sellPerSQM: 150 },
    { id: "FAB120", size: "120mm", description: "Ultra 120mm fabric", weightPerSQM: 2.0, sellPerSQM: 200 },
    { id: "FAB140", size: "140mm", description: "Special 140mm fabric", weightPerSQM: 2.5, sellPerSQM: 250 },
  ];

  const [selectedId, setSelectedId] = useState(quote?.fabric?.id || "");

  const handleSelect = (fabric) => {
    const area = quote?.estimates?.area || 0;

    setSelectedId(fabric.id);
    setQuote({
      ...quote,
      fabric: {
        ...fabric,
        totalWeight: fabric.weightPerSQM * area,
        totalCost: fabric.sellPerSQM * area,
      },
    });
  };

  const handleNext = () => {
    if (!selectedId) {
      alert("Please select a fabric to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Your Fabric
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {FABRICS.map((fabric) => {
          const area = quote?.estimates?.area || 0;
          return (
            <div
              key={fabric.id}
              onClick={() => handleSelect(fabric)}
              className={`p-6 border rounded-xl cursor-pointer transition
                ${selectedId === fabric.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
              `}
            >
              <h3 className="text-xl font-semibold mb-2">{fabric.size}</h3>
              <p className="text-gray-600 mb-2">{fabric.description}</p>
              <p className="text-sm text-gray-500 mb-2">Weight per sqm: {fabric.weightPerSQM} kg</p>
              <p className="font-bold text-[#3D85C6]">Sell per sqm: ${fabric.sellPerSQM}</p>
              <p className="text-gray-700 mt-2">Total Weight: {(fabric.weightPerSQM * area).toFixed(2)} kg</p>
              <p className="text-gray-700">Total Cost: ${(fabric.sellPerSQM * area).toFixed(2)}</p>
            </div>
          );
        })}
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
