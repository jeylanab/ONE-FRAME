import { motion } from "framer-motion";
import { 
  Square3Stack3DIcon, 
  SpeakerWaveIcon, 
  LightBulbIcon, 
  CubeTransparentIcon,
  GlobeAsiaAustraliaIcon,
  PaintBrushIcon
} from "@heroicons/react/24/outline";

const systems = [
  {
    name: "CLIPSO®",
    tagline: "Grand format stretch fabric",
    desc: "A pre-finished alternative to paint or plaster. Delivers flawless, durable surfaces that resist cracking and peeling.",
    icon: <Square3Stack3DIcon className="w-8 h-8" />,
  },
  {
    name: "resonate™",
    tagline: "Fabric acoustic systems",
    desc: "NZ-made printed acoustic systems. Eliminates slap echo and controls noise with certified performance.",
    icon: <SpeakerWaveIcon className="w-8 h-8" />,
  },
  {
    name: "lucent™",
    tagline: "Illuminated fabric systems",
    desc: "Capturing attention through light. Customizable intensity and temperature to transform any ambiance.",
    icon: <LightBulbIcon className="w-8 h-8" />,
  },
  {
    name: "cadro 3D™",
    tagline: "Modular build displays",
    desc: "Precision-engineered aluminum frames for architects to create dynamic 3D forms and spatial features.",
    icon: <CubeTransparentIcon className="w-8 h-8" />,
  },
  {
    name: "organa™",
    tagline: "Shapes & Forms",
    desc: "Beyond linear forms. Sculpting fabric into organic, three-dimensional geometries for elegant spatial impact.",
    icon: <PaintBrushIcon className="w-8 h-8" />,
  },
  {
    name: "2nd Thread™",
    tagline: "Circularity Program",
    desc: "Our commitment to sustainability through green manufacturing and Back-2-Base raw material recovery.",
    icon: <GlobeAsiaAustraliaIcon className="w-8 h-8" />,
  }
];

export default function Features() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 border-l-8 border-black pl-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">
            The <span className="text-[#0D004C]">Systems</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mt-4 font-medium">
            Architectural solutions engineered in New Zealand for global performance. 
            Functionally outperforming any comparable system in the market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {systems.map((system, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ backgroundColor: "#F9FAFB" }}
              className="bg-white p-12 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="text-[#0D004C] mb-8 group-hover:scale-110 transition-transform origin-left">
                  {system.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                  {system.name}
                </h3>
                <p className="text-[#0D004C] text-[10px] font-black uppercase tracking-widest mb-6">
                  {system.tagline}
                </p>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {system.desc}
                </p>
              </div>
              
              <div className="mt-10">
                <button className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:border-[#0D004C] transition-colors">
                  Explore Spec →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}