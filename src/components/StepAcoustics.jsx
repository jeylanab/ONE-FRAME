import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepAcoustics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcousticData = async () => {
      const snap = await getDocs(collection(db, "acoustics"));
      setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAcousticData();
  }, []);

  const handleSelect = (item) => {
    // Acoustic weight is often significant (e.g., 2.5kg per SQM)
    const acousticWeight = quote.stats.sqm * (item.weightPerSqm || 2.5);
    
    updateQuote({ 
      acoustics: item,
      estimates: { 
        ...quote.estimates, 
        acousticWeight: item.id === "NA" ? 0 : acousticWeight 
      }
    });
  };

  const isComplete = quote.acoustics?.id !== undefined;
  
  // Calculate running subtotal for this step
  const acousticSubtotal = quote.stats.sqm * (quote.acoustics?.sell || 0);

  if (loading) return <div className="p-10 text-center animate-pulse">Filtering Acoustic Options...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-[#0D004C]">Acoustic Treatment</h2>
          <p className="text-gray-500 text-sm">Select sound-absorbent infill for your {quote.frame?.size} frame.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <p className="text-[10px] font-bold text-indigo-400 uppercase">Selected Frame</p>
          <p className="text-sm font-bold text-indigo-900">{quote.frame?.code || "No Frame Selected"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* N/A Option */}
        <div 
          onClick={() => handleSelect({ id: "NA", description: "None / Not Required", sell: 0 })}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            quote.acoustics?.id === "NA" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"
          }`}
        >
          <p className="font-bold text-gray-800">No Acoustics</p>
          <p className="text-xs text-gray-400 mt-2">Standard hollow frame configuration.</p>
        </div>

        {/* Firestore Options */}
        {data.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              quote.acoustics?.id === item.id ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <p className="font-bold text-gray-800 leading-tight">{item.size} {item.description}</p>
              <span className="text-indigo-600 font-black ml-2">${item.sell}/sqm</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Effect: High NRC Rating</p>
          </div>
        ))}
      </div>

      {/* CONTINUITY SUMMARY BAR */}
      <div className="mt-10 p-6 bg-[#0D004C] rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] uppercase opacity-60 font-bold">Acoustics Subtotal</p>
            <p className="text-xl font-black">${acousticSubtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-60 font-bold">Total Est. Weight</p>
            <p className="text-xl font-black">
              {(
                quote.estimates.frameWeight + 
                quote.estimates.fabricWeight + 
                quote.estimates.lightingWeight + 
                (quote.estimates.acousticWeight || 0)
              ).toFixed(1)} kg
            </p>
          </div>
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
            Go to Logistics
          </button>
        </div>
      </div>
    </div>
  );
}