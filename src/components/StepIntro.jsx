import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaPlus, FaDraftingCompass } from "react-icons/fa";

export default function StepIntro({ setQuote, onNext, setQuoteId }) {
  const { currentUser } = useAuth();

  const startQuote = async () => {
    const initialQuote = {
      userId: currentUser?.uid || "guest",
      status: "draft",
      shape: null,
      measurements: { a: 0, b: 0, c: 0, d: 0 },
      quantity: 1,
      stats: { lm: 0, sqm: 0 },
      design: { id: "NA", name: "Not Required", sell: 0 },
      frame: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      corners: { id: "NA", name: "Not Required", sell: 0 },
      setup: { sell: 0 },
      fabric: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      lighting: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      acoustics: { id: "NA", name: "Not Required", sell: 0 },
      prebuild: { selected: false, sell: 0 },
      destination: { city: null, tier: null, sell: 0 },
      totalWeight: 0,
      grandTotal: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    setQuote(initialQuote);

    try {
      const docRef = await addDoc(collection(db, "quotes"), initialQuote);
      setQuoteId?.(docRef.id);
    } catch (err) {
      console.error("Firebase Initialization Failed:", err);
    }

    onNext(); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative bg-white border-2 border-black p-12 md:p-20 overflow-hidden shadow-[20px_20px_0px_0px_rgba(13,0,76,0.1)]">
        
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Engineering Icon */}
          <div className="w-20 h-20 bg-black flex items-center justify-center mb-10 transform -rotate-3 group">
            <FaDraftingCompass className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-4">
            Specification Engine v2.0
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.8] mb-8">
            Precision <br />
            <span className="text-[#0D004C]">Configurator.</span>
          </h1>

          <p className="text-gray-500 max-w-lg mb-12 text-sm md:text-base font-medium leading-relaxed">
            Begin your technical specification. Our system will calculate exact 
            aluminum yields, fabric tension requirements, and logistical data 
            in real-time based on your custom geometric inputs.
          </p>

          <div className="w-full max-w-sm">
            <button
              onClick={startQuote}
              className="group relative w-full bg-black text-white py-6 px-10 font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-[#0D004C] flex items-center justify-center gap-4 shadow-xl active:scale-95"
            >
              <FaPlus className="text-[10px]" />
              Initialize Quote
              <div className="absolute inset-0 border border-white m-1 opacity-20 pointer-events-none" />
            </button>
            
            <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Automated pricing based on current NZ material indices
            </p>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black" />
      </div>
    </motion.div>
  );
}