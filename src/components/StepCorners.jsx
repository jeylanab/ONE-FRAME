import { useState } from "react";

export default function StepCorners({ quote, setQuote, onNext }) {
    const [selectedId, setSelectedId] = useState(quote?.corners?.id || "");
    
    
    const CORNERS = [
  { id: "90-MITRED", description: "90-degree mitre-cut corners + standard corner joiners", sell: 50 },
  { id: "CURVED-CUT", description: "Custom curved corner + standard straight joiners", sell: 75 },
  { id: "CUSTOM-CUT", description: "Custom angle welded corner + standard straight joiners", sell: 100 },
  { id: "90-CAST", description: "90-degree cast corner with integrated fixings", sell: 120 },
  { id: "CURVED-CAST", description: "Curved cast corner with integrated fixings", sell: 150 },
];


  const handleSelect = (corner) => {
    setSelectedId(corner.id);
    setQuote({
      ...quote,
      corners: corner,
    });
  };

  const handleNext = () => {
    if (!selectedId) {
      alert("Please select a corner type to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Corner Type
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {CORNERS.map((corner) => (
          <div
            key={corner.id}
            onClick={() => handleSelect(corner)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedId === corner.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{corner.id}</h3>
            <p className="text-gray-600 mb-4">{corner.description}</p>
            <p className="font-bold text-[#3D85C6]">${corner.sell.toLocaleString()}</p>
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
