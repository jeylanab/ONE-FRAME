import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFrame({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ frames: [], finishes: [] });
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);

  const defaultFinishes = [
    { id: "pc-white", name: "Powder Coated White", sellLM: 12.50 },
    { id: "pc-black", name: "Powder Coated Black", sellLM: 12.50 },
    { id: "pc-none", name: "Natural Anodised (Standard)", sellLM: 0 }
  ];

  useEffect(() => {
    const fetchFrameData = async () => {
      try {
        const headerRef = doc(db, "content", "step3_structural");
        const headerSnap = await getDoc(headerRef);
        if (headerSnap.exists()) setHeader(headerSnap.data());

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
    // Force the weight to be a float to capture decimals like 0.277
    const frameWeightValue = parseFloat(f.weight) || 0;
    
    console.log("Selecting Frame:", f.ofCode, "Weight per LM:", frameWeightValue);

    updateQuote({ 
      frame: {
        id: f.id,
        name: f.ofCode || "No Frame",
        sell: Number(f.sellLM) || 0,
        weight: frameWeightValue, // This is the key that must be used in calculations
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
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Specifications Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* HEADER SECTION */}
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">
          {header.title || "Structural Specification"}
        </h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {header.subtitle || "Select your frame profile and surface finish."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LHS - FRAME PROFILES */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">1. Aluminum Profile</label>
          <div className="grid grid-cols-2 gap-4">
            {/* N/A Option Frame */}
            <div 
              onClick={() => handleFrameSelect({ id: "NA", ofCode: "No Frame", sellLM: 0, weight: 0, size: "Graphics Only" })}
              className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                quote.frame?.id === "NA" 
                ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black grayscale opacity-60"
              }`}
            >
              <p className="font-black text-sm uppercase tracking-tighter text-black leading-tight">No Frame Required</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Fabric Replacement Only</p>
            </div>

            {data.frames.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFrameSelect(f)}
                className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                  quote.frame?.id === f.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                  : "border-gray-100 hover:border-black text-gray-400"
                }`}
              >
                <div>
                  <p className="font-black text-sm uppercase tracking-tighter text-black">{f.ofCode}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{f.size}</p>
                </div>
                <p className="text-lg font-black text-black tracking-tighter">${Number(f.sellLM).toFixed(2)}<span className="text-[10px] ml-1 opacity-50">/LM</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* RHS - SURFACE FINISH */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">2. Surface Finish</label>
          <div className="grid grid-cols-2 gap-4">
            {/* N/A Option Finish */}
            <div 
              onClick={() => handleFinishSelect({ id: "NA-FINISH", name: "No Finish Required", sellLM: 0 })}
              className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                quote.finish?.id === "NA-FINISH" 
                ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black grayscale opacity-60"
              }`}
            >
              <p className="font-black text-sm uppercase tracking-tighter text-black leading-tight">No Finish Required</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase italic">Existing Frame</p>
            </div>

            {data.finishes.map((finish) => (
              <div
                key={finish.id}
                onClick={() => handleFinishSelect(finish)}
                className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                  quote.finish?.id === finish.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                  : "border-gray-100 hover:border-black text-gray-400"
                }`}
              >
                <p className="font-black text-sm uppercase tracking-tighter text-black">{finish.name}</p>
                <p className="text-lg font-black text-[#0D004C] tracking-tighter">
                  {finish.sellLM > 0 ? `+$${Number(finish.sellLM).toFixed(2)}` : "FREE"}
                  <span className="text-[10px] ml-1 opacity-50">/LM</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* STICKY FOOTER */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Configuration</p>
          <div className="flex gap-4 items-center">
            <p className="text-sm font-black text-black uppercase">{quote.frame?.name || "---"}</p>
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
            <p className="text-sm font-black text-black uppercase">{quote.finish?.name || "---"}</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={onBack} 
            className="flex-1 md:flex-none px-10 py-4 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-16 py-4 font-black uppercase text-[10px] transition-all ${
              isComplete 
              ? "bg-black text-white hover:bg-[#0D004C] shadow-[6px_6px_0px_0px_rgba(13,0,76,1)]" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue to Fabric
          </button>
        </div>
      </footer>
    </div>
  );
}