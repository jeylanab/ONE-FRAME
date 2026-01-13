import { motion } from "framer-motion";
import { FaDraftingCompass, FaCogs, FaLightbulb, FaArrowRight } from "react-icons/fa";
import heroImage from "../assets/one.jpg";

export default function Home() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-widest text-[#3D85C6] mb-4 flex items-center gap-2">
              <FaDraftingCompass /> Architectural Fabric Systems
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#0D004C]">
              Design.<br />
              Build.<br />
              Inspire.
            </h1>

            <p className="text-[#603820] max-w-xl mb-8">
              Sustainable, high-performance fabric tension solutions proudly
              designed and manufactured in New Zealand — engineered for modern
              architecture and visual storytelling.
            </p>

            <button className="px-8 py-4 rounded-full bg-[#0D004C] text-white font-semibold hover:bg-[#3D85C6] transition flex items-center gap-3">
              Get Custom Quote <FaArrowRight />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[420px] rounded-3xl overflow-hidden border border-black/10 shadow-xl"
          >
            <img
              src={heroImage}
              alt="Architectural fabric system"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D004C]/40 to-transparent" />
          </motion.div>

        </div>
      </section>

      {/* FEATURED CASE STUDIES */}
      <section className="py-24 px-6 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-semibold mb-12 text-[#0D004C] flex items-center gap-3">
            <FaLightbulb /> Featured Case Studies
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {["Tauranga City Council", "Auckland Radiation Oncology"].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.02 }}
                className="p-10 rounded-3xl bg-white border border-black/10 hover:shadow-xl transition"
              >
                <p className="text-xs uppercase tracking-widest text-[#3D85C6] mb-2">
                  Featured Case Study
                </p>
                <h3 className="text-2xl font-semibold mb-6 text-[#0D004C]">{item}</h3>
                <button className="text-[#603820] hover:underline flex items-center gap-2">
                  Read more <FaArrowRight />
                </button>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-[#0D004C] flex items-center gap-3">
            <FaCogs /> Our Systems
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              "CLIPSO® Stretch Fabric",
              "resonate™ Acoustic Systems",
              "lucent™ Illuminated Systems",
              "cadro 3D™ Modular Displays",
              "adframe™ Advertising",
              "animate™ Light Motion"
            ].map((system) => (
              <div
                key={system}
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-3 text-[#0D004C]">{system}</h3>
                <p className="text-sm text-[#603820]">
                  Engineered for architectural excellence and creative freedom.
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6 bg-[#0D004C] text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready to build something extraordinary?
        </h2>
        <p className="text-[#E0E0E0] mb-10">
          Get a fully customised quote for your next architectural project.
        </p>
        <button className="px-10 py-4 rounded-full bg-white text-[#0D004C] font-semibold hover:bg-[#3D85C6] hover:text-white transition flex items-center gap-3 mx-auto">
          Launch Quote Calculator <FaArrowRight />
        </button>
      </section>

    </div>
  );
}
