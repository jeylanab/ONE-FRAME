import logo from "../assets/oneframe.png"; // Ensure path is correct

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 grayscale invert">
              <img src={logo} alt="OneFrame" className="h-8" />
              <span className="font-black text-2xl tracking-tighter uppercase">OneFrame</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Speciality manufacturer delivering sustainable fabric tension solutions locally and internationally. 
              Engineering innovation into every design.
            </p>
            <div className="text-xs font-black tracking-widest text-[#0D004C] flex gap-4 uppercase">
              <span>Acoustic</span>
              <span className="text-gray-700">|</span>
              <span>Illuminated</span>
              <span className="text-gray-700">|</span>
              <span>Printed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-400">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:text-[#0D004C] transition">Our Systems</a></li>
              <li><a href="#" className="hover:text-[#0D004C] transition">Case Studies</a></li>
              <li><a href="#" className="hover:text-[#0D004C] transition">Technical Blog</a></li>
              <li><a href="#" className="hover:text-[#0D004C] transition">Quote Calculator</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-400">Contact HQ</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li className="text-white font-black text-lg">+64 9 309 7775</li>
              <li>New Zealand Developed & Manufactured</li>
              <li>Strategic Support Globally</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Newsletter</h4>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-6">Stay updated on innovative delivery.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-b border-gray-800 p-2 text-xs focus:border-white outline-none transition"
              />
              <button className="mt-4 bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#0D004C] hover:text-white transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Copyright © 2026 · OneFrame Limited · All Rights Reserved
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Trade</a>
            <a href="#" className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}