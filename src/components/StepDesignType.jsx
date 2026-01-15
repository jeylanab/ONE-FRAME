import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { PaintBrushIcon, NoSymbolIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function StepDesignType({ quote, updateQuote, onNext, onBack }) {
  const [designOptions, setDesignOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        // MATCHING YOUR SCHEMA: "designTypes" and ordering by "price"
        const designRef = collection(db, "designTypes");
        const q = query(designRef, orderBy("price", "asc"));
        const snap = await getDocs(q);
        
        const options = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDesignOptions(options);
        setError(null);
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
        setError("Could not connect to designTypes collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const handleSelect = (design) => {
    // Standardizing the selection to the 'quote' state
    updateQuote({ 
      design: {
        id: design.id,
        name: design.title || "N/A", // Matches your 'title' field
        sell: parseFloat(design.price) || 0 // Matches your 'price' field
      } 
    });
  };

  const isSelected = quote?.design?.id !== undefined;

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <ArrowPathIcon className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="font-bold text-gray-500">Loading Design Services...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-[#0D004C]">Design & Concept</h2>
        <p className="text-gray-500">Select a design service level for your project.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* N/A Option - Always needed for forced logic */}
        <div 
          onClick={() => handleSelect({ id: "NA", title: "Not Required", price: 0 })}
          className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
            quote?.design?.id === "NA" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"
          }`}
        >
          <div className={`p-3 rounded-xl ${quote?.design?.id === "NA" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
            <NoSymbolIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">N/A - Not Required</p>
            <p className="text-sm text-gray-400">I will provide my own technical specs.</p>
          </div>
        </div>

        {/* DYNAMIC OPTIONS FROM designTypes */}
        {designOptions.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
              quote?.design?.id === opt.id ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-gray-100 hover:border-indigo-200"
            }`}
          >
            <div className={`p-3 rounded-xl ${quote?.design?.id === opt.id ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"}`}>
              <PaintBrushIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900 text-lg capitalize">{opt.title}</p>
                <p className="font-black text-indigo-600">${parseFloat(opt.price).toLocaleString()}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{opt.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-gray-50">
        <button onClick={onBack} className="text-gray-400 font-bold hover:text-gray-600 transition-colors">
          Back
        </button>
        
        <div className="flex items-center gap-6">
          {isSelected && (
            <p className="text-sm font-bold text-green-600 animate-slideIn">
              Selected: {quote.design.name}
            </p>
          )}
          <button 
            disabled={!isSelected}
            onClick={onNext}
            className={`px-12 py-4 rounded-2xl font-black transition-all ${
              isSelected 
              ? "bg-[#0D004C] text-white shadow-xl hover:scale-105" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue to Geometry →
          </button>
        </div>
      </div>
    </div>
  );
}