import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFabric({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ fabrics: [], coatings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabricData = async () => {
      // MATCHING YOUR SCHEMA: "fabrics" (plural)
      const fabricSnap = await getDocs(collection(db, "fabrics"));
      // Assuming powder-coating is correctly named in your DB
      const coatingSnap = await getDocs(collection(db, "powder-coating"));
      
      setData({
        fabrics: fabricSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        coatings: coatingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
      setLoading(false);
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
        sell: parseFloat(fabric.sellSQM) || 0, // Normalize field name for QuoteSummary
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

  if (loading) return <div className="p-20 text-center font-bold text-indigo-900 animate-pulse">Fetching Fabric & Finish Options...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#0D004C]">Fabric & Finish</h2>
          <p className="text-gray-500">Select your print media and frame surface finish.</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-right">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Area</p>
          <p className="text-xl font-black text-[#0D004C]">{quote.stats.sqm.toFixed(2)} SQM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FABRIC SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">1. Print Media</label>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {/* N/A Option */}
            <div 
              onClick={() => handleFabricSelect({ id: "NA", description: "No Fabric", sellSQM: 0, weightSQM: 0 })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${quote.fabric?.id === "NA" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"}`}
            >
              <p className="font-bold text-gray-800">N/A - No Fabric Required</p>
            </div>

            {/* Firestore Fabrics */}
            {data.fabrics.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFabricSelect(f)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${quote.fabric?.id === f.id ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500">{f.code}</span>
                      <p className="font-bold text-gray-800 text-lg">{f.description}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Size: {f.size} | Weight: {f.weightSQM}kg/sqm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-600 font-black text-xl">${f.sellSQM}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">per sqm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POWDER COATING */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">2. Frame Finish</label>
          <div className="space-y-3">
             <div 
              onClick={() => handleCoatingSelect({ id: "NA", name: "Standard Silver", sell: 0 })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${quote.powderCoating?.id === "NA" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"}`}
            >
              <p className="font-bold text-gray-800">Standard (Natural Anodised)</p>
            </div>
            {data.coatings.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleCoatingSelect(c)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${quote.powderCoating?.id === c.id ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-800">{c.name}</p>
                  <p className="text-indigo-600 font-black">${c.sell}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTINUITY SUMMARY BAR */}
      <div className="mt-10 p-8 bg-[#0D004C] rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase opacity-50 font-black tracking-widest mb-1">Fabric Cost</p>
            <p className="text-2xl font-black text-yellow-400">${(quote.stats.sqm * (quote.fabric?.sell || 0)).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-50 font-black tracking-widest mb-1">Total Weight</p>
            <p className="text-2xl font-black">{(quote.estimates.frameWeight + (quote.estimates.fabricWeight || 0)).toFixed(1)} kg</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-8 py-3 font-bold opacity-60 hover:opacity-100 transition-all text-white">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black transition-all ${isComplete ? "bg-yellow-400 text-[#0D004C] shadow-xl hover:scale-105" : "bg-white/10 text-white/20 cursor-not-allowed"}`}
          >
            Confirm & Next →
          </button>
        </div>
      </div>
    </div>
  );
}