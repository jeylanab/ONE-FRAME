import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ChevronDownIcon, ChevronUpIcon, UserIcon, CalculatorIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track which item is open

  useEffect(() => {
    const fetchFinalQuotes = async () => {
      try {
        const q = query(collection(db, "final_quotes"), orderBy("sentAt", "desc"));
        const snap = await getDocs(q);
        setQuotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Admin Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinalQuotes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse text-black">Initializing Ledger...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      {/* HEADER BLOCK */}
      <header className="mb-12 border-l-[12px] border-black pl-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none text-black">Quotes</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Production Engineering Registry</p>
        </div>
        <div className="bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(234,179,8,1)]">
          <p className="text-4xl font-black leading-none">{quotes.length}</p>
          <p className="text-[9px] font-black uppercase tracking-widest mt-1 text-yellow-400">Total Entries</p>
        </div>
      </header>

      <div className="space-y-6">
        {quotes.map((q) => (
          <div key={q.id} className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
            
            {/* LIST ROW (Always Visible) */}
            <div 
              onClick={() => toggleExpand(q.id)}
              className="p-6 cursor-pointer hover:bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="bg-gray-100 p-4 border-2 border-black">
                  <UserIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <span className="text-[9px] font-black bg-yellow-400 px-2 py-0.5 uppercase mb-1 inline-block">
                    {q.adminStatus || "NEW"}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight leading-none">
                    {q.customer?.name || "Anonymous Client"}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                    {q.customer?.email || "No Email Provided"} • {q.sentAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center px-8 border-x-0 md:border-x-2 border-gray-100">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Shape</p>
                  <p className="text-xs font-black uppercase">{q.shape || "Custom"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Area</p>
                  <p className="text-xs font-black">{q.stats?.sqm?.toFixed(2)}m²</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Frame</p>
                  <p className="text-xs font-black uppercase">{q.frame?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-black text-[#0D004C] tracking-tighter">
                    ${q.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] font-black text-gray-300 uppercase leading-none">Ex. GST</p>
                </div>
                {expandedId === q.id ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
              </div>
            </div>

            {/* EXPANDABLE SECTION (Deep Dive) */}
            {expandedId === q.id && (
              <div className="border-t-2 border-black bg-gray-50 p-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Technical Specs */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black border-b border-black pb-2">
                      <WrenchScrewdriverIcon className="w-4 h-4" /> Component Specs
                    </h4>
                    <div className="space-y-3">
                      <SpecItem label="Frame Code" value={`${q.frame?.ofCode || q.frame?.name} (${q.frame?.size})`} />
                      <SpecItem label="Fabric" value={q.faceFabric?.name || "Standard"} />
                      <SpecItem label="Lighting" value={q.lighting?.name || "None"} />
                      <SpecItem label="Controller" value={q.control?.name || "N/A"} />
                      <SpecItem label="Finish" value={q.finish?.name || "Mill Finish"} />
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black border-b border-black pb-2">
                      <CalculatorIcon className="w-4 h-4" /> Engineering Stats
                    </h4>
                    <div className="space-y-3">
                      <SpecItem label="Internal Dimensions" value={`${q.measurements?.a} x ${q.measurements?.b} mm`} />
                      <SpecItem label="Total Perimeter" value={`${q.stats?.lm?.toFixed(2)} LM`} />
                      <SpecItem label="Est. Total Weight" value={`${(q.estimates?.acousticWeight + 5)?.toFixed(1)} kg`} />
                      <SpecItem label="Shipping Tier" value={q.destination?.tier || "Collection"} />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-2">
                      Line Item Investment
                    </h4>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                      {q.lineItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[10px] font-bold py-1 border-b border-gray-200 last:border-0">
                          <span className="text-gray-500 uppercase truncate pr-4">{item.label}</span>
                          <span className="text-black font-mono">${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-black text-white p-3 flex justify-between items-center mt-4">
                       <span className="text-[10px] font-black uppercase">Grand Total</span>
                       <span className="text-lg font-black text-yellow-400">${q.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Sub-component for clean rendering
function SpecItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
      <span className="text-xs font-black text-black uppercase">{value}</span>
    </div>
  );
}