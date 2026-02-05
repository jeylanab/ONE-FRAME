import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  UserIcon, 
  CalculatorIcon, 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon 
} from "@heroicons/react/24/solid";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
       <div className="text-center font-black uppercase tracking-[0.2em] animate-pulse text-[#0D004C]">
          Initializing Ledger...
       </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      {/* ALIGNED HEADER */}
      <header className="mb-10 flex justify-between items-end border-b-2 border-gray-100 pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-[#0D004C]">Quotes</h1>
          <p className="text-[#3D85C6] font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Production Engineering Registry
          </p>
        </div>
        <div className="bg-[#0D004C] text-white p-5 rounded-xl shadow-lg border-b-4 border-yellow-400">
          <p className="text-3xl font-black leading-none">{quotes.length}</p>
          <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70">Total Entries</p>
        </div>
      </header>

      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="border border-gray-200 rounded-2xl bg-white hover:border-[#3D85C6] transition-all overflow-hidden shadow-sm">
            
            {/* LIST ROW */}
            <div 
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="p-5 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <UserIcon className="w-5 h-5 text-[#0D004C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-yellow-400 text-black px-2 py-0.5 rounded uppercase">
                      {q.adminStatus || "NEW"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {q.sentAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#0D004C]">
                    {q.customer?.name || "Anonymous Client"}
                  </h3>
                </div>
              </div>

              {/* STATS STRIP */}
              <div className="flex gap-10 px-10 border-x border-gray-50">
                <StatSmall label="Shape" value={q.shape} />
                <StatSmall label="Area" value={`${q.stats?.sqm?.toFixed(1)}m²`} />
                <StatSmall label="Shipping" value={q.destination?.tier} />
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xl font-black text-[#3D85C6]">
                    ${q.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {expandedId === q.id ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
              </div>
            </div>

            {/* EXPANDABLE DATA GRID */}
            {expandedId === q.id && (
              <div className="bg-gray-50 p-8 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  
                  <DataColumn icon={<WrenchScrewdriverIcon/>} title="Component Specs">
                    <SpecItem label="Frame" value={`${q.frame?.name} (${q.frame?.size})`} />
                    <SpecItem label="Fabric" value={q.faceFabric?.name} />
                    <SpecItem label="Lighting" value={q.lighting?.name} />
                    <SpecItem label="Finish" value={q.finish?.name} />
                  </DataColumn>

                  <DataColumn icon={<CalculatorIcon/>} title="Engineering Stats">
                    <SpecItem label="Internal" value={`${q.measurements?.a}x${q.measurements?.b}mm`} />
                    <SpecItem label="Perimeter" value={`${q.stats?.lm?.toFixed(2)} LM`} />
                    <SpecItem label="Est. Weight" value={`${(q.estimates?.acousticWeight + 5)?.toFixed(1)}kg`} />
                  </DataColumn>

                  <DataColumn icon={<CurrencyDollarIcon/>} title="Line Items">
                    <div className="space-y-1 mt-2">
                       {q.lineItems?.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-[10px] font-bold py-1 border-b border-gray-200">
                           <span className="text-gray-500 uppercase">{item.label}</span>
                           <span className="text-[#0D004C]">${item.value.toFixed(2)}</span>
                         </div>
                       ))}
                    </div>
                    <div className="bg-[#0D004C] text-white p-3 rounded-lg flex justify-between items-center mt-4 shadow-md">
                       <span className="text-[10px] font-black uppercase">Grand Total</span>
                       <span className="text-lg font-black text-yellow-400">${q.grandTotal?.toFixed(2)}</span>
                    </div>
                  </DataColumn>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Clean UI Components for Alignment
function StatSmall({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-black text-gray-400 uppercase">{label}</p>
      <p className="text-[11px] font-black text-[#0D004C] uppercase">{value || "—"}</p>
    </div>
  );
}

function DataColumn({ icon, title, children }) {
  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#3D85C6] border-b border-gray-200 pb-2">
        <span className="w-4 h-4 text-[#0D004C]">{icon}</span> {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-gray-400 uppercase">{label}</span>
      <span className="text-xs font-black text-[#0D004C] uppercase">{value || "N/A"}</span>
    </div>
  );
}