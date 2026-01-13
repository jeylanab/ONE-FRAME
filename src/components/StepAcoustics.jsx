import { useState } from "react";

export default function StepAcoustics({ quote, setQuote, onNext }) {
  const area = quote?.estimates?.area || 0;
  const minCharge = 100; // example minimum charge

  const ACOUSTICS = [
    { code: "AC15", size: "15mm", sellPerSQM: 20 },
    { code: "AC28", size: "28mm", sellPerSQM: 25 },
    { code: "AC50", size: "50mm", sellPerSQM: 40 },
    { code: "AC80", size: "80mm", sellPerSQM: 60 },
    { code: "AC120", size: "120mm", sellPerSQM: 80 },
    { code: "AC140", size: "140mm", sellPerSQM: 100 },
    { code: "AC32x32", size: "32mm x 32mm", sellPerSQM: 50 },
    { code: "AC50x50", size: "50mm x 50mm", sellPerSQM: 70 },
    { code: "AC32x45", size: "32mm x 45mm", sellPerSQM: 60 },
    { code: "AC90deg", size: "90-degree", sellPerSQM: 80 },
    { code: "AC60deg", size: "60-degree", sellPerSQM: 70 },
  ];

  const [selectedCode, setSelectedCode] = useState(quote?.acoustic?.code || "");

  const handleSelect = (panel) => {
    setSelectedCode(panel.code);
    const cost = Math.max(panel.sellPerSQM * area, minCharge);

    setQuote({
      ...quote,
      acoustic: {
        ...panel,
        totalCost: cost,
      },
    });
  };

  const handleNext = () => {
    if (!selectedCode) {
      alert("Please select an acoustic panel to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Acoustic Panel
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {ACOUSTICS.map((panel) => {
          const totalCost = Math.max(panel.sellPerSQM * area, minCharge);
          return (
            <div
              key={panel.code}
              onClick={() => handleSelect(panel)}
              className={`p-6 border rounded-xl cursor-pointer transition
                ${selectedCode === panel.code ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
              `}
            >
              <h3 className="text-xl font-semibold mb-2">{panel.size}</h3>
              <p className="font-bold text-[#3D85C6]">Sell per sqm: ${panel.sellPerSQM}</p>
              <p className="text-gray-700 mt-2">Total Cost: ${totalCost}</p>
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
