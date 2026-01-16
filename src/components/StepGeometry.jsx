import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepGeometry({ quote, updateQuote, onNext, onBack }) {
  const [localDims, setLocalDims] = useState(quote?.measurements || { a: "", b: "", c: "", d: "" });
  const [localShape, setLocalShape] = useState(quote?.shape || "");
  const [setupOptions, setSetupOptions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const calculateStats = (shape, dims) => {
    const a = parseFloat(dims.a) || 0;
    const b = parseFloat(dims.b) || 0;
    let lm = 0;
    let sqm = 0;

    const s = shape.toUpperCase();

    if (s === "SQUARE") {
      lm = (a * 4) / 1000;
      sqm = (a * a) / 1000000;
    } else if (s === "RECTANGLE" || s === "DIAMOND" || s === "TRAPEZIUM") {
      lm = (2 * (a + b)) / 1000;
      sqm = (a * b) / 1000000;
    } else if (s === "ROUND") {
      const radius = a / 2;
      lm = (2 * Math.PI * radius) / 1000;
      sqm = (Math.PI * Math.pow(radius, 2)) / 1000000;
    } else if (s === "OVAL") {
      lm = (2 * Math.PI * Math.sqrt((Math.pow(a/2, 2) + Math.pow(b/2, 2)) / 2)) / 1000;
      sqm = (Math.PI * (a/2) * (b/2)) / 1000000;
    } else if (s === "TRIANGLE") {
      // Assuming right-angle triangle for simplicity (A = base, B = height)
      const hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
      lm = (a + b + hypotenuse) / 1000;
      sqm = (0.5 * a * b) / 1000000;
    }
    return { lm, sqm };
  };

  useEffect(() => {
    if (localShape) {
      const { lm, sqm } = calculateStats(localShape, localDims);
      const activeSetup = setupOptions.find(
        (s) => s.shape?.toUpperCase() === localShape.toUpperCase()
      );

      updateQuote({
        shape: localShape,
        measurements: localDims,
        setup: {
          name: `${localShape} Setup Fee`,
          sell: activeSetup ? activeSetup.sellPrice : 0,
          description: activeSetup?.description || ""
        },
        stats: { lm, sqm },
      });
    }
  }, [localShape, localDims, setupOptions]);

  const isValid = localShape && quote?.stats?.lm > 0;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Geometry Modules...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Shape & Geometry</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Define frame morphology and project dimensions.</p>
      </header>

      {/* SHAPE SELECTION GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {setupOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLocalShape(opt.shape)}
            className={`p-6 border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${
              localShape === opt.shape 
              ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
              : "border-gray-100 hover:border-black text-gray-400"
            }`}
          >
            <span className="font-black text-[10px] uppercase tracking-widest">{opt.shape}</span>
            <span className="text-xs font-black text-[#0D004C] tracking-tighter">${opt.sellPrice}</span>
          </button>
        ))}
      </div>

      {/* DIMENSION INPUTS */}
      {localShape && (
        <div className="p-10 bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 gap-10 relative">
          <div className="absolute -top-4 left-6 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
            Engineering Specs (mm)
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dimension A (Width/Base)</label>
            <input
              type="number"
              value={localDims.a}
              onChange={(e) => setLocalDims({ ...localDims, a: e.target.value })}
              className="w-full p-4 border-2 border-gray-100 focus:border-black outline-none font-black text-xl transition-all"
              placeholder="0000"
            />
          </div>

          {["RECTANGLE", "OVAL", "DIAMOND", "TRAPEZIUM", "TRIANGLE"].includes(localShape.toUpperCase()) && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dimension B (Height/Length)</label>
              <input
                type="number"
                value={localDims.b}
                onChange={(e) => setLocalDims({ ...localDims, b: e.target.value })}
                className="w-full p-4 border-2 border-gray-100 focus:border-black outline-none font-black text-xl transition-all"
                placeholder="0000"
              />
            </div>
          )}
        </div>
      )}

      {/* CALCULATION SUMMARY BAR */}
      {isValid && (
        <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(13,0,76,1)]">
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Perimeter (LM)</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.lm.toFixed(3)}</p>
          </div>
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Surface Area (SQM)</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.sqm.toFixed(3)}</p>
          </div>
          <div className="p-8 bg-[#0D004C] flex flex-col justify-center">
            <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-1">Shape Setup Fee</p>
            <p className="text-4xl font-black text-white tracking-tighter">
              ${Number(quote.setup?.sell || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <button 
          onClick={onBack} 
          className="px-10 py-4 font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button 
          disabled={!isValid}
          onClick={onNext}
          className={`px-12 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
            isValid 
            ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" 
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Continue to Frame Selection
        </button>
      </footer>
    </div>
  );
}