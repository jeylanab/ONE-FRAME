import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLogistics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ cities: [], freightMatrix: [] });
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);

  // Helper for exact tier matching against Firestore strings
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '').trim() || "";

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
        const headerRef = doc(db, "content", "step6_logistics");
        const [freightSnap, headerSnap] = await Promise.all([
          getDocs(collection(db, "freight")),
          getDoc(headerRef)
        ]);

        if (headerSnap.exists()) setHeader(headerSnap.data());

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
    const targetTierNormalized = normalize(currentTier);

    const matchedFreight = data.freightMatrix.find(f => {
      return f.location === selectedLocation && normalize(f.tier) === targetTierNormalized;
    });

    updateQuote({ 
      destination: { 
        city: selectedLocation, 
        tier: currentTier, 
        sell: matchedFreight ? parseFloat(matchedFreight.sell) : 0,
        description: matchedFreight?.description || "",
        boxSize: matchedFreight?.boxSize || ""
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
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic leading-none">
            {header.title || "Logistics & Dispatch"}
          </h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mt-2">
            {header.subtitle || "Route optimization based on system morphology."}
          </p>
        </div>
        <div className="text-right border-r-4 border-black pr-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Payload</p>
          <p className="text-3xl font-black text-black tracking-tighter">{totalWeight.toFixed(1)}kg</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 01. QUALITY ASSURANCE */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block underline decoration-2 underline-offset-4 italic">01. Quality Assurance</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => handlePrebuildToggle(true)}
              className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                quote.prebuild?.selected === true 
                ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <div>
                <p className="font-black text-sm uppercase tracking-tighter text-black">Include Pre-Assembly</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Recommended</p>
              </div>
              <p className="text-lg font-black text-black tracking-tighter">+$249.00</p>
            </div>

            <div 
              onClick={() => handlePrebuildToggle(false)}
              className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                quote.prebuild?.selected === false 
                ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                : "border-gray-100 hover:border-black text-gray-400"
              }`}
            >
              <div>
                <p className="font-black text-sm uppercase tracking-tighter text-black">Decline QA</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Direct Dispatch</p>
              </div>
              <p className="text-lg font-black text-black tracking-tighter">$0.00</p>
            </div>
          </div>
        </section>

        {/* 02. FREIGHT ROUTING */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block underline decoration-2 underline-offset-4 italic">02. Freight Routing</label>
          <div className="space-y-4">
            <div className="relative">
              <select 
                className="w-full p-6 font-black uppercase text-sm border-2 border-black focus:shadow-[8px_8px_0_0_rgba(13,0,76,1)] outline-none bg-white appearance-none cursor-pointer"
                value={quote.destination?.city || ""}
                onChange={(e) => handleCitySelect(e.target.value)}
              >
                <option value="">-- Select Destination --</option>
                {data.cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none font-black text-xs">▼</div>
            </div>

            {quote.destination?.city && (
              <div className="p-8 border-2 border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest border-l-2 border-b-2 border-black">Live Rate</div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Tier: {currentTier}</p>
                    <p className="text-2xl font-black text-black uppercase tracking-tighter leading-none">{quote.destination.city}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-3 uppercase tracking-tight">Box: {quote.destination.boxSize || "Standard Dimensions"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-[#0D004C] tracking-tighter italic leading-none">${quote.destination.sell.toFixed(2)}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase mt-2">Inc. Fuel Surcharge</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Logistics & QA</p>
          <p className="text-4xl font-black text-black tracking-tighter leading-none">
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