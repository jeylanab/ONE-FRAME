import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Contact() {
  return (
    <section className="bg-white py-24 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-20">
          
          {/* Left Side: Brand Statement & Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-6xl font-black uppercase tracking-tighter text-black leading-none mb-6">
                Let's Build <br />
                <span className="text-[#0D004C]">Together.</span>
              </h2>
              <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed">
                If you would like to talk more about our systems, intended applications, 
                and custom finishing, our team is ready to assist with technical expertise.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="bg-black p-4 text-white group-hover:bg-[#0D004C] transition-colors">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Inquiries</p>
                  <p className="text-xl font-black text-black">+64 9 309 7775</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="bg-black p-4 text-white group-hover:bg-[#0D004C] transition-colors">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                  <p className="text-xl font-black text-black">sales@oneframe.co.nz</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="bg-black p-4 text-white group-hover:bg-[#0D004C] transition-colors">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Studio</p>
                  <p className="text-xl font-black text-black">Auckland, New Zealand</p>
                </div>
              </div>
            </div>

            {/* Subtle "Engineering" Stamp */}
            <div className="pt-10 opacity-20 hidden lg:block">
              <p className="text-[120px] font-black uppercase tracking-tighter leading-none text-gray-100 select-none">
                CONTACT
              </p>
            </div>
          </div>

          {/* Right Side: High-Contrast Form */}
          <div className="bg-gray-50 p-10 md:p-16 border-2 border-black relative">
            {/* Decorative Corner Accent */}
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#0D004C]" />
            
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-3 text-sm font-bold transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black">Company</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-3 text-sm font-bold transition-colors"
                    placeholder="Architectural Studio"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-3 text-sm font-bold transition-colors"
                  placeholder="email@work.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black">Inquiry Type</label>
                <select className="w-full bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-3 text-sm font-bold transition-colors cursor-pointer">
                  <option>Project Consultation</option>
                  <option>Technical Specification</option>
                  <option>Acoustic Performance Inquiry</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black">Project Details</label>
                <textarea 
                  rows="4"
                  className="w-full bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-3 text-sm font-bold transition-colors resize-none"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <button className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] text-xs hover:bg-[#0D004C] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl">
                Send Inquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}