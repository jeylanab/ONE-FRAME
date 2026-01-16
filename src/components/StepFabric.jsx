import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFabric({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ fabrics: [], coatings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabricData = async () => {
      try {
        // MATCHING YOUR SCHEMA: "fabrics"
        const fabricSnap = await getDocs(collection(db, "fabrics"));
        // Standardizing collection name to powder-coating
        const coatingSnap = await getDocs(collection(db, "powder-coating"));
        
        setData({
          fabrics: fabricSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          coatings: coatingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFabricData();
  }, []);

  const handleFabricSelect = (fabric) => {
    // MATCHING YOUR SCHEMA: weightSQM and sellSQM
    const weightPerSqm = parseFloat(fabric.weightSQM) || 0;
    const fabricWeight = quote.stats.sqm * weightPerSqm;
    
    updateQuote({ 
      fabric: {
        ...fabric,
        name: fabric.description || "Custom Fabric",
        sell: parseFloat(fabric.sellSQM) || 0,
        weight: weightPerSqm
      }, 
      estimates: { 
        ...quote.estimates, 
        fabricWeight: fabricWeight 
      } 
    });
  };

  const handleCoatingSelect = (coating) => {
    updateQuote({ powderCoating: coating });
  };

  const isComplete = quote.fabric?.id && quote.powderCoating?.id;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Media & Finishes...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* HEADER */}
      <header className="flex justify-between items-end border-l-4 border-black pl-6">
        <div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Fabric & Finish</h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select print media and frame surface treatment.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Area</p>
          <p className="text-2xl font-black text-black">{quote.stats.sqm.toFixed(2)} SQM</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FABRIC SELECTION */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. Print Media Specification</label>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {/* N/A Option */}
            <div 
              onClick={() => handleFabricSelect({ id: "NA", description: "No Fabric", sellSQM: 0, weightSQM: 0, code: "N/A" })}
              className={`p-6 border-2 cursor-pointer transition-all ${
                quote.fabric?.id === "NA" 
                ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <p className="font-black uppercase text-sm">N/A - No Fabric Required</p>
            </div>

            {/* Firestore Fabrics */}
            {data.fabrics.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFabricSelect(f)}
                className={`p-6 border-2 cursor-pointer transition-all relative ${
                  quote.fabric?.id === f.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                  : "border-gray-100 hover:border-black"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase">{f.code}</span>
                      <p className="font-black text-black text-lg uppercase tracking-tighter">{f.description}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                      Width: {f.size} | Weight: {f.weightSQM}kg/sqm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0D004C] font-black text-2xl tracking-tighter">${f.sellSQM}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase">per sqm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POWDER COATING */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Surface Finish (Powder Coat)</label>
          <div className="grid grid-cols-1 gap-4">
             <div 
              onClick={() => handleCoatingSelect({ id: "NA", name: "Standard Silver", sell: 0 })}
              className={`p-6 border-2 cursor-pointer transition-all ${
                quote.powderCoating?.id === "NA" 
                ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <p className="font-black uppercase text-sm">Standard (Natural Anodised)</p>
            </div>

            {data.coatings.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleCoatingSelect(c)}
                className={`p-6 border-2 cursor-pointer transition-all flex justify-between items-center ${
                  quote.powderCoating?.id === c.id 
                  ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                  : "border-gray-100 hover:border-black"
                }`}
              >
                <p className="font-black text-black uppercase text-sm">{c.name}</p>
                <p className="text-[#0D004C] font-black text-lg">${c.sell}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER SUMMARY BAR */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Fabric Subtotal</p>
            <p className="text-3xl font-black text-black tracking-tighter">
              ${(quote.stats.sqm * (quote.fabric?.sell || 0)).toFixed(2)}
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Rolling Weight</p>
            <p className="text-3xl font-black text-black tracking-tighter">
              {(quote.estimates.frameWeight + (quote.estimates.fabricWeight || 0)).toFixed(1)}kg
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-10 py-4 font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-gray-50 transition">
            Back
          </button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
              isComplete 
              ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Confirm & Next
          </button>
        </div>
      </footer>
    </div>
  );
}