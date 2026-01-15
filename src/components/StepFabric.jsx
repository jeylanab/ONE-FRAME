import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFabric({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ fabrics: [], coatings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFabricData = async () => {
      const fabricSnap = await getDocs(collection(db, "fabric"));
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
    // Calculate weight: SQM * Weight/SQM
    const fabricWeight = quote.stats.sqm * (fabric.weight || 0);
    
    updateQuote({ 
      fabric: fabric, 
      estimates: { 
        ...quote.estimates, 
        fabricWeight: fabricWeight 
      } 
    });
  };

  const handleCoatingSelect = (coating) => {
    updateQuote({ powderCoating: coating });
  };

  // Validation: User must select fabric and coating (N/A is allowed)
  const isComplete = quote.fabric?.id && quote.powderCoating?.id;

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Fabric Options...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-[#0D004C]">Fabric & Finish</h2>
          <p className="text-gray-500 text-sm">Choose your print media and frame surface finish.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-indigo-400 uppercase">Current Area</p>
          <p className="text-lg font-mono font-bold text-[#0D004C]">{quote.stats.sqm.toFixed(2)} SQM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FABRIC SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Print Media</label>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div 
              onClick={() => handleFabricSelect({ id: "NA", description: "No Fabric", sell: 0, weight: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.fabric?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">N/A - No Fabric Required</p>
            </div>
            {data.fabrics.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFabricSelect(f)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.fabric?.id === f.id ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-indigo-100"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{f.size} {f.description}</p>
                    <p className="text-[10px] text-gray-400">Weight: {f.weight}kg/sqm</p>
                  </div>
                  <span className="text-indigo-600 font-black">${f.sell}/sqm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POWDER COATING */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Frame Finish</label>
          <div className="grid grid-cols-1 gap-3">
            <div 
              onClick={() => handleCoatingSelect({ id: "NA", name: "Standard Silver", sell: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.powderCoating?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">Standard (Natural Anodised)</p>
            </div>
            {data.coatings.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleCoatingSelect(c)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.powderCoating?.id === c.id ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
              >
                <div className="flex justify-between">
                  <p className="font-bold text-sm text-gray-800">{c.name}</p>
                  <span className="text-indigo-600 font-bold">${c.sell}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTINUITY SUMMARY */}
      <div className="mt-10 p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Fabric Total</p>
            <p className="text-xl font-black text-[#0D004C]">${(quote.stats.sqm * (quote.fabric?.sell || 0)).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Weight</p>
            <p className="text-xl font-black text-[#0D004C]">{(quote.estimates.frameWeight + (quote.estimates.fabricWeight || 0)).toFixed(1)} kg</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-8 py-3 font-bold text-gray-400 hover:text-gray-600">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black transition-all ${isComplete ? "bg-[#0D004C] text-white shadow-xl hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Go to Lighting
          </button>
        </div>
      </div>
    </div>
  );
}