import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function StepIntro({ setQuote, onNext, setQuoteId }) {
  const { currentUser } = useAuth();

  const startQuote = async () => {
    // Initial state matching your calculation requirements
    const initialQuote = {
      userId: currentUser?.uid || "guest",
      status: "draft",
      // Measurements & Geometry
      shape: null,
      measurements: { a: 0, b: 0, c: 0, d: 0 },
      quantity: 1,
      stats: { lm: 0, sqm: 0 }, // Calculated live at the Shape step
      // Selections (Objects to store full Firestore data + sell price)
      design: { id: "NA", name: "Not Required", sell: 0 },
      frame: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      corners: { id: "NA", name: "Not Required", sell: 0 },
      setup: { sell: 0 }, // Auto-set based on shape
      fabric: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      lighting: { id: "NA", name: "Not Required", sell: 0, weight: 0 },
      acoustics: { id: "NA", name: "Not Required", sell: 0 },
      prebuild: { selected: false, sell: 0 },
      // Logistics
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

    onNext(); // Move to StepShape.jsx
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-3xl shadow-xl max-w-2xl mx-auto text-center border border-gray-100">
      <div className="bg-indigo-100 p-4 rounded-full mb-6">
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-60H6" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">Oneframe Quote Builder</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Start your custom configuration. We will guide you through shape selection, 
        material specifications, and provide a real-time freight estimate.
      </p>

      <button
        onClick={startQuote}
        className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
      >
        Start New Quote
      </button>
    </div>
  );
}