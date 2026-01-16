import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion } from "framer-motion";

export default function StepFrame({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ frames: [], corners: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrameData = async () => {
      try {
        console.log("--- STARTING FIRESTORE FETCH ---");
        
        // 1. Fetch Frames
        const frameSnap = await getDocs(collection(db, "frames"));
        console.log("Frames Found in DB:", frameSnap.size);
        
        const framesList = frameSnap.docs.map(doc => {
          const d = doc.data();
          console.log(`Frame ID: ${doc.id}`, d); // This shows you the actual field names
          return { id: doc.id, ...d };
        });

        // 2. Fetch Corners
        const cornerSnap = await getDocs(collection(db, "corners"));
        console.log("Corners Found in DB:", cornerSnap.size);
        
        const cornersList = cornerSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));

        setData({ frames: framesList, corners: cornersList });
      } catch (error) {
        console.error("FIRESTORE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFrameData();
  }, []);

  const handleFrameSelect = (f) => {
    // We map the DB fields (ofCode, sellLM) to the local quote fields (name, sell)
    const frameData = {
      id: f.id,
      name: f.ofCode || "Unnamed Profile",
      sell: Number(f.sellLM) || 0,
      weight: Number(f.weight) || 0,
      size: f.size || "N/A",
      type: f.type || "N/A"
    };
    
    // Ensure estimates exists before spreading
    const currentEstimates = quote.estimates || {};
    const frameWeight = (quote.stats?.lm || 0) * frameData.weight;
    
    updateQuote({ 
      frame: frameData, 
      estimates: { ...currentEstimates, frameWeight } 
    });
  };

  const handleCornerSelect = (c) => {
    const cornerData = {
      id: c.id,
      name: c.type || "Standard Corner",
      sell: Number(c.sellLM) || 0,
      description: c.description || ""
    };
    updateQuote({ corners: cornerData });
  };

  const isComplete = quote.frame?.id && quote.corners?.id;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing with Inventory...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Structural Specification</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select aluminum profile and corner joinery.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FRAME SELECTION */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. Aluminum Profile</label>
          <div className="grid gap-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {/* N/A Option */}
            <div 
              onClick={() => handleFrameSelect({ id: "NA", ofCode: "No Frame", sellLM: 0, weight: 0 })}
              className={`p-6 border-2 transition-all cursor-pointer ${quote.frame?.id === "NA" ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"}`}
            >
              <p className="font-black text-xs uppercase tracking-widest text-gray-400">N/A - Fabric Only</p>
            </div>

            {/* If data exists, map it; otherwise show a fallback */}
            {data.frames.length > 0 ? (
              data.frames.map((f) => (
                <div 
                  key={f.id}
                  onClick={() => handleFrameSelect(f)}
                  className={`p-6 border-2 transition-all cursor-pointer relative group ${quote.frame?.id === f.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-lg tracking-tighter uppercase">{f.ofCode} — {f.size}</span>
                    <span className="text-sm font-black text-[#0D004C]">${f.sellLM}/m</span>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <span className="text-[9px] bg-black text-white px-2 py-0.5 font-black uppercase tracking-widest">{f.type}</span>
                    <span className="text-[9px] border border-black px-2 py-0.5 font-black uppercase tracking-widest">{f.weight} kg/m</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase">{f.description}</p>
                </div>
              ))
            ) : (
              <p className="text-red-500 text-xs font-bold uppercase p-4 border border-dashed border-red-200">No frames found in 'frames' collection.</p>
            )}
          </div>
        </section>

        {/* CORNER SELECTION */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Corner Finish</label>
          <div className="grid gap-2">
            <div 
              onClick={() => handleCornerSelect({ id: "NA", type: "No Corners", sellLM: 0 })}
              className={`p-6 border-2 transition-all cursor-pointer ${quote.corners?.id === "NA" ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-300"}`}
            >
              <p className="font-black text-xs uppercase tracking-widest text-gray-400">N/A - Straight Cuts</p>
            </div>

            {data.corners.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleCornerSelect(c)}
                className={`p-6 border-2 transition-all cursor-pointer relative ${quote.corners?.id === c.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-black text-sm uppercase tracking-tight">{c.type}</p>
                  <p className="text-sm font-black text-[#0D004C]">+${c.sellLM}</p>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide leading-tight">{c.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Frame Subtotal ({quote.stats?.lm.toFixed(2) || 0}m)</p>
          <p className="text-4xl font-black text-black tracking-tighter">
            ${(( (quote.stats?.lm || 0) * (quote.frame?.sell || 0)) + (quote.corners?.sell || 0)).toFixed(2)}
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-10 py-4 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 font-black uppercase text-[10px] transition-all ${isComplete ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Continue to Fabric
          </button>
        </div>
      </footer>
    </div>
  );
}