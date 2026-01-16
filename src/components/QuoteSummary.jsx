import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { CheckCircleIcon, PrinterIcon } from "@heroicons/react/24/solid";

export default function QuoteSummary({ quote, quoteId, onBack }) {
  const [isSaved, setIsSaved] = useState(false);

  // 1. Calculate the Final Totals with Smart Fallbacks
  const lineItems = [
    { 
      label: "Creative Design Service", 
      value: quote.design?.sell || 0 
    },
    { 
      label: "Technical Setup Fee", 
      value: quote.setup?.sell || 0 
    },
    { 
      // Use 'name' or 'ofCode' from the frame object
      label: `Frame: ${quote.frame?.name || quote.frame?.ofCode || "Not Selected"} (${quote.stats?.lm.toFixed(2)}m)`, 
      value: (quote.frame?.sell || 0) * (quote.stats?.lm || 0) 
    },
    { 
      label: `Corners: ${quote.corners?.name || "Straight Cut"}`, 
      value: quote.corners?.sell || 0 
    },
    { 
      label: `Fabric: ${quote.fabric?.name || quote.fabric?.description || "Selected Media"} (${quote.stats?.sqm.toFixed(2)}sqm)`, 
      value: (quote.fabric?.sell || 0) * (quote.stats?.sqm || 0) 
    },
    { 
      label: `Lighting: ${quote.lighting?.description || "No Illumination"}`, 
      value: (quote.lighting?.sell || 0) * (quote.stats?.sqm || 0) 
    },
    { 
      label: `Controls: ${quote.control?.description || "Not Required"}`, 
      value: quote.control?.sell || 0 
    },
    { 
      label: `Acoustics: ${quote.acoustics?.description || "None"}`, 
      value: (quote.acoustics?.sell || 0) * (quote.stats?.sqm || 0) 
    },
    { 
      label: `Powder Coating: ${quote.powderCoating?.name || "Standard Finish"}`, 
      value: quote.powderCoating?.sell || 0 
    },
    { 
      label: "Factory Prebuild & QC", 
      value: quote.prebuild?.sell || 0 
    },
    { 
      label: `Logistics: ${quote.destination?.city || "Collection"} (${quote.destination?.tier || "Standard"})`, 
      value: quote.destination?.sell || 0 
    },
  ];

  // Fix precision by rounding the grand total to 2 decimal places
  const grandTotal = Math.round(lineItems.reduce((acc, item) => acc + item.value, 0) * 100) / 100;

  // 2. Final Firestore Persistence
  const finalizeQuote = async () => {
    try {
      const quoteRef = doc(db, "quotes", quoteId);
      await updateDoc(quoteRef, {
        ...quote,
        grandTotal,
        status: "completed",
        updatedAt: serverTimestamp(),
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Error finalizing quote:", err);
    }
  };

  useEffect(() => {
    if (quoteId && !isSaved) finalizeQuote();
  }, [quoteId]);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-12 border-l-8 border-black pl-6">
        <div>
          <h2 className="text-5xl font-black text-black uppercase tracking-tighter">Quote Summary</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Review configuration and final engineering totals.</p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSaved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {isSaved ? "✓ Persistent & Locked" : "Saving to Cloud..."}
          </span>
          <p className="text-[9px] text-gray-300 mt-2 font-mono uppercase">REF: {quoteId}</p>
        </div>
      </div>

      {/* ITEMIZATION TABLE */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-[10px] uppercase tracking-[0.2em] text-white">
              <th className="px-8 py-4">Component Specification</th>
              <th className="px-8 py-4 text-right">Investment (Ex. GST)</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-100">
            {lineItems.map((item, idx) => (
              <tr key={idx} className={item.value === 0 ? "bg-gray-50/50" : "bg-white"}>
                <td className="px-8 py-4">
                    <p className={`text-xs font-black uppercase tracking-tight ${item.value === 0 ? "text-gray-300" : "text-black"}`}>
                        {item.label}
                    </p>
                </td>
                <td className={`px-8 py-4 text-sm font-black text-right ${item.value === 0 ? "text-gray-200" : "text-[#0D004C]"}`}>
                  {item.value === 0 ? "INCLUDED" : `$${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#0D004C] text-white">
              <td className="px-8 py-8 font-black text-2xl uppercase tracking-tighter">Grand Total</td>
              <td className="px-8 py-8 font-black text-4xl text-right text-yellow-400 tracking-tighter">
                ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* METRICS & SPECS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border-2 border-black text-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Structural Weight</p>
          <p className="text-2xl font-black text-black">
            {((quote.estimates?.frameWeight || 0) + (quote.estimates?.fabricWeight || 0) + (quote.estimates?.lightingWeight || 0) + (quote.estimates?.acousticWeight || 0)).toFixed(1)} kg
          </p>
        </div>
        <div className="p-6 border-2 border-black text-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Perimeter</p>
          <p className="text-2xl font-black text-black">{quote.stats?.lm.toFixed(2)} LM</p>
        </div>
        <div className="p-6 border-2 border-black text-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Surface Area</p>
          <p className="text-2xl font-black text-black">{quote.stats?.sqm.toFixed(2)} SQM</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 no-print">
        <button onClick={onBack} className="flex-1 py-5 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">
          Modify Selections
        </button>
        <button onClick={() => window.print()} className="flex-1 py-5 bg-white border-2 border-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <PrinterIcon className="w-5 h-5" /> Generate PDF
        </button>
        <button className="flex-1 py-5 bg-black text-white font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[8px_8px_0px_0px_rgba(13,0,76,1)] hover:translate-y-[-2px] transition-all">
          <CheckCircleIcon className="w-5 h-5 text-yellow-400" /> Send Quote
        </button>
      </div>
    </div>
  );
}