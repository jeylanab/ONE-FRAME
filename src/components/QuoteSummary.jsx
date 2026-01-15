import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { CheckCircleIcon, PrinterIcon, ShareIcon } from "@heroicons/react/24/solid";

export default function QuoteSummary({ quote, quoteId, onBack }) {
  const [isSaved, setIsSaved] = useState(false);

  // 1. Calculate the Final Totals
  const lineItems = [
    { label: "Design Service", value: quote.design?.sell || 0 },
    { label: "Setup Fee", value: quote.setup?.sell || 0 },
    { label: `Frame: ${quote.frame?.code} (${quote.stats.lm.toFixed(2)}m)`, value: (quote.frame?.sell || 0) * quote.stats.lm },
    { label: `Corners: ${quote.corners?.type}`, value: quote.corners?.sell || 0 },
    { label: `Fabric: ${quote.fabric?.description} (${quote.stats.sqm.toFixed(2)}sqm)`, value: (quote.fabric?.sell || 0) * quote.stats.sqm },
    { label: `Lighting: ${quote.lighting?.description}`, value: (quote.lighting?.sell || 0) * quote.stats.sqm },
    { label: `Controls: ${quote.control?.description}`, value: quote.control?.sell || 0 },
    { label: `Acoustics: ${quote.acoustics?.description}`, value: (quote.acoustics?.sell || 0) * quote.stats.sqm },
    { label: `Powder Coating: ${quote.powderCoating?.name}`, value: quote.powderCoating?.sell || 0 },
    { label: "Factory Prebuild", value: quote.prebuild?.sell || 0 },
    { label: `Freight: ${quote.destination?.city} (${quote.destination?.tier})`, value: quote.destination?.sell || 0 },
  ];

  const grandTotal = lineItems.reduce((acc, item) => acc + item.value, 0);

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
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#0D004C]">Quote Summary</h2>
          <p className="text-gray-500">Review your configuration and final pricing.</p>
        </div>
        <div className="text-right">
          <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
            {isSaved ? "Verified & Saved" : "Finalizing..."}
          </span>
          <p className="text-[10px] text-gray-400 mt-2 font-mono">{quoteId}</p>
        </div>
      </div>

      {/* ITEMIZATION TABLE */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Price (Excl. GST)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lineItems.map((item, idx) => (
              <tr key={idx} className={item.value === 0 ? "opacity-30" : "opacity-100"}>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.label}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                  {item.value === 0 ? "—" : `$${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#0D004C] text-white">
              <td className="px-6 py-6 font-black text-lg">Grand Total</td>
              <td className="px-6 py-6 font-black text-3xl text-right text-yellow-400">
                ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* METRICS & SPECS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
          <p className="text-[10px] uppercase font-bold text-indigo-400">Total Weight</p>
          <p className="text-xl font-black text-indigo-900">
            {(quote.estimates.frameWeight + quote.estimates.fabricWeight + quote.estimates.lightingWeight + (quote.estimates.acousticWeight || 0)).toFixed(1)} kg
          </p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
          <p className="text-[10px] uppercase font-bold text-indigo-400">Total Perimeter</p>
          <p className="text-xl font-black text-indigo-900">{quote.stats.lm.toFixed(2)} LM</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
          <p className="text-[10px] uppercase font-bold text-indigo-400">Total Area</p>
          <p className="text-xl font-black text-indigo-900">{quote.stats.sqm.toFixed(2)} SQM</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={onBack} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50">
          Modify Selections
        </button>
        <button className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-200">
          <PrinterIcon className="w-5 h-5" /> Print / Save PDF
        </button>
        <button className="flex-1 py-4 bg-[#0D004C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all">
          <CheckCircleIcon className="w-5 h-5 text-yellow-400" /> Email to Client
        </button>
      </div>
    </div>
  );
}