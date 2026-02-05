import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { SHAPE_FORMULAS, calculateStats } from "../data/geometryEngine";

const FORMULA_DISPLAY = {
  SQUARE: { area: "$Area = a^2$", perimeter: "$P = 4a$" },
  RECTANGLE: { area: "$Area = a \\times b$", perimeter: "$P = 2(a + b)$" },
  ROUND: { area: "$Area = \\pi r^2$", perimeter: "$P = 2\\pi r$" },
  TRIANGLE: { area: "$Area = 0.5 \\times b \\times h$", perimeter: "$P = a + b + c$" },
  OVAL: { area: "$Area = \\pi \\times \\frac{a}{2} \\times \\frac{b}{2}$", perimeter: "Ramanujan Approx" },
  DIAMOND: { area: "$Area = \\frac{a \\times b}{2}$", perimeter: "$P = 2(a + b)$" },
  TRAPEZIUM: { area: "$Area = 0.5(a + b) \\times d$", perimeter: "$P = a + b + c + d$" },
};

export default function StepGeometry({ quote, updateQuote, onNext, onBack }) {
  const [localDims, setLocalDims] = useState(quote?.measurements || { a: "", b: "", c: "", d: "" });
  const [localShape, setLocalShape] = useState(quote?.shape || "");
  const [setupOptions, setSetupOptions] = useState([]);
  const [cornerOptions, setCornerOptions] = useState([]);
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerSnap = await getDoc(doc(db, "content", "step2_geometry"));
        if (headerSnap.exists()) setHeader(headerSnap.data());

        const setupSnap = await getDocs(collection(db, "setups"));
        setSetupOptions(setupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const cornerSnap = await getDocs(collection(db, "corners"));
        setCornerOptions(cornerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (localShape) {
      const stats = calculateStats(localShape, localDims);
      const activeSetup = setupOptions.find(s => s.shape?.toUpperCase() === localShape.toUpperCase());
      updateQuote({
        shape: localShape,
        measurements: localDims,
        setup: {
          name: `${localShape} Setup`,
          sell: activeSetup ? activeSetup.sellPrice : 0,
        },
        stats,
      });
    }
  }, [localShape, localDims, setupOptions]);

  const shapeKey = localShape?.toUpperCase().split(' ')[0] || "RECTANGLE";
  const activeFormula = SHAPE_FORMULAS[shapeKey] || SHAPE_FORMULAS.RECTANGLE;
  const isValid = localShape && parseFloat(localDims.a) > 0 && quote.corners?.id;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic">
          {header.title || "Shape & Geometry"}
        </h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
          {header.subtitle || "Define technical morphology and dimensions."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LHS - SHAPE SELECTION + SETUP FEE */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">1. Select Shape</label>
          <div className="grid grid-cols-2 gap-4">
            {setupOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setLocalShape(opt.shape)}
                className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${
                  localShape === opt.shape 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                  : "border-gray-100 hover:border-black text-gray-400"
                }`}
              >
                <p className="font-black text-sm uppercase tracking-widest text-black">{opt.shape}</p>
                <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Setup Fee</p>
                    <p className="text-xl font-black text-black">${Number(opt.sellPrice).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RHS - CORNER TYPE + CORNER FEE */}
        <section className="space-y-6">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">2. Select Corner Type</label>
          <div className="grid grid-cols-2 gap-4">
            {cornerOptions.map((c) => (
              <div
                key={c.id}
                onClick={() => updateQuote({ corners: { id: c.id, name: c.type, sell: Number(c.sellLM) } })}
                className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${
                  quote.corners?.id === c.id 
                  ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                  : "border-gray-100 hover:border-black text-gray-400"
                }`}
              >
                <div>
                    <p className="font-black text-sm uppercase tracking-widest text-black">{c.type}</p>
                    <p className="text-[9px] mt-1 uppercase font-bold leading-tight">{c.description}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Rate</p>
                    <p className="text-xl font-black text-[#0D004C]">${Number(c.sellLM).toLocaleString()}<span className="text-[10px] ml-1">/LM</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MEASUREMENT BOX BOTTOM WITH FORMULAS */}
      {localShape && (
        <div className="border-4 border-black p-10 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 space-y-6 border-r-0 md:border-r-2 border-gray-100 pr-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mathematical Basis</p>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 border border-black border-dashed flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase">Area</span>
                    <span className="text-xs font-bold text-black">{FORMULA_DISPLAY[shapeKey]?.area}</span>
                  </div>
                  <div className="bg-gray-50 p-3 border border-black border-dashed flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase">Perimeter</span>
                    <span className="text-xs font-bold text-black">{FORMULA_DISPLAY[shapeKey]?.perimeter}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">3. Input Dimensions (mm)</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {activeFormula.dimensions.map((dim) => (
                  <div key={dim} className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Dim {dim.toUpperCase()}</label>
                    <input
                      type="number"
                      value={localDims[dim]}
                      onChange={(e) => setLocalDims({ ...localDims, [dim]: e.target.value })}
                      className="w-full p-4 border-4 border-gray-100 focus:border-black outline-none font-black text-2xl transition-all"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}



      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex justify-between items-center z-20">
        <button onClick={onBack} className="px-10 py-4 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">Back</button>
        <button 
          disabled={!isValid}
          onClick={onNext}
          className={`px-16 py-4 font-black uppercase text-[10px] transition-all ${isValid ? "bg-black text-white hover:bg-[#0D004C] shadow-[4px_4px_0px_0px_rgba(13,0,76,1)]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Confirm Geometry
        </button>
      </footer>
    </div>
  );
}