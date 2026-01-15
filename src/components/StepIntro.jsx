import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function StepIntro({ quote, setQuote, onNext, setQuoteId }) {
  const { currentUser } = useAuth();

  const startQuote = async () => {
    // 1️⃣ Keep your existing local behavior (so nothing breaks)
    const localQuote = {
      shape: null,
      formula: null,
      measurements: {},
      quantity: 1,
      frame: {},
      corners: {},
      setup: {},
      fabric: {},
      lighting: {},
      acoustics: {},
      powderCoating: {},
      prebuild: false,
      estimates: {
        frameWeight: 0,
        fabricWeight: 0,
        lightingWeight: 0,
        totalWeight: 0,
        freight: 0,
      },
    };

    setQuote(localQuote);

    // 2️⃣ Try to persist to Firebase (non-blocking)
    try {
      if (currentUser) {
        const docRef = await addDoc(collection(db, "quotes"), {
          ...localQuote,
          userId: currentUser.uid,
          currentStep: "SHAPE",
          status: "draft",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setQuoteId?.(docRef.id);
      }
    } catch (err) {
      console.error("Firestore save failed:", err);
      // UI continues even if Firebase fails
    }

    // 3️⃣ Move forward exactly like before
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Quote Builder</h1>

      <p className="mb-6">Click below to start creating your custom quote.</p>

      <button
        onClick={startQuote}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Start Quote
      </button>
    </div>
  );
}
