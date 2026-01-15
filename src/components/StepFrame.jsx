import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFrame({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ frames: [], corners: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrameData = async () => {
      const frameSnap = await getDocs(collection(db, "frame"));
      const cornerSnap = await getDocs(collection(db, "corners"));
      
      setData({
        frames: frameSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        corners: cornerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
      setLoading(false);
    };
    fetchFrameData();
  }, []);

  const handleFrameSelect = (frame) => {
    // Calculate weight for the frame component: LM * Weight/LM
    const frameWeight = quote.stats.lm * (frame.weight || 0);
    updateQuote({ frame, estimates: { ...quote.estimates, frameWeight } });
  };

  const handleCornerSelect = (corner) => {
    updateQuote({ corners: corner });
  };

  // Validation: Both frame and corner must be selected (even if N/A)
  const isComplete = quote.frame?.id && quote.corners?.id;

  if (loading) return <div className="p-10 text-center font-bold">Fetching Frame Profiles...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-black text-[#0D004C]">Frame & Structural Joiners</h2>
        <p className="text-gray-500 text-sm">Select the aluminum profile and the corner finish required.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: FRAME SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">Select Profile</label>
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {/* N/A Option */}
            <div 
              onClick={() => handleFrameSelect({ id: "NA", name: "No Frame", sell: 0, weight: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.frame?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">N/A - Fabric Only</p>
            </div>
            {data.frames.map((f) => (
              <div 
                key={f.id}
                onClick={() => handleFrameSelect(f)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.frame?.id === f.id ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">{f.code} - {f.size}</span>
                  <span className="text-indigo-600 font-black">${f.sell}/m</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{f.description} ({f.type})</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CORNER SELECTION */}
        <div className="space-y-4">
          <label className="text-xs font-black text-indigo-400 uppercase tracking-widest">Select Corner Type</label>
          <div className="grid grid-cols-1 gap-3">
             {/* N/A Option */}
             <div 
              onClick={() => handleCornerSelect({ id: "NA", name: "No Corners", sell: 0 })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.corners?.id === "NA" ? "border-indigo-600 bg-indigo-50" : "border-gray-100"}`}
            >
              <p className="font-bold text-sm">N/A - Straight Cuts Only</p>
            </div>
            {data.corners.map((c) => (
              <div 
                key={c.id}
                onClick={() => handleCornerSelect(c)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${quote.corners?.id === c.id ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-100 hover:border-indigo-200"}`}
              >
                <p className="font-bold text-gray-800 text-sm">{c.type}</p>
                <p className="text-[10px] text-gray-400 leading-tight mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICE CONTINUITY BAR */}
      <div className="mt-10 p-5 bg-[#0D004C] rounded-2xl flex justify-between items-center text-white">
        <div>
          <p className="text-[10px] uppercase opacity-60">Frame Subtotal (based on {quote.stats.lm.toFixed(2)}m)</p>
          <p className="text-xl font-black">
            ${((quote.stats.lm * (quote.frame?.sell || 0)) + (quote.corners?.sell || 0)).toFixed(2)}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 font-bold opacity-60 hover:opacity-100 transition-opacity">Back</button>
          <button 
            disabled={!isComplete}
            onClick={onNext}
            className={`px-8 py-3 rounded-xl font-bold ${isComplete ? "bg-yellow-400 text-black shadow-lg" : "bg-white/10 text-white/20 cursor-not-allowed"}`}
          >
            Continue to Fabric
          </button>
        </div>
      </div>
    </div>
  );
}