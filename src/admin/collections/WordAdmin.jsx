import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { CloudArrowUpIcon, CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function WordAdmin() {
  // Your 7 Steps defined with stable IDs for Firestore
  const steps = [
    { id: "step1_design", label: "01. Design & Concept" },
    { id: "step2_geometry", label: "02. Shape & Geometry" },
    { id: "step3_structural", label: "03. Structural Spec" },
    { id: "step4_graphics", label: "04. Graphics & Electrical" },
    { id: "step5_acoustic", label: "05. Acoustic Treatment" },
    { id: "step6_logistics", label: "06. Logistics & Dispatch" },
    { id: "step7_summary", label: "07. Quote Summary" },
  ];

  const [selectedStep, setSelectedStep] = useState(steps[0].id);
  const [form, setForm] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing content from Firestore when step selection changes
  useEffect(() => {
    const loadContent = async () => {
      const docRef = doc(db, "content", selectedStep);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setForm(snap.data());
      } else {
        setForm({ title: "", subtitle: "" });
      }
    };
    loadContent();
  }, [selectedStep]);

  const handlePush = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "content", selectedStep), {
        title: form.title,
        subtitle: form.subtitle,
        updatedAt: new Date()
      }, { merge: true });
      
      setMessage("Database Synced Successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error pushing to Firestore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <DocumentTextIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Word Manager</h2>
          <p className="text-sm text-gray-500 font-medium">Global Header Control for all 07 Configuration Steps</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Selector Panel */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Logic Step</label>
          <div className="flex flex-col gap-2">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStep(s.id)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-tight ${
                  selectedStep === s.id 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "border-gray-50 text-gray-400 hover:border-indigo-200 bg-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editing Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 self-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Header Title</label>
              <input 
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="e.g. Design & Concept"
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-black text-2xl transition-all text-gray-900 shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructional Subtitle</label>
              <textarea 
                rows="4"
                value={form.subtitle}
                onChange={(e) => setForm({...form, subtitle: e.target.value})}
                placeholder="Describe the objective for this step..."
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none text-gray-600 font-medium transition-all shadow-inner leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {message && <CheckCircleIcon className="w-5 h-5 text-green-500 animate-pulse" />}
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{message}</span>
              </div>
              
              <button 
                onClick={handlePush}
                disabled={loading}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white px-12 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-indigo-100"
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                {loading ? "Pushing Data..." : "Update Live Site"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}