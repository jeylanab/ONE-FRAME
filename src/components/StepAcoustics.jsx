import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepAcoustics({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState([]);
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcousticData = async () => {
      try {
        const headerRef = doc(db, "content", "step5_acoustics");
        const [snap, headerSnap] = await Promise.all([
          getDocs(collection(db, "acoustics")),
          getDoc(headerRef)
        ]);

        if (headerSnap.exists()) {
          setHeader(headerSnap.data());
        }

        setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcousticData();
  }, []);

  const handleSelect = (item) => {
    const weightVal = parseFloat(item.weightPerSqm) || 2.5;
    const sqm = quote.stats?.sqm || 0;
    const acousticWeight = sqm * weightVal;
    
    updateQuote({ 
      acoustics: {
        ...item,
        name: item.description || "Acoustic Panel",
        sell: parseFloat(item.sellSQM) || 0 
      },
      estimates: { 
        ...quote.estimates, 
        acousticWeight: item.id === "NA" ? 0 : acousticWeight 
      }
    });
  };

  const isComplete = quote.acoustics?.id !== undefined;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filtering Acoustic Media...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">
          {header.title || "Acoustic Treatment"}
        </h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {header.subtitle || `Select sound-absorbent infill for ${quote.frame?.code || "selected"} frame.`}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* N/A Option */}
        <div 
          onClick={() => handleSelect({ id: "NA", description: "None / Not Required", sellSQM: 0 })}
          className={`p-8 border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[160px] ${
            quote.acoustics?.id === "NA" 
            ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
            : "border-gray-100 hover:border-black text-gray-400"
          }`}
        >
          <p className="font-black uppercase text-sm tracking-widest">No Acoustics</p>
          <p className="text-[10px] font-bold uppercase mt-2">Standard hollow frame configuration.</p>
        </div>

        {/* Firestore Options */}
        {data.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`p-8 border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[160px] relative ${
              quote.acoustics?.id === item.id 
              ? "border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
              : "border-gray-100 hover:border-black"
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div className="space-y-1">
                <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">{item.code}</span>
                <p className="font-black text-black text-lg uppercase tracking-tighter leading-none">
                   {item.description}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{item.size} Thickness</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-900 font-black text-2xl tracking-tighter">${item.sellSQM}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase">per sqm</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER: NAVIGATION ONLY */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex justify-end items-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onBack} 
          className="px-12 py-5 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button 
          disabled={!isComplete} 
          onClick={onNext}
          className={`px-16 py-5 font-black uppercase text-[10px] tracking-widest transition-all ${
            isComplete 
            ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0D004C]" 
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Go to Logistics
        </button>
      </footer>
    </div>
  );
}