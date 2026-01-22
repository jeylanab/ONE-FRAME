import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { SHAPE_FORMULAS, calculateStats } from "../data/geometryEngine";

export default function StepGeometry({ quote, updateQuote, onNext, onBack }) {
  const [localDims, setLocalDims] = useState(quote?.measurements || { a: "", b: "", c: "", d: "" });
  const [localShape, setLocalShape] = useState(quote?.shape || "");
  const [setupOptions, setSetupOptions] = useState([]);
  const [cornerOptions, setCornerOptions] = useState([]); // Linked to Firestore 'corners'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Setups (Shapes)
        const setupSnap = await getDocs(collection(db, "setups"));
        const setups = setupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSetupOptions(setups);

        // Fetch Corners (New Requirement moved from Frame page)
        const cornerSnap = await getDocs(collection(db, "corners"));
        const corners = cornerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCornerOptions(corners);

      } catch (err) {
        console.error("Error fetching geometry data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync calculations and state to global quote
  useEffect(() => {
    if (localShape) {
      const stats = calculateStats(localShape, localDims);
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
        stats,
      });
    }
  }, [localShape, localDims, setupOptions]);

  const handleCornerSelect = (c) => {
    updateQuote({
      corners: {
        id: c.id,
        name: c.type || "Standard Corner",
        sell: Number(c.sellLM) || 0,
        description: c.description || ""
      }
    });
  };

  const isValid = localShape && (parseFloat(localDims.a) > 0) && quote.corners?.id;

  const renderSketch = () => {
    const shapeKey = localShape?.toUpperCase().split(' ')[0] || "RECTANGLE";
    const config = SHAPE_FORMULAS[shapeKey] || SHAPE_FORMULAS.RECTANGLE;
    
    return (
      <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center relative p-4">
        <div className="opacity-30 mb-4 scale-125">
            {shapeKey === 'SQUARE' && <div className="w-16 h-16 border-4 border-black" />}
            {shapeKey === 'ROUND' && <div className="w-16 h-16 border-4 border-black rounded-full" />}
            {shapeKey === 'RECTANGLE' && <div className="w-24 h-12 border-4 border-black" />}
            {shapeKey === 'TRIANGLE' && <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-black" />}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reference: {config.label}</p>
        <div className="flex gap-2 mt-3">
            {config.dimensions.map(d => (
                <span key={d} className="bg-black text-white px-2 py-0.5 text-[8px] font-bold rounded">DIM {d.toUpperCase()}</span>
            ))}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="p-20 text-center font-black uppercase tracking-widest text-gray-400">Syncing Geometry...</div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Shape & Geometry</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select morphology and define dimensions.</p>
      </header>

      {/* SHAPE SELECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {setupOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setLocalShape(opt.shape)}
            className={`p-6 border-2 transition-all text-left flex flex-col justify-between h-32 ${
              localShape === opt.shape ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "border-gray-100 text-gray-400"
            }`}
          >
            <span className="font-black text-xs uppercase tracking-widest text-black">{opt.shape}</span>
            <span className="text-xl font-black text-black tracking-tighter">${opt.sellPrice}</span>
          </button>
        ))}
      </div>

      {localShape && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* REFERENCE & DIMS */}
          <div className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">1. Orientation Guide</label>
            {renderSketch()}
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="p-10 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-5 left-8 bg-black text-white px-6 py-1.5 text-[10px] font-black uppercase tracking-widest">2. Input Dimensions (mm)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(SHAPE_FORMULAS[localShape.toUpperCase().split(' ')[0]]?.dimensions || ["a", "b"]).map((dim) => (
                    <div key={dim} className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DIMENSION – {dim.toUpperCase()}</label>
                    <input
                        type="number"
                        value={localDims[dim]}
                        onChange={(e) => setLocalDims({ ...localDims, [dim]: e.target.value })}
                        className="w-full p-4 border-4 border-gray-100 focus:border-black outline-none font-black text-3xl transition-all"
                        placeholder="0000"
                    />
                    </div>
                ))}
                </div>
            </div>

            {/* CORNER SELECTION MOVED HERE */}
            <div className="space-y-6">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">3. Corner Detail / Finish</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cornerOptions.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => handleCornerSelect(c)}
                            className={`p-6 border-2 text-left transition-all ${quote.corners?.id === c.id ? "border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-black text-xs uppercase tracking-widest text-black">{c.type}</span>
                                <span className="text-xs font-black text-[#0D004C]">+${c.sellLM}</span>
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{c.description}</p>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATION SUMMARY BAR - Jacq's specific request for labels and white bg */}
      {isValid && (
        <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">total perimeter length</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.lm.toFixed(3)} <span className="text-lg opacity-30 tracking-normal">LM</span></p>
          </div>
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">total surface area</p>
            <p className="text-4xl font-black text-black tracking-tighter">{quote.stats.sqm.toFixed(3)} <span className="text-lg opacity-30 tracking-normal">SQM</span></p>
          </div>
          <div className="p-8 flex flex-col justify-center bg-white">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">set-up cost</p>
            <p className="text-4xl font-black text-black tracking-tighter">
              ${Number(quote.setup?.sell || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <button onClick={onBack} className="px-10 py-5 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">Back</button>
        <button 
          disabled={!isValid}
          onClick={onNext}
          className={`px-16 py-5 font-black uppercase text-[10px] transition-all ${isValid ? "bg-black text-white hover:bg-[#0D004C] shadow-[6px_6px_0px_0px_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Proceed to Materials
        </button>
      </footer>
    </div>
  );
}