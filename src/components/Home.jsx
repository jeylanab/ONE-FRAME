import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDraftingCompass, FaCogs, FaLightbulb, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Assets
import img1 from "../assets/one.jpg";
import img2 from "../assets/two.jpg";
import img3 from "../assets/three.jpg";

export default function Home() {
  const navigate = useNavigate();
  const images = [img1, img2, img3];
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-black selection:bg-[#0D004C] selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 mb-6">
              <FaDraftingCompass className="text-[#0D004C] text-xs" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">
                New Zealand Engineered
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 text-black uppercase tracking-tighter">
              Design.<br />
              <span className="text-[#0D004C]">Build.</span><br />
              Inspire.
            </h1>

            <p className="text-lg text-gray-500 max-w-md mb-10 leading-relaxed font-medium">
              High-performance fabric tension systems for modern architecture. 
              Precision engineered solutions for acoustics, lighting, and visual storytelling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate("/quote")}
                className="px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-[#0D004C] transition-all shadow-2xl flex items-center justify-center gap-4 group"
              >
                Start Custom Quote 
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right Animated Carousel */}
          <div className="relative h-[500px] md:h-[650px] w-full group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]"
              >
                <img
                  src={images[currentIdx]}
                  alt="Architecture Display"
                  className="w-full h-full object-cover"
                />
                {/* Overlay for professional depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {images.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    currentIdx === i ? "w-12 bg-white" : "w-4 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Background Text */}
        <div className="absolute bottom-0 left-0 text-[15vw] font-black text-gray-50 opacity-[0.03] select-none pointer-events-none uppercase -mb-10">
          Architectural
        </div>
      </section>

      {/* SYSTEMS SECTION - CLEAN GRID */}
      <section className="py-32 px-6 border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <p className="text-[#0D004C] font-black uppercase tracking-[0.2em] text-xs mb-4">Product Range</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Our Systems</h2>
            </div>
            <p className="text-gray-400 max-w-xs text-sm font-medium">
              A comprehensive suite of modular fabric solutions designed for seamless integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              { name: "CLIPSO®", desc: "Premium Stretch Fabric" },
              { name: "resonate™", desc: "Acoustic Solutions" },
              { name: "lucent™", desc: "Illuminated Systems" },
              { name: "cadro 3D™", desc: "Modular Displays" },
              { name: "adframe™", desc: "Advertising Media" },
              { name: "animate™", desc: "Light Motion Tech" }
            ].map((system, idx) => (
              <div
                key={idx}
                className="group p-12 bg-white border border-gray-100 hover:bg-[#0D004C] transition-all duration-500 cursor-default"
              >
                <h3 className="text-xl font-black mb-4 uppercase group-hover:text-white transition-colors">{system.name}</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{system.desc}</p>
                <div className="mt-8 h-1 w-0 bg-white group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
            Ready to <span className="text-[#0D004C] outline-text">Evolve</span> your space?
          </h2>
          <button 
            onClick={() => navigate("/quote")}
            className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-[#0D004C] hover:text-white transition-all rounded-full"
          >
            Launch Calculator
          </button>
        </div>
      </section>

    </div>
  );
}