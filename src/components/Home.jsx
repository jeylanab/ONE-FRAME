import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDraftingCompass, FaCogs, FaLightbulb, FaArrowRight, FaGlobeAmericas, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Assets
import img1 from "../assets/one.jpg";
import img2 from "../assets/two.jpg";
import img3 from "../assets/three.jpg";

export default function Home() {
  const navigate = useNavigate();
  const images = [img1, img2, img3];
  const [currentIdx, setCurrentIdx] = useState(0);

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
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

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

        <div className="absolute bottom-0 left-0 text-[15vw] font-black text-gray-50 opacity-[0.03] select-none pointer-events-none uppercase -mb-10">
          Architectural
        </div>
      </section>

      {/* REPLACED SECTION: BRAND PILLARS / STRATEGIC VALUE */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            
            {/* Left: Philosophy */}
            <div className="sticky top-24">
              <p className="text-[#0D004C] font-black uppercase tracking-[0.4em] text-xs mb-6">Our DNA</p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-black">
                Performance <br />
                <span className="text-gray-200">Without</span> <br />
                Compromise.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg font-medium">
                The ultimate fabric tension system functionally outperforms any other comparable system 
                available today. We transform bold architectural ideas into amazing realities.
              </p>
              
              <div className="p-8 border-l-4 border-black bg-gray-50">
                <p className="italic font-bold text-black text-sm">
                  "Innovation is our passion; it’s part of our DNA. We are constantly striving 
                  to positively influence the industry by what we deliver to market."
                </p>
              </div>
            </div>

            {/* Right: The Process Grid */}
            <div className="grid gap-px bg-gray-200 border border-gray-200">
              {[
                { 
                  icon: <FaGlobeAmericas className="text-2xl" />, 
                  title: "Sustainability", 
                  text: "2nd Thread™ Circularity Program focuses on raw material recovery and green manufacturing." 
                },
                { 
                  icon: <FaCogs className="text-2xl" />, 
                  title: "Precision", 
                  text: "Vertically integrated in NZ, ensuring every frame is engineered to sub-millimeter accuracy." 
                },
                { 
                  icon: <FaShieldAlt className="text-2xl" />, 
                  title: "Integrity", 
                  text: "High-performance PVF surfaces and certified acoustic performance for demanding environments." 
                },
                { 
                  icon: <FaLightbulb className="text-2xl" />, 
                  title: "Innovation", 
                  text: "From programmable animate™ lighting to organic organa™ geometries, we reimagine limits." 
                }
              ].map((pillar, idx) => (
                <div key={idx} className="bg-white p-12 transition-all hover:bg-gray-50 group">
                  <div className="text-[#0D004C] mb-6 transform group-hover:scale-110 transition-transform origin-left">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">{pillar.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
            Ready to <span className="text-gray-500 outline-text">Evolve</span> <br /> your space?
          </h2>
          <button 
            onClick={() => navigate("/quote")}
            className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-[#0D004C] hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            Launch Quote Calculator
          </button>
        </div>
      </section>

    </div>
  );
}