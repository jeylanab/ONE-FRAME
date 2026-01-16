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

  // Hard-coded Geometric Engine linked to Admin Shape names
  const calculateStats = (shape, dims) => {
    const a = parseFloat(dims.a) || 0;
    const b = parseFloat(dims.b) || 0;
    let lm = 0;
    let sqm = 0;

    const s = shape.toUpperCase();

    switch (s) {
      case "SQUARE":
        lm = (a * 4) / 1000;
        sqm = (a * a) / 1000000;
        break;
      case "ROUND":
      case "CIRCLE":
        const radius = a / 2;
        lm = (2 * Math.PI * radius) / 1000;
        sqm = (Math.PI * Math.pow(radius, 2)) / 1000000;
        break;
      case "TRIANGLE":
        const hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        lm = (a + b + hypotenuse) / 1000;
        sqm = (0.5 * a * b) / 1000000;
        break;
      case "OVAL":
        // Ramanujan approximation for ellipse circumference
        const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
        lm = (Math.PI * (a/2 + b/2) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))) / 1000;
        sqm = (Math.PI * (a/2) * (b/2)) / 1000000;
        break;
      default: 
        // Handles RECTANGLE, DIAMOND, TRAPEZIUM, and CUSTOM/ADMIN ADDED
        lm = (2 * (a + b)) / 1000;
        sqm = (a * b) / 1000000;
        break;
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
          description: activeSetup?.description || "Standard setup requirements"
        },
        stats: { lm, sqm },
      });
    }
  }, [localShape, localDims, setupOptions]);

  const isValid = localShape && (parseFloat(localDims.a) > 0);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Geometry Engines...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Shape & Geometry</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select Morphology: Defined by Admin Logic.</p>
      </header>

      {/* SHAPE SELECTION GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {setupOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLocalShape(opt.shape)}
            className={`p-6 border-2 transition-all flex flex-col items-start gap-4 relative text-left ${
              localShape === opt.shape 
              ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
              : "border-gray-100 hover:border-black text-gray-400 shadow-none"
            }`}
          >
            <div className="w-full border-b border-gray-100 pb-2">
              <span className="font-black text-xs uppercase tracking-widest text-black">{opt.shape}</span>
            </div>
            
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase text-gray-400 leading-tight">
                {opt.description || "No description provided."}
              </p>
            </div>

            <div className="mt-2">
              <span className="text-xl font-black text-[#0D004C] tracking-tighter">${opt.sellPrice}</span>
              <span className="text-[8px] font-black uppercase ml-1 opacity-40">Setup Fee</span>
            </div>
          </button>
        ))}
      </div>

      {/* DIMENSION INPUTS */}
      {localShape && (
        <div className="p-10 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          <div className="absolute -top-5 left-8 bg-black text-white px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.3em]">
            Physical Dimensions (mm)
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Primary Dimension (A)</label>
            <input
              type="number"
              value={localDims.a}
              onChange={(e) => setLocalDims({ ...localDims, a: e.target.value })}
              className="w-full p-6 border-4 border-gray-100 focus:border-black outline-none font-black text-3xl transition-all placeholder-gray-200"
              placeholder="0000"
            />
          </div>

          {!["SQUARE", "ROUND", "CIRCLE"].includes(localShape.toUpperCase()) && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secondary Dimension (B)</label>
              <input
                type="number"
                value={localDims.b}
                onChange={(e) => setLocalDims({ ...localDims, b: e.target.value })}
                className="w-full p-6 border-4 border-gray-100 focus:border-black outline-none font-black text-3xl transition-all placeholder-gray-200"
                placeholder="0000"
              />
            </div>
          )}
        </div>
      )}

      {/* CALCULATION SUMMARY BAR */}
      {isValid && (
        <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(13,0,76,1)]">
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Linear Perimeter</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.lm.toFixed(3)} <span className="text-lg opacity-30 tracking-normal">LM</span></p>
          </div>
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Surface Area</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.sqm.toFixed(3)} <span className="text-lg opacity-30 tracking-normal">SQM</span></p>
          </div>
          <div className="p-8 bg-[#0D004C] flex flex-col justify-center">
            <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-1">Active Setup Protocol</p>
            <p className="text-4xl font-black text-white tracking-tighter">
              ${Number(quote.setup?.sell || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <button 
          onClick={onBack} 
          className="px-10 py-5 font-black uppercase text-[10px] tracking-widest border-2 border-black hover:bg-gray-50 transition active:translate-y-1"
        >
          Back
        </button>
        <button 
          disabled={!isValid}
          onClick={onNext}
          className={`px-16 py-5 font-black uppercase text-[10px] tracking-widest transition-all ${
            isValid 
            ? "bg-black text-white hover:bg-[#0D004C] shadow-[6px_6px_0px_0px_rgba(13,0,76,1)] hover:-translate-y-1" 
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          Proceed to Materials
        </button>
      </footer>
    </div>
  );
}