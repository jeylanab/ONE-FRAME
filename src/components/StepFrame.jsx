import { useState } from "react";

export default function StepFrame({ quote, setQuote, onNext }) {
  const FRAMES = [
    { code: "OF895", size: "15mm", type: "WALL", description: "14.5mm x 20mm profile", weightPerLM: 0.277, sellPerLM: 495 },
    { code: "OF408", size: "28mm", type: "WALL", description: "28mm x 40mm profile", weightPerLM: 0.676, sellPerLM: 650 },
    { code: "OF517", size: "50mm", type: "WALL", description: "50mm x 40mm profile", weightPerLM: 0.81, sellPerLM: 750 },
    { code: "OF418", size: "80mm", type: "WALL", description: "80mm x 40mm profile", weightPerLM: 1.335, sellPerLM: 1050 },
    { code: "OF101", size: "120mm", type: "FREE-STANDING", description: "120mm x 40mm profile", weightPerLM: 1.761, sellPerLM: 1200 },
    { code: "OF886", size: "140mm", type: "CEILING", description: "140mm x 14.6mm profile", weightPerLM: 2.079, sellPerLM: 0 },
    { code: "OF032", size: "32mm x 32mm", type: "3D", description: "31.75mm diamater x 1.42mm wall tube", weightPerLM: 0.367, sellPerLM: 0 },
    { code: "OF050", size: "50mm x 50mm", type: "3D", description: "50mm diamater x 2mm wall tube", weightPerLM: 0.817, sellPerLM: 0 },
    { code: "OF546", size: "32mm x 45mm", type: "3D", description: "32mm x 44.5mm SEG tube", weightPerLM: 0.446, sellPerLM: 0 },
    { code: "OF087", size: "18mm x 18mm", type: "3D", description: "18mm x 18mm profile", weightPerLM: 0.399, sellPerLM: 0 },
    { code: "OF366", size: "40mm x 40mm", type: "3D", description: "40mm x 40mm profile", weightPerLM: 1.62, sellPerLM: 0 },
    { code: "OF566", size: "60mm x 60mm", type: "3D", description: "60mm x 60mm profile", weightPerLM: 2.1, sellPerLM: 0 },
    { code: "OF136", size: "80mm x 80mm", type: "3D", description: "80mm x 80mm profile", weightPerLM: 2.69, sellPerLM: 0 },
    { code: "OF021", size: "25mm x 16mm", type: "RAIL", description: "25mm x 16mm profile", weightPerLM: 0.39, sellPerLM: 0 },
    { code: "OF004", size: "40mm x 16mm", type: "RAIL", description: "40mm x 16mm profile", weightPerLM: 0.662, sellPerLM: 0 },
    { code: "OF303", size: "32mm x 32mm", type: "POST", description: "32mm x 32mm profile", weightPerLM: 0.79, sellPerLM: 0 },
    { code: "OF105", size: "30mm x 30mm", type: "POST", description: "30mm x 30mm profile", weightPerLM: 0.725, sellPerLM: 0 },
    { code: "OF617", size: "7mm x 32mm", type: "RETRO", description: "7mm x 32mm profile", weightPerLM: 0.218, sellPerLM: 0 },
    { code: "OF465", size: "16mm x 8mm", type: "RETRO", description: "16mm x 8mm profile", weightPerLM: 0.301, sellPerLM: 0 },
    { code: "OF545", size: "15mm x 45mm", type: "ILLUMINATE", description: "15mm x 45mm profile + lens", weightPerLM: 0, sellPerLM: 0 },
    { code: "OF646", size: "40mm x 26mm", type: "ILLUMINATE", description: "40mm x 26mm profile + lens", weightPerLM: 0.501, sellPerLM: 0 },
    { code: "OF083", size: "80mm x 80mm", type: "ILLUMINATE", description: "80mm x 80mm profile + lens", weightPerLM: 2.691, sellPerLM: 0 },
  ];

  const [selectedCode, setSelectedCode] = useState(quote?.frame?.code || "");

  const handleSelect = (frame) => {
    setSelectedCode(frame.code);
    setQuote({
      ...quote,
      frame: frame,
    });
  };

  const handleNext = () => {
    if (!selectedCode) {
      alert("Please select a frame/profile to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Frame / Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {FRAMES.map((frame) => (
          <div
            key={frame.code}
            onClick={() => handleSelect(frame)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedCode === frame.code ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{frame.code} - {frame.size}</h3>
            <p className="text-gray-600 mb-2">{frame.type}</p>
            <p className="text-gray-600 mb-2">{frame.description}</p>
            <p className="text-sm text-gray-500 mb-2">Weight per LM: {frame.weightPerLM} kg</p>
            <p className="font-bold text-[#3D85C6]">Sell per LM: ${frame.sellPerLM}</p>
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
