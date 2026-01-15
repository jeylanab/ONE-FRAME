import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLightingAndDriver({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ lighting: [], controls: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectricalData = async () => {
      const lightSnap = await getDocs(collection(db, "lighting"));
      const controlSnap = await getDocs(collection(db, "controls"));
      
      setData({
        lighting: lightSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        controls: controlSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
      setLoading(false);
    };
    fetchElectricalData();
  }, []);

  const handleLightSelect = (light) => {
    // Lighting weight is usually fixed per SQM or estimated
    const lightWeight = quote.stats.sqm * 1.5; // Example: 1.5kg per SQM for LEDs/Wiring
    updateQuote({ 
      lighting: light, 
      estimates: { ...quote.estimates, lightingWeight: lightWeight } 
    });
  };

  const handleControlSelect = (control) => {
    updateQuote({ control: control });
  };

  // Validation: Must select both (N/A is a valid selection)
  const isComplete = quote.lighting?.id && quote.control?.id;

  if (loading) return <div className="p-10 text-center animate-pulse font-bold">Initializing Electrical Options...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-[#0D004C]">Lighting & Controls</h2>
          <p className="text-gray-500 text-sm italic">Illumination for {quote.stats.sqm.toFixed(2)} SQM area.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LIGHTING SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">LED Illumination</label>
          <div className="space-y-3">
            <div 
              onClick={() => handleLightSelect({ id: "NA", description: "Non-Illuminated", sell: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.lighting?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">N/A - Non-Illuminated</p>
            </div>
            {data.lighting.map((l) => (
              <div 
                key={l.id}
                onClick={() => handleLightSelect(l)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.lighting?.id === l.id ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{l.size} - {l.description}</p>
                    <p className="text-[10px] text-indigo-500 font-bold">{l.lumens} Lumens / Unit</p>
                  </div>
                  <span className="text-indigo-600 font-black">${l.sell}/sqm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTROLS SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">Driver / Dimming Control</label>
          <div className="space-y-3">
            <div 
              onClick={() => handleControlSelect({ id: "NA", description: "No Driver Required", sell: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.control?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">N/A - No Driver Required</p>
            </div>
            {data.controls.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleControlSelect(c)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.control?.id === c.id ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-xs">{c.description}</p>
                    <p className="text-[10px] text-gray-400">Output: {c.output}</p>
                  </div>
                  <span className="text-indigo-600 font-black">${c.sell}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICE CONTINUITY BAR */}
      <div className="mt-10 p-6 bg-[#0D004C] rounded-2xl flex flex-col md:flex-row justify-between items-center text-white gap-4">
        <div className="flex gap-10">
          <div>
            <p className="text-[10px] uppercase opacity-60">Electrical Subtotal</p>
            <p className="text-xl font-black">
              ${((quote.stats.sqm * (quote.lighting?.sell || 0)) + (quote.control?.sell || 0)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-60">Current Total Weight</p>
            <p className="text-xl font-black">
              {(quote.estimates.frameWeight + quote.estimates.fabricWeight + (quote.estimates.lightingWeight || 0)).toFixed(1)} kg
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-6 py-2 font-bold opacity-60 hover:opacity-100">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-10 py-3 rounded-xl font-bold transition-all ${isComplete ? "bg-yellow-400 text-black shadow-lg hover:scale-105" : "bg-white/10 text-white/20 cursor-not-allowed"}`}
          >
            Continue to Acoustics
          </button>
        </div>
      </div>
    </div>
  );
}