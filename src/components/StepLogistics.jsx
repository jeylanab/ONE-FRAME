import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepLogistics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ cities: [], freightMatrix: [] });
  const [loading, setLoading] = useState(true);

  // 1. Calculate the final logistics profile
  const totalWeight = (
    (quote.estimates?.frameWeight || 0) +
    (quote.estimates?.fabricWeight || 0) +
    (quote.estimates?.lightingWeight || 0) +
    (quote.estimates?.acousticWeight || 0)
  );

  const maxDim = Math.max(quote.measurements?.a || 0, quote.measurements?.b || 0);

  // Determine Tier based on client requirements
  const getTier = () => {
    if (totalWeight > 100 || maxDim > 3000) return "pallet / crate";
    if (maxDim > 2400) return "large - complete";
    if (maxDim > 1800) return "medim - complete"; // Note: matched your spelling 'medim' from requirements
    return "small - complete";
  };

  const currentTier = getTier();

  useEffect(() => {
    const fetchLogisticsData = async () => {
      const freightSnap = await getDocs(collection(db, "freight"));
      const freightList = freightSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get unique cities for the dropdown
      const uniqueCities = [...new Set(freightList.map(f => f.city))];
      
      setData({ cities: uniqueCities, freightMatrix: freightList });
      setLoading(false);
    };
    fetchLogisticsData();
  }, []);

  const handleCitySelect = (city) => {
    const matchedFreight = data.freightMatrix.find(
      f => f.city === city && f.tier === currentTier
    );
    updateQuote({ destination: { city, tier: currentTier, sell: matchedFreight?.sell || 0 } });
  };

  const handlePrebuildToggle = (val) => {
    // Standard prebuild is $249.00 based on requirements
    updateQuote({ prebuild: { selected: val, sell: val ? 249 : 0 } });
  };

  const isComplete = quote.destination?.city && quote.prebuild?.selected !== undefined;

  if (loading) return <div className="p-10 text-center">Calculating Freight Matrix...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-[#0D004C]">Logistics & Dispatch</h2>
        <p className="text-gray-500">Based on a total weight of <span className="font-bold text-indigo-600">{totalWeight.toFixed(1)}kg</span>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PREBUILD SECTION */}
        <div className="space-y-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">Factory Prebuild</label>
          <p className="text-xs text-gray-500 mb-4">Full assembly and inspection prior to dispatch.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePrebuildToggle(true)}
              className={`p-4 rounded-xl font-bold border-2 transition-all ${quote.prebuild?.selected === true ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-100 text-gray-400"}`}
            >
              Yes (+$249)
            </button>
            <button
              onClick={() => handlePrebuildToggle(false)}
              className={`p-4 rounded-xl font-bold border-2 transition-all ${quote.prebuild?.selected === false ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-100 text-gray-400"}`}
            >
              No ($0)
            </button>
          </div>
        </div>

        {/* FREIGHT SECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Destination</label>
          <select 
            className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-600 outline-none bg-white shadow-sm"
            value={quote.destination?.city || ""}
            onChange={(e) => handleCitySelect(e.target.value)}
          >
            <option value="">-- Select City --</option>
            {data.cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>

          {quote.destination?.city && (
            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl animate-slideDown">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-green-600 uppercase">Auto-Calculated Tier</p>
                  <p className="text-sm font-black text-green-900 uppercase">{currentTier}</p>
                </div>
                <p className="text-xl font-black text-green-700">${quote.destination.sell}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FINAL NAVIGATION BAR */}
      <div className="mt-10 p-6 bg-[#0D004C] rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest">Logistics Subtotal</p>
          <p className="text-2xl font-black">${((quote.prebuild?.sell || 0) + (quote.destination?.sell || 0)).toFixed(2)}</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={onBack} className="flex-1 md:flex-none px-8 py-3 font-bold opacity-60 hover:opacity-100">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`flex-1 md:flex-none px-12 py-4 rounded-2xl font-black transition-all ${
              isComplete ? "bg-yellow-400 text-black shadow-xl hover:scale-105" : "bg-white/10 text-white/20 cursor-not-allowed"
            }`}
          >
            Generate Final Summary
          </button>
        </div>
      </div>
    </div>
  );
}