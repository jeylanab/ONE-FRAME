export default function StepIntro({ quote, setQuote, onNext }) {
  const startQuote = () => {
    setQuote({
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
    });

    onNext(); // ✅ move to next step
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Quote Builder
      </h1>

      <p className="mb-6">
        Click below to start creating your custom quote.
      </p>

      <button
        onClick={startQuote}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Start Quote
      </button>
    </div>
  );
}
