import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLogistics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ cities: [], freightMatrix: [] });
  const [loading, setLoading] = useState(true);

  // 1. Calculate weights
  const totalWeight = (
    (quote.estimates?.frameWeight || 0) +
    (quote.estimates?.fabricWeight || 0) +
    (quote.estimates?.lightingWeight || 0) +
    (quote.estimates?.acousticWeight || 0)
  );

  const maxDim = Math.max(quote.measurements?.a || 0, quote.measurements?.b || 0);

  // Determine Tier - Must match your DB string values exactly
  const getTier = () => {
    // If quote is fabric only (No frame selected in Step 2)
    if (quote.frame?.id === "NA") return "Fabric only";
    
    if (totalWeight > 100 || maxDim > 3000) return "Pallet / Crate";
    if (maxDim > 2400) return "Large - complete";
    if (maxDim > 1800) return "Medium - complete";
    return "Small - complete";
  };

  const currentTier = getTier();

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        const freightSnap = await getDocs(collection(db, "freight"));
        const freightList = freightSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // FIX: Changed f.city to f.location to match your DB
        const uniqueCities = [...new Set(freightList.map(f => f.location))].filter(Boolean).sort();
        
        setData({ cities: uniqueCities, freightMatrix: freightList });
      } catch (error) {
        console.error("Freight load error:", error);
      }
      setLoading(false);
    };
    fetchLogisticsData();
  }, []);

  const handleCitySelect = (selectedLocation) => {
    // FIX: Match against 'location' and ignore casing for the tier match
    const matchedFreight = data.freightMatrix.find(
      f => f.location === selectedLocation && 
      f.tier?.toLowerCase() === currentTier.toLowerCase()
    );

    updateQuote({ 
      destination: { 
        city: selectedLocation, 
        tier: currentTier, 
        sell: matchedFreight?.sell || 0 
      } 
    });
  };

  const handlePrebuildToggle = (val) => {
    updateQuote({ prebuild: { selected: val, sell: val ? 249 : 0 } });
  };

  const isComplete = quote.destination?.city && quote.prebuild?.selected !== undefined;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Analyzing Freight Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Logistics & Dispatch</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          System Weight: <span className="text-black font-black">{totalWeight.toFixed(1)}kg</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* PREBUILD SECTION */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. Pre-Assembly</label>
          <div className="bg-gray-50 border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase mb-4 tracking-tight">Perform full factory pre-build & inspection?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePrebuildToggle(true)}
                className={`p-4 font-black uppercase text-xs border-2 transition-all ${quote.prebuild?.selected === true ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-400 hover:border-black"}`}
              >
                Yes (+$249)
              </button>
              <button
                onClick={() => handlePrebuildToggle(false)}
                className={`p-4 font-black uppercase text-xs border-2 transition-all ${quote.prebuild?.selected === false ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-400 hover:border-black"}`}
              >
                No ($0)
              </button>
            </div>
          </div>
        </div>

        {/* FREIGHT SECTION */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Delivery Destination</label>
          <div className="space-y-4">
            <select 
              className="w-full p-5 font-black uppercase text-sm border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none bg-white appearance-none"
              value={quote.destination?.city || ""}
              onChange={(e) => handleCitySelect(e.target.value)}
            >
              <option value="">-- Select Destination --</option>
              {data.cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>

            {quote.destination?.city && (
              <div className="p-6 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(13,0,76,1)]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Calculated Logistics Tier</p>
                    <p className="text-lg font-black text-black uppercase tracking-tighter">{currentTier}</p>
                  </div>
                  <p className="text-3xl font-black text-[#0D004C]">${quote.destination.sell}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Logistics Subtotal</p>
          <p className="text-4xl font-black text-black tracking-tighter">
            ${((quote.prebuild?.sell || 0) + (quote.destination?.sell || 0)).toFixed(2)}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-10 py-4 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">
            Back
          </button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${isComplete ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Final Summary
          </button>
        </div>
      </footer>
    </div>
  );
}