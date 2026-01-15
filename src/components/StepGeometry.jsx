import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepGeometry({ quote, updateQuote, onNext, onBack }) {
  const [localDims, setLocalDims] = useState(quote?.measurements || { a: "", b: "", c: "", d: "" });
  const [localShape, setLocalShape] = useState(quote?.shape || "");
  const [setupOptions, setSetupOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch from 'setups' collection using your specific field names
  useEffect(() => {
    const fetchSetups = async () => {
      try {
        const snap = await getDocs(collection(db, "setups"));
        const data = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setSetupOptions(data);
      } catch (err) {
        console.error("Error fetching setups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSetups();
  }, []);

  // 2. Math Logic
  const calculateStats = (shape, dims) => {
    const a = parseFloat(dims.a) || 0;
    const b = parseFloat(dims.b) || 0;
    let lm = 0;
    let sqm = 0;

    // Fixed math for millimeters to meters conversion
    if (shape === "SQUARE") {
      lm = (a * 4) / 1000;
      sqm = (a * a) / 1000000;
    } else if (shape === "RECTANGLE" || shape === "DIAMOND" || shape === "TRAPEZIUM") {
      lm = (2 * (a + b)) / 1000;
      sqm = (a * b) / 1000000;
    } else if (shape === "ROUND") {
      const radius = a / 2;
      lm = (2 * Math.PI * radius) / 1000;
      sqm = (Math.PI * Math.pow(radius, 2)) / 1000000;
    } else if (shape === "OVAL") {
      lm = (2 * Math.PI * Math.sqrt((Math.pow(a/2, 2) + Math.pow(b/2, 2)) / 2)) / 1000;
      sqm = (Math.PI * (a/2) * (b/2)) / 1000000;
    }
    return { lm, sqm };
  };

  // 3. Sync with Master Quote
  useEffect(() => {
    if (localShape) {
      const { lm, sqm } = calculateStats(localShape, localDims);
      
      // Match against your Firestore field: 'shape' and 'sellPrice'
      const activeSetup = setupOptions.find(
        (s) => s.shape?.toUpperCase() === localShape.toUpperCase()
      );

      updateQuote({
        shape: localShape,
        measurements: localDims,
        setup: {
          name: `${localShape} Setup Fee`,
          sell: activeSetup ? activeSetup.sellPrice : 0, // Matches your 'sellPrice' field
          description: activeSetup?.description || ""
        },
        stats: { lm, sqm },
      });
    }
  }, [localShape, localDims, setupOptions]);

  const isValid = localShape && quote?.stats?.lm > 0;

  if (loading) return <div className="p-20 text-center animate-pulse">Synchronizing Shapes & Setups...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-[#0D004C]">Shape & Geometry</h2>
        <p className="text-gray-500 italic">Select a shape to apply machine set-up and template fees.</p>
      </div>

      {/* SHAPE BUTTONS DYNAMICALLY LOADED FROM YOUR TABLE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {setupOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLocalShape(opt.shape)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
              localShape === opt.shape 
              ? "border-indigo-600 bg-indigo-50 shadow-md" 
              : "border-gray-100 hover:border-indigo-200"
            }`}
          >
            <span className="font-black text-xs tracking-tighter">{opt.shape}</span>
            <span className="text-[10px] font-bold text-indigo-500">${opt.sellPrice}</span>
          </button>
        ))}
      </div>

      {/* DIMENSION INPUTS */}
      {localShape && (
        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dimension A (mm)</label>
            <input
              type="number"
              value={localDims.a}
              onChange={(e) => setLocalDims({ ...localDims, a: e.target.value })}
              className="w-full p-5 rounded-2xl border-2 border-white focus:border-indigo-500 outline-none shadow-sm transition-all"
              placeholder="Width / Diameter"
            />
          </div>
          {["RECTANGLE", "OVAL", "DIAMOND", "TRAPEZIUM"].includes(localShape) && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dimension B (mm)</label>
              <input
                type="number"
                value={localDims.b}
                onChange={(e) => setLocalDims({ ...localDims, b: e.target.value })}
                className="w-full p-5 rounded-2xl border-2 border-white focus:border-indigo-500 outline-none shadow-sm transition-all"
                placeholder="Height / Length"
              />
            </div>
          )}
        </div>
      )}

      {/* CALCULATION SUMMARY BAR */}
      {isValid && (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#0D004C] text-white rounded-2xl shadow-xl animate-slideUp">
          <div className="flex-1">
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Perimeter (LM)</p>
            <p className="text-2xl font-mono font-black">{quote.stats.lm.toFixed(3)}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Area (SQM)</p>
            <p className="text-2xl font-mono font-black">{quote.stats.sqm.toFixed(3)}</p>
          </div>
          <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Setup Fee</p>
            <p className="text-2xl font-black text-yellow-400">${quote.setup?.sell}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-2 font-bold text-gray-400 hover:text-gray-600 transition-colors">Back</button>
        <button 
          disabled={!isValid}
          onClick={onNext}
          className={`px-12 py-4 rounded-2xl font-black transition-all ${
            isValid ? "bg-[#0D004C] text-white shadow-2xl hover:scale-105" : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Proceed to Frame Selection →
        </button>
      </div>
    </div>
  );
}