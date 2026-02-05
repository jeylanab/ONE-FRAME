import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function StepFabricAndLighting({ quote, updateQuote, onNext, onBack }) {
  const [data, setData] = useState({ fabrics: [], lighting: [], controls: [] });
  const [header, setHeader] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const headerRef = doc(db, "content", "step4_graphics");
        const [fabSnap, lightSnap, controlSnap, headerSnap] = await Promise.all([
          getDocs(collection(db, "fabrics")),
          getDocs(collection(db, "lighting")),
          getDocs(collection(db, "controls")),
          getDoc(headerRef)
        ]);

        if (headerSnap.exists()) setHeader(headerSnap.data());

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
    updateQuote({ 
      [side]: {
        id: fabric.id,
        name: fabric.description || fabric.name || "Custom Fabric",
        sell: parseFloat(fabric.sellSQM) || 0,
        weight: parseFloat(fabric.weightSQM) || 0
      }
    });
  };

  const handleLightSelect = (light) => {
    if (light.id === "NA") {
      updateQuote({ 
        lighting: { id: "NA", name: "Non-Illuminated", sell: 0 },
        control: { id: "NA", name: "No Driver Required", sell: 0 }
      });
    } else {
      updateQuote({ 
        lighting: {
          id: light.id,
          name: light.description || light.name,
          sell: parseFloat(light.sellSQM || light.sell || 0)
        }
      });
    }
  };

  const handleControlSelect = (control) => {
    updateQuote({ 
      control: {
        id: control.id,
        name: control.description || control.name,
        sell: parseFloat(control.sellSQM || control.sell || 0)
      } 
    });
  };

  const isComplete = quote.faceFabric?.id && quote.lighting?.id && quote.control?.id;
  const sqm = quote.stats?.sqm || 0;

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Specifications...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 px-4">
      <header className="border-l-4 border-black pl-6 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-black uppercase tracking-tighter italic leading-none">
            {header.title || "Graphics & Electrical"}
          </h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mt-2">
            {header.subtitle || "Configure media surfaces and illumination."}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Area</p>
          <p className="text-2xl font-black text-black leading-none uppercase">{sqm.toFixed(2)} SQM</p>
        </div>
      </header>

      {/* PHASE 01: FABRICS */}
      <div>
      
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic underline decoration-2 underline-offset-4">01. Face Fabric (Front)</label>
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.fabrics.map((f) => (
                <div key={`face-${f.id}`} onClick={() => handleFabricSelect(f, "faceFabric")}
                  className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.faceFabric?.id === f.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}>
                  <p className="font-black text-xs uppercase leading-tight text-black">{f.description || f.name}</p>
                  <p className="text-lg font-black text-black tracking-tighter">${parseFloat(f.sellSQM).toFixed(2)}<span className="text-[10px] ml-1 opacity-50 font-bold">/SQM</span></p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic underline decoration-2 underline-offset-4">02. Rear Fabric (Backing)</label>
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div onClick={() => handleFabricSelect({ id: "NA", description: "No Rear Fabric", sellSQM: 0, weightSQM: 0 }, "rearFabric")}
                className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.rearFabric?.id === "NA" ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 grayscale opacity-60"}`}>
                <p className="font-black text-xs uppercase italic text-black leading-tight">Single Sided<br/>No Backing</p>
                <p className="text-lg font-black text-black tracking-tighter">FREE</p>
              </div>
              {data.fabrics.map((f) => (
                <div key={`rear-${f.id}`} onClick={() => handleFabricSelect(f, "rearFabric")}
                  className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.rearFabric?.id === f.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}>
                  <p className="font-black text-xs uppercase leading-tight text-black">{f.description || f.name}</p>
                  <p className="text-lg font-black text-black tracking-tighter">${parseFloat(f.sellSQM).toFixed(2)}<span className="text-[10px] ml-1 opacity-50 font-bold">/SQM</span></p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* PHASE 02: ELECTRICAL */}
      <div>
        <div className="flex items-center gap-4 mb-8">
           <div className="h-1 bg-black w-full opacity-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic underline decoration-2 underline-offset-4">03. Illumination System</label>
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => handleLightSelect({ id: "NA" })}
                className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.lighting?.id === "NA" ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 grayscale opacity-60"}`}>
                <p className="font-black text-xs uppercase italic text-black">Non-Illuminated</p>
                <p className="text-lg font-black text-black tracking-tighter">$0.00</p>
              </div>
              {data.lighting.map((l) => (
                <div key={l.id} onClick={() => handleLightSelect(l)}
                  className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.lighting?.id === l.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}>
                  <p className="font-black text-xs uppercase leading-tight text-black">{l.description || l.name}</p>
                  <p className="text-lg font-black text-black tracking-tighter">${parseFloat(l.sellSQM).toFixed(2)}<span className="text-[10px] ml-1 opacity-50 font-bold">/SQM</span></p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic underline decoration-2 underline-offset-4">04. Power Supply / Driver</label>
            <div className="grid grid-cols-2 gap-4">
              {quote.lighting?.id === "NA" ? (
                <div className="col-span-2 p-6 border-4 border-dashed border-gray-100 flex flex-col items-center justify-center h-40 opacity-50">
                  <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest text-center">Electrical Bypass Active<br/>No Driver Required</p>
                </div>
              ) : (
                data.controls.map((c) => (
                  <div key={c.id} onClick={() => handleControlSelect(c)}
                    className={`p-6 border-2 cursor-pointer transition-all flex flex-col justify-between h-40 ${quote.control?.id === c.id ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-100 hover:border-black text-gray-400"}`}>
                    <p className="font-black text-xs uppercase leading-tight text-black">{c.description || c.name}</p>
                    <p className="text-lg font-black text-[#0D004C] tracking-tighter">+${parseFloat(c.sellSQM || c.sell).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="sticky bottom-0 bg-white border-t-4 border-black p-8 flex justify-end items-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button onClick={onBack} className="px-12 py-5 font-black uppercase text-[10px] border-2 border-black hover:bg-gray-50 transition">
          Back
        </button>
        <button 
          disabled={!isComplete} 
          onClick={onNext}
          className={`px-16 py-5 font-black uppercase text-[10px] tracking-widest transition-all ${isComplete ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0D004C]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Next: Acoustics
        </button>
      </footer>
    </div>
  );
}