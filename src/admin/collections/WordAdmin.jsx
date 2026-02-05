import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function WordAdmin() {
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
        updatedAt: serverTimestamp() // Using serverTimestamp for consistency
      }, { merge: true });
      
      setMessage("✅ Database Synced Successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error pushing to Firestore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header aligned with other Admin pages */}
      <h1 className="text-2xl font-bold mb-6 text-[#0D004C]">System Word Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar - Step Selector */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3">Logic Steps</p>
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStep(s.id)}
              className={`w-full p-3 text-left rounded-lg border transition-all text-sm font-semibold ${
                selectedStep === s.id 
                ? "border-[#0D004C] bg-[#0D004C] text-white shadow-md" 
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Form Panel - Matches Lighting/Prebuild Container Style */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-[#0D004C]">
            <h2 className="text-lg font-semibold mb-6 text-gray-700 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-[#3D85C6]" />
              Editing: {steps.find(s => s.id === selectedStep)?.label}
            </h2>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Main Header Title</label>
                <input 
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Design & Concept"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#3D85C6] outline-none transition-all text-[#0D004C] font-bold text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Instructional Subtitle</label>
                <textarea 
                  rows="4"
                  value={form.subtitle}
                  onChange={(e) => setForm({...form, subtitle: e.target.value})}
                  placeholder="Describe the objective for this step..."
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#3D85C6] outline-none transition-all text-gray-600 text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm font-bold text-green-600">{message}</span>
                
                <button 
                  onClick={handlePush}
                  disabled={loading}
                  className="px-8 py-3 bg-[#0D004C] text-white rounded font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-300"
                >
                  {loading ? "Saving Changes..." : "Update Live Site"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Helpful Hint (Matches the "clean" aesthetic) */}
          <p className="mt-4 text-xs text-gray-400 italic">
            * Changes made here will update the headers across the user-facing configuration steps immediately.
          </p>
        </div>
      </div>
    </div>
  );
}