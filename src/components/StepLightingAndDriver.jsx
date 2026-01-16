import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLightingAndDriver({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ lighting: [], controls: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectricalData = async () => {
      try {
        const lightSnap = await getDocs(collection(db, "lighting"));
        const controlSnap = await getDocs(collection(db, "controls"));
        
        setData({
          lighting: lightSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          controls: controlSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElectricalData();
  }, []);

  const handleLightSelect = (light) => {
    // Logic: SQM * sellSQM
    const lightWeight = quote.stats.sqm * 1.2; // Engineering estimate: 1.2kg/sqm for LEDs
    updateQuote({ 
      lighting: {
        ...light,
        sell: parseFloat(light.sellSQM) || 0
      }, 
      estimates: { ...quote.estimates, lightingWeight: lightWeight } 
    });
  };

  const handleControlSelect = (control) => {
    updateQuote({ 
      control: {
        ...control,
        sell: parseFloat(control.sellSQM) || 0 // Your DB uses sellSQM for control price as well
      } 
    });
  };

  const isComplete = quote.lighting?.id && quote.control?.id;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initializing Power Systems...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* HEADER */}
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Lighting & Power</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Specify illumination matrix and driver requirements.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LIGHTING SELECTION */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. LED Array Configuration</label>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            <div 
              onClick={() => handleLightSelect({ id: "NA", description: "Non-Illuminated", sellSQM: 0 })}
              className={`p-6 border-2 cursor-pointer transition-all ${
                quote.lighting?.id === "NA" 
                ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <p className="font-black uppercase text-sm">N/A - Non-Illuminated</p>
            </div>

            {data.lighting.map((l) => (
              <div 
                key={l.id}
                onClick={() => handleLightSelect(l)}
                className={`p-6 border-2 cursor-pointer transition-all relative ${
                  quote.lighting?.id === l.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                  : "border-gray-100 hover:border-black"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase">{l.code}</span>
                      <p className="font-black text-black text-lg uppercase tracking-tighter">{l.description}</p>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
                      Output: {l.lumens} Lumens | Scale: {l.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0D004C] font-black text-2xl tracking-tighter">${l.sellSQM}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase">per sqm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTROLS SELECTION */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Driver & Dimming Interface</label>
          <div className="space-y-4">
            <div 
              onClick={() => handleControlSelect({ id: "NA", description: "No Driver Required", sellSQM: 0 })}
              className={`p-6 border-2 cursor-pointer transition-all ${
                quote.control?.id === "NA" 
                ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <p className="font-black uppercase text-sm">N/A - No Driver Required</p>
            </div>

            {data.controls.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleControlSelect(c)}
                className={`p-6 border-2 cursor-pointer transition-all relative ${
                  quote.control?.id === c.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                  : "border-gray-100 hover:border-black"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-black text-black uppercase tracking-tighter">{c.description}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Spec: {c.output}</p>
                  </div>
                  <p className="text-[#0D004C] font-black text-xl tracking-tighter">${c.sellSQM}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER SUMMARY BAR */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Electrical Subtotal</p>
            <p className="text-3xl font-black text-black tracking-tighter">
              ${((quote.stats.sqm * (quote.lighting?.sell || 0)) + (quote.control?.sell || 0)).toFixed(2)}
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Rolling Weight</p>
            <p className="text-3xl font-black text-black tracking-tighter">
              {(quote.estimates.frameWeight + quote.estimates.fabricWeight + (quote.estimates.lightingWeight || 0)).toFixed(1)}kg
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="px-10 py-4 font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-gray-50 transition">
            Back
          </button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`px-12 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
              isComplete 
              ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue to Acoustics
          </button>
        </div>
      </footer>
    </div>
  );
}