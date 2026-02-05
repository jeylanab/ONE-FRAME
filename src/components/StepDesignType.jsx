import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { PaintBrushIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

export default function StepDesignType({ quote, updateQuote, onNext, onBack }) {
  const [designOptions, setDesignOptions] = useState([]);
  const [header, setHeader] = useState({ title: "", subtitle: "" }); // State for Dynamic Words
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Dynamic Header Words from WordAdmin collection
        const headerRef = doc(db, "content", "step1_design");
        const headerSnap = await getDoc(headerRef);
        if (headerSnap.exists()) {
          setHeader(headerSnap.data());
        }

        // 2. Fetch Design Tiers
        const designRef = collection(db, "designTypes");
        const q = query(designRef, orderBy("price", "asc"));
        const designSnap = await getDocs(q);
        
        const options = designSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDesignOptions(options);
        setError(null);
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
        setError("System offline: Could not connect to Matrix.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (design) => {
    updateQuote({ 
      design: {
        id: design.id,
        name: design.title || design.name || "N/A",
        sell: parseFloat(design.price) || 0
      } 
    });
  };

  const isSelected = quote?.design?.id !== undefined;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Specification Matrix...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* DYNAMIC HEADER - Fetched from WordAdmin */}
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">
          {header.title || "Design & Concept"}
        </h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {header.subtitle || "Select technical service level for project specification."}
        </p>
      </header>

      {error && (
        <div className="p-6 border-2 border-red-500 bg-red-50 text-red-600 font-black uppercase text-xs tracking-widest">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* N/A Option */}
        <div 
          onClick={() => handleSelect({ id: "NA", title: "Not Required", price: 0 })}
          className={`group p-8 border-2 cursor-pointer transition-all flex items-start gap-6 relative h-full ${
            quote?.design?.id === "NA" 
            ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
            : "border-gray-100 hover:border-black"
          }`}
        >
          <div className={`p-4 border-2 shrink-0 ${quote?.design?.id === "NA" ? "bg-black text-white border-black" : "bg-gray-50 text-gray-300 border-gray-100"}`}>
            <NoSymbolIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-black text-xl uppercase tracking-tighter">Not Required</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Client providing own technical files</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase mt-2">
              Bypass internal design services. Requires production-ready vector or CAD assets.
            </p>
          </div>
        </div>

        {/* DYNAMIC OPTIONS */}
        {designOptions.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={`group p-8 border-2 cursor-pointer transition-all flex items-start gap-6 relative h-full ${
              quote?.design?.id === opt.id 
              ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
              : "border-gray-100 hover:border-black"
            }`}
          >
            <div className={`p-4 border-2 shrink-0 ${quote?.design?.id === opt.id ? "bg-black text-white border-black" : "bg-gray-100 text-black border-black"}`}>
              <PaintBrushIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-black text-black text-xl uppercase tracking-tighter">{opt.title}</p>
                <p className="font-black text-[#0D004C] text-lg tracking-tighter">${parseFloat(opt.price).toLocaleString()}</p>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed uppercase mt-2">
                {opt.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER NAVIGATION */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onBack} 
          className="px-10 py-4 font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-gray-50 transition"
        >
          Back
        </button>
        
        <div className="flex items-center gap-8">
          {isSelected && (
            <div className="text-right hidden md:block">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Tier</p>
              <p className="text-sm font-black text-black uppercase">{quote.design.name}</p>
            </div>
          )}
          <button 
            disabled={!isSelected}
            onClick={onNext}
            className={`px-12 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
              isSelected 
              ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue to Geometry
          </button>
        </div>
      </footer>
    </div>
  );
}