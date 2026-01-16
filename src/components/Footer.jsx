import logo from "../assets/oneframe.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <div className="flex flex-col gap-4 grayscale invert opacity-100">
              {/* Increased Logo Size: h-16 (64px) for high visibility */}
              <img 
                src={logo} 
                alt="OneFrame" 
                className="h-16 w-auto object-contain self-start" 
              />
              <span className="font-black text-3xl tracking-tighter uppercase leading-none">
                OneFrame
              </span>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Speciality manufacturer delivering sustainable fabric tension solutions locally and internationally. 
              Engineering innovation into every design.
            </p>
            
            {/* Brighter accent color for better contrast on black */}
            <div className="text-[10px] font-black tracking-[0.3em] text-blue-500 flex gap-4 uppercase">
              <span>Acoustic</span>
              <span className="text-gray-800">|</span>
              <span>Illuminated</span>
              <span className="text-gray-800">|</span>
              <span>Printed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-gray-500">Navigation</h4>
            <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
              <li><Link to="/features" className="hover:text-blue-500 transition-colors">Our Systems</Link></li>
              <li><Link to="/case-studies" className="hover:text-blue-500 transition-colors">Case Studies</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 transition-colors">Technical Blog</Link></li>
              <li><Link to="/quote" className="hover:text-blue-500 transition-colors">Quote Calculator</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-gray-500">Contact HQ</h4>
            <ul className="space-y-6">
              <li className="text-white font-black text-2xl tracking-tighter">+64 9 309 7775</li>
              <li className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                New Zealand Developed <br /> & Manufactured
              </li>
              <li className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Strategic Support Globally
              </li>
            </ul>
          </div>

          {/* Newsletter - Brutalist Design */}
          <div className="bg-[#0A0A0A] p-8 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-white">Join the Evolution</h4>
            <p className="text-[10px] text-gray-600 uppercase font-bold mb-8 leading-relaxed">
              Stay updated on innovative delivery and sustainable systems.
            </p>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-b border-gray-800 pb-3 text-[10px] font-bold tracking-widest focus:border-white outline-none transition-colors placeholder:text-gray-700"
              />
              <button className="mt-4 bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all transform active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.3em]">
            © 2026 OneFrame Limited · Precision Engineered in NZ
          </p>
          <div className="flex gap-10 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}