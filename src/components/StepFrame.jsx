import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFrame({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ frames: [], finishes: [] });
  const [loading, setLoading] = useState(true);

  const defaultFinishes = [
    { id: "pc-white", name: "Powder Coated White", sellLM: 12.50 },
    { id: "pc-black", name: "Powder Coated Black", sellLM: 12.50 },
    { id: "pc-none", name: "Natural Anodised (Standard)", sellLM: 0 }
  ];

  useEffect(() => {
    const fetchFrameData = async () => {
      try {
        const frameSnap = await getDocs(collection(db, "frames"));
        const framesList = frameSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const finishSnap = await getDocs(collection(db, "finishes"));
        let finishList = finishSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (finishList.length === 0) finishList = defaultFinishes;
        setData({ frames: framesList, finishes: finishList });
      } catch (error) {
        console.error("FIRESTORE ERROR:", error);
        setData(prev => ({ ...prev, finishes: defaultFinishes }));
      } finally {
        setLoading(false);
      }
    };
    fetchFrameData();
  }, []);

  const handleFrameSelect = (f) => {
    updateQuote({ 
      frame: {
        id: f.id,
        name: f.ofCode || "No Frame",
        sell: Number(f.sellLM) || 0,
        weight: Number(f.weight) || 0,
        size: f.size || "N/A"
      }
    });
  };

  const handleFinishSelect = (finish) => {
    updateQuote({
      finish: {
        id: finish.id,
        name: finish.name,
        sell: Number(finish.sellLM) || 0
      }
    });
  };

  const isComplete = quote.frame?.id && quote.finish?.id;

  if (loading) return (
    <div className="p-20 text-center font-black uppercase tracking-widest text-gray-400">Loading Specifications...</div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Structural Specification</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select your frame profile or choose N/A for graphics-only orders.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* PROFILES */}
        <section className="lg:col-span-2 space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. Select Aluminum Profile</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            
            {/* N/A OPTION FOR PROFILES */}
            <div 
              onClick={() => handleFrameSelect({ id: "NA", ofCode: "No Frame (Graphics Only)", sellLM: 0, weight: 0, size: "N/A" })}
              className={`p-6 border-2 transition-all cursor-pointer ${quote.frame?.id === "NA" ? "border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}
            >
              <p className="font-black text-xs uppercase tracking-widest text-gray-400">N/A - Fabric Replacement Only</p>
            </div>

            {data.frames.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFrameSelect(f)}
                className={`p-6 border-2 transition-all cursor-pointer ${quote.frame?.id === f.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}
              >
                <span className="font-black text-lg tracking-tighter uppercase">{f.ofCode}</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{f.size}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINISHES */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Surface Finish</label>
          <div className="grid grid-cols-1 gap-3">
            
            {/* N/A OPTION FOR FINISHES */}
            <button 
              onClick={() => handleFinishSelect({ id: "NA-FINISH", name: "No Finish Required", sellLM: 0 })}
              className={`p-5 border-2 text-left transition-all ${quote.finish?.id === "NA-FINISH" ? "border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}
            >
              <span className="font-black text-xs uppercase tracking-widest">N/A - Existing Frame</span>
            </button>

            {data.finishes.map((finish) => (
              <button
                key={finish.id}
                onClick={() => handleFinishSelect(finish)}
                className={`p-5 border-2 text-left transition-all ${quote.finish?.id === finish.id ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}
              >
                <span className="font-black text-xs uppercase tracking-widest text-black">{finish.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Configuration Progress</p>
          <p className="text-xl font-black text-black tracking-tighter uppercase">
            {quote.frame?.id === "NA" ? "Graphic Replacement Mode" : isComplete ? "Structure Defined" : "Selection Required"}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={onBack} className="px-10 py-5 font-black uppercase text-[10px] border-2 border-black">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`px-16 py-5 font-black uppercase text-[10px] transition-all ${isComplete ? "bg-black text-white shadow-[6px_6px_0px_0px_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
          >
            Continue to Fabric
          </button>
        </div>
      </footer>
    </div>
  );
}