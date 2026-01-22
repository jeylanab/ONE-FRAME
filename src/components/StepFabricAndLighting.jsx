import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFabricAndLighting({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ fabrics: [], lighting: [], controls: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // EXACT MATCHING OF YOUR FIRESTORE COLLECTIONS
        const [fabSnap, lightSnap, controlSnap] = await Promise.all([
          getDocs(collection(db, "fabrics")),
          getDocs(collection(db, "lighting")),
          getDocs(collection(db, "controls"))
        ]);

        setData({
          fabrics: fabSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          lighting: lightSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          controls: controlSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleFabricSelect = (fabric, side) => {
    const weightPerSqm = parseFloat(fabric.weightSQM) || 0;
    const sellPerSqm = parseFloat(fabric.sellSQM) || 0;
    
    updateQuote({ 
      [side]: {
        ...fabric,
        name: fabric.description || fabric.name || "Custom Fabric",
        sell: sellPerSqm,
        weight: weightPerSqm
      }
    });
  };

  const handleLightSelect = (light) => {
    // If user picks "No Lighting", we also reset the control/driver to NA
    if (light.id === "NA") {
      updateQuote({ 
        lighting: { id: "NA", name: "Non-Illuminated", sell: 0 },
        control: { id: "NA", name: "No Driver Required", sell: 0 }
      });
    } else {
      updateQuote({ 
        lighting: {
          ...light,
          name: light.description || light.name,
          sell: parseFloat(light.sellSQM || light.sell || 0)
        }
      });
    }
  };

  const handleControlSelect = (control) => {
    updateQuote({ 
      control: {
        ...control,
        name: control.description || control.name,
        sell: parseFloat(control.sellSQM || control.sell || 0)
      } 
    });
  };

  // VALIDATION: Logic requires Face Fabric, a Lighting choice, and a Driver choice
  const isComplete = quote.faceFabric?.id && quote.lighting?.id && quote.control?.id;

  // CALCULATIONS
  const sqm = quote.stats?.sqm || 0;
  const faceCost = sqm * (quote.faceFabric?.sell || 0);
  const rearCost = sqm * (quote.rearFabric?.sell || 0);
  const lightingCost = sqm * (quote.lighting?.sell || 0);
  const controlCost = (quote.control?.sell || 0);

  const combinedWeight = (quote.estimates?.frameWeight || 0) + 
                         (sqm * (quote.faceFabric?.weight || 0)) + 
                         (sqm * (quote.rearFabric?.weight || 0)) + 
                         (quote.lighting?.id !== "NA" ? sqm * 1.2 : 0);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Media & Electrical...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="border-l-4 border-black pl-6">
        <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Graphics & Electrical</h2>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Select your finishes and power configuration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        
        {/* 1. FACE FABRIC */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">1. Face Fabric (Front)</label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {data.fabrics.map((f) => (
              <div key={`face-${f.id}`} onClick={() => handleFabricSelect(f, "faceFabric")}
                className={`p-4 border-2 cursor-pointer transition-all flex justify-between items-center ${quote.faceFabric?.id === f.id ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}>
                <span className="font-black text-xs uppercase">{f.description || f.name}</span>
                <span className="font-bold text-xs text-gray-400">${f.sellSQM}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. REAR FABRIC */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">2. Rear Fabric (Backing)</label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div onClick={() => handleFabricSelect({ id: "NA", description: "No Rear Fabric", sellSQM: 0, weightSQM: 0 }, "rearFabric")}
              className={`p-4 border-2 cursor-pointer transition-all ${quote.rearFabric?.id === "NA" ? "border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 text-gray-400"}`}>
              <span className="font-black text-xs uppercase italic">N/A - Single Sided</span>
            </div>
            {data.fabrics.map((f) => (
              <div key={`rear-${f.id}`} onClick={() => handleFabricSelect(f, "rearFabric")}
                className={`p-4 border-2 cursor-pointer transition-all flex justify-between items-center ${quote.rearFabric?.id === f.id ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}>
                <span className="font-black text-xs uppercase">{f.description || f.name}</span>
                <span className="font-bold text-xs text-gray-400">${f.sellSQM}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LIGHTING */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">3. LED Array</label>
          <div className="space-y-3">
            <div onClick={() => handleLightSelect({ id: "NA" })}
              className={`p-4 border-2 cursor-pointer transition-all ${quote.lighting?.id === "NA" ? "border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 text-gray-400"}`}>
              <span className="font-black text-xs uppercase italic">Non-Illuminated</span>
            </div>
            {data.lighting.map((l) => (
              <div key={l.id} onClick={() => handleLightSelect(l)}
                className={`p-4 border-2 cursor-pointer transition-all flex justify-between items-center ${quote.lighting?.id === l.id ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}>
                <span className="font-black text-xs uppercase">{l.description || l.name}</span>
                <span className="font-bold text-xs text-gray-400">${l.sellSQM}/sqm</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DRIVERS */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">4. Power Supply</label>
          <div className="space-y-3">
            {quote.lighting?.id === "NA" ? (
              <div className="p-4 border-2 border-dashed border-gray-200 text-gray-400 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest">No Driver Needed for Non-Illuminated</span>
              </div>
            ) : (
              data.controls.map((c) => (
                <div key={c.id} onClick={() => handleControlSelect(c)}
                  className={`p-4 border-2 cursor-pointer transition-all flex justify-between items-center ${quote.control?.id === c.id ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black"}`}>
                  <span className="font-black text-xs uppercase">{c.description || c.name}</span>
                  <span className="font-bold text-xs text-gray-400">${c.sellSQM}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 z-10 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase">Face Graphics</p>
            <p className="text-xl font-black">${faceCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase">Rear Graphics</p>
            <p className="text-xl font-black">${rearCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase">Power Subtotal</p>
            <p className="text-xl font-black">${(lightingCost + controlCost).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-indigo-500 uppercase">Ship Weight</p>
            <p className="text-xl font-black text-indigo-600">{combinedWeight.toFixed(1)}kg</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onBack} className="px-8 py-4 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">Back</button>
          <button disabled={!isComplete} onClick={onNext}
            className={`px-12 py-4 font-black uppercase text-[10px] transition-all ${isComplete ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0D004C]" : "bg-gray-100 text-gray-300"}`}>
            Next: Acoustics
          </button>
        </div>
      </footer>
    </div>
  );
}