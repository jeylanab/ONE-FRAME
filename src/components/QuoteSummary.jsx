import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function QuoteSummary({ quote, quoteId, onBack }) {
  const [isSaved, setIsSaved] = useState(false);
  const [header, setHeader] = useState({ title: "", subtitle: "" });

  // 1. Grouping Items as per your request
  const materials = [
    { label: `Frame: ${quote.frame?.name || "Standard Profile"} (${quote.stats?.lm.toFixed(2)}m)`, value: (quote.frame?.sell || 0) * (quote.stats?.lm || 0) },
    { label: `Corners: ${quote.corners?.name || "Straight Cut"}`, value: quote.corners?.sell || 0 },
    { label: `Fabric: ${quote.fabric?.name || "Selected Media"} (${quote.stats?.sqm.toFixed(2)}sqm)`, value: (quote.fabric?.sell || 0) * (quote.stats?.sqm || 0) },
    { label: `Lighting: ${quote.lighting?.description || "No Illumination"}`, value: (quote.lighting?.sell || 0) * (quote.stats?.sqm || 0) },
    { label: `Controls: ${quote.control?.description || "Not Required"}`, value: quote.control?.sell || 0 },
    { label: `Acoustics: ${quote.acoustics?.description || "None"}`, value: (quote.acoustics?.sell || 0) * (quote.stats?.sqm || 0) },
    { label: `Powder Coating: ${quote.powderCoating?.name || "Standard"}`, value: quote.powderCoating?.sell || 0 },
    { label: "Factory Prebuild & QC", value: quote.prebuild?.sell || 0 },
  ];

  const designItems = [
    { label: "Creative Design Service", value: quote.design?.sell || 0 },
    { label: "Technical Setup Fee", value: quote.setup?.sell || 0 },
  ];

  const freightItems = [
    { label: `Logistics: ${quote.destination?.city || "Collection"} (${quote.destination?.tier || "Standard Freight & Packaging"})`, value: quote.destination?.sell || 0 },
  ];

  // Calculate Total
  const allItems = [...materials, ...designItems, ...freightItems];
  const grandTotal = Math.round(allItems.reduce((acc, item) => acc + item.value, 0) * 100) / 100;

  useEffect(() => {
    const finalizeQuote = async () => {
      try {
        const headerRef = doc(db, "content", "step7_summary");
        const headerSnap = await getDoc(headerRef);
        if (headerSnap.exists()) setHeader(headerSnap.data());

        const quoteRef = doc(db, "quotes", quoteId);
        await updateDoc(quoteRef, {
          grandTotal,
          status: "completed",
          updatedAt: serverTimestamp(),
        });
        setIsSaved(true);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    if (quoteId && !isSaved) finalizeQuote();
  }, [quoteId, isSaved, grandTotal]);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn text-black">
      {/* HEADER */}
      <div className="mb-12 border-l-8 border-black pl-6">
        <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
          {header.title || "Project Quote"}
        </h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">
          REF: {quoteId} | Configuration Summary
        </p>
      </div>

      {/* MAIN QUOTE TABLE (NO PRICING PER LINE) */}
      <div className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="bg-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-black">
          Selected Project Specifications
        </div>
        
        <div className="p-8 space-y-8">
          {/* SECTION: MATERIALS */}
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Material Components</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {materials.map((item, i) => (
                <p key={i} className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" /> {item.label}
                </p>
              ))}
            </div>
          </div>

          {/* SECTION: DESIGN (SPACED BELOW) */}
          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Professional Services</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {designItems.map((item, i) => (
                <p key={i} className="text-xs font-black uppercase tracking-tight flex items-center gap-2 text-indigo-900">
                  <span className="w-1.5 h-1.5 bg-indigo-900 rounded-full" /> {item.label}
                </p>
              ))}
            </div>
          </div>

          {/* SECTION: FREIGHT (SPACED BELOW) */}
          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Distribution</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {freightItems.map((item, i) => (
                <p key={i} className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" /> {item.label}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* GRAND TOTAL ONLY */}
        <div className="bg-[#0D004C] text-white p-8 flex justify-between items-center">
          <span className="font-black text-2xl uppercase tracking-tighter">Total Investment</span>
          <div className="text-right">
            <span className="font-black text-4xl text-yellow-400 tracking-tighter">
              ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Excluding GST</p>
          </div>
        </div>
      </div>

{/* INTERNAL USE: FRAME SPECS SECTION */}
<div className="mt-20 pt-10 border-t-4 border-black border-dashed">
  <div className="flex items-center gap-4 mb-8">
    <h3 className="text-sm font-black uppercase bg-black text-white px-3 py-1 tracking-widest">Internal Frame Specs</h3>
    <div className="flex-1 h-px bg-gray-200" />
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <InternalMetric label="Extrusion" value={quote.frame?.name || "N/A"} />
    <InternalMetric label="Profile Depth" value={quote.frame?.size || "N/A"} />
    <InternalMetric label="Total Perimeter" value={`${quote.stats?.lm?.toFixed(2) || 0} LM`} />
    <InternalMetric label="Total Area" value={`${quote.stats?.sqm?.toFixed(2) || 0} SQM`} />
    <InternalMetric label="Dimensions (AxB)" value={`${quote.measurements?.a} x ${quote.measurements?.b} mm`} />
    
    {/* FIXED CALCULATION BELOW */}
    <InternalMetric 
      label="Est. Frame Weight" 
      value={`${((quote.stats?.lm || 0) * (quote.frame?.weight || 0)).toFixed(1)} kg`} 
    />
    
    <InternalMetric 
      label="Est. Total Weight" 
      value={`${(
        ((quote.stats?.lm || 0) * (quote.frame?.weight || 0)) + // Frame
        ((quote.stats?.sqm || 0) * (quote.faceFabric?.weight || 0)) + // Fabric
        ((quote.lighting?.id !== "NA") ? (quote.stats?.sqm || 0) * 1.2 : 0) // Lighting overhead
      ).toFixed(1)} kg`} 
    />
    
    <InternalMetric label="Shape Code" value={quote.shape || "RECT"} />
  </div>
</div>

      {/* FOOTER ACTIONS (ONLY BACK BUTTON REMAINS) */}
      <div className="mt-12">
        <button onClick={onBack} className="w-full md:w-auto px-12 py-5 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" /> Modify Configuration
        </button>
      </div>
    </div>
  );
}

function InternalMetric({ label, value }) {
  return (
    <div className="flex flex-col">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">{label}</p>
      <p className="text-xs font-bold text-black uppercase tracking-tight">{value}</p>
    </div>
  );
}