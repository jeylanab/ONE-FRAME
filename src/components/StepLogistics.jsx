import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLogistics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ cities: [], freightMatrix: [] });
  const [loading, setLoading] = useState(true);

  const totalWeight = (
    (quote.estimates?.frameWeight || 0) +
    (quote.estimates?.fabricWeight || 0) +
    (quote.estimates?.lightingWeight || 0) +
    (quote.estimates?.acousticWeight || 0)
  );

  const maxDim = Math.max(parseFloat(quote.measurements?.a || 0), parseFloat(quote.measurements?.b || 0));

  const getTier = () => {
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
        const uniqueCities = [...new Set(freightList.map(f => f.location))].filter(Boolean).sort();
        setData({ cities: uniqueCities, freightMatrix: freightList });
      } catch (error) {
        console.error("Freight Matrix Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogisticsData();
  }, []);

  const handleCitySelect = (selectedLocation) => {
    // POWERFUL MATCHING LOGIC
    // We normalize both strings to lowercase and remove all white space for the comparison
    const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '').trim() || "";
    
    const targetTierNormalized = normalize(currentTier);

    const matchedFreight = data.freightMatrix.find(f => {
      const isLocationMatch = f.location === selectedLocation;
      const isTierMatch = normalize(f.tier) === targetTierNormalized;
      return isLocationMatch && isTierMatch;
    });

    updateQuote({ 
      destination: { 
        city: selectedLocation, 
        tier: currentTier, 
        sell: matchedFreight ? matchedFreight.sell : 0,
        // Optional: Keep the description from the DB for the final quote
        description: matchedFreight?.description || "" 
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
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Dispatch Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Logistics & Dispatch</h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Route optimization based on system morphology.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payload</p>
          <p className="text-2xl font-black text-black">{totalWeight.toFixed(1)} kg</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-black text-xs italic">01</span>
            <label className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Quality Assurance</label>
          </div>
          
          <div className={`p-8 border-4 transition-all ${quote.prebuild?.selected ? "border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]" : "border-gray-100 bg-gray-50"}`}>
            <p className="text-xs font-black uppercase mb-2">Factory Pre-Assembly</p>
            <p className="text-[10px] text-gray-500 uppercase leading-relaxed mb-6 font-bold">
              Full factory build and quality inspection prior to dispatch.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePrebuildToggle(true)}
                className={`p-4 font-black uppercase text-[10px] border-2 transition-all ${quote.prebuild?.selected === true ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-400 hover:border-black"}`}
              >
                Include (+$249)
              </button>
              <button
                onClick={() => handlePrebuildToggle(false)}
                className={`p-4 font-black uppercase text-[10px] border-2 transition-all ${quote.prebuild?.selected === false ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-400 hover:border-black"}`}
              >
                Decline ($0)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-black text-xs italic">02</span>
            <label className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Freight Routing</label>
          </div>

          <div className="space-y-4">
            <select 
              className="w-full p-6 font-black uppercase text-sm border-4 border-black focus:shadow-[8px_8px_0_0_rgba(13,0,76,1)] outline-none bg-white appearance-none cursor-pointer"
              value={quote.destination?.city || ""}
              onChange={(e) => handleCitySelect(e.target.value)}
            >
              <option value="">-- Select Destination --</option>
              {data.cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>

            {quote.destination?.city && (
              <div className="p-8 border-4 border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest">Live Rate</div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Logistics Tier</p>
                    <p className="text-xl font-black text-black uppercase tracking-tighter leading-none">{currentTier}</p>
                    <p className="text-[9px] font-bold text-indigo-600 mt-2 uppercase">{quote.destination.city}</p>
                    {quote.destination.description && (
                       <p className="text-[8px] text-gray-400 mt-1 max-w-[200px] uppercase">{quote.destination.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-[#0D004C] tracking-tighter">${quote.destination.sell}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Inc. Fuel Surcharge</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Logistics & QA</p>
          <p className="text-4xl font-black text-black tracking-tighter">
            ${((quote.prebuild?.sell || 0) + (quote.destination?.sell || 0)).toFixed(2)}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-12 py-5 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">
            Back
          </button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-16 py-5 font-black uppercase text-[10px] tracking-widest transition-all ${isComplete ? "bg-black text-white hover:bg-[#0D004C] shadow-[8px_8px_0_0_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Generate Quote
          </button>
        </div>
      </footer>
    </div>
  );
}