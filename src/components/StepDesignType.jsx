import { useState } from "react";

const DESIGN_TYPES = [
  {
    id: "basic",
    title: "Basic Concept Design",
    description: "Basic concept design - detailed line drawing showing sizes",
    price: 495.95,
  },
  {
    id: "white_render",
    title: "White Rendered Concept Design",
    description: "White rendered concept design - white render with detailed line drawing showing sizes",
    price: 995.95,
  },
  {
    id: "colour_render",
    title: "Colour Rendered Concept Design",
    description: "Colour rendered concept design - full-colour render with detailed line drawing showing sizes",
    price: 1995.95,
  },
  {
    id: "detailed",
    title: "Detailed Design",
    description: "Detailed concept design - detailed line drawing + profile + lighting + fabric + acoustic",
    price: 2494.95,
  },
  {
    id: "detailed_white",
    title: "Detailed White Render Design",
    description: "Detailed white render design - line drawing + profile + lighting + fabric + acoustic",
    price: 2495.95,
  },
  {
    id: "detailed_colour",
    title: "Detailed Colour Render Design",
    description: "Detailed colour render design - full-colour render + profile + lighting + fabric + acoustic",
    price: 2995.95,
  },
  {
    id: "technical",
    title: "Technical Drawing Set",
    description: "Technical drawing set - detailed drawings + specification sheets",
    price: 3495.95,
  },
];

export default function StepDesignType({ quote, setQuote, onNext }) {
  const [selectedId, setSelectedId] = useState(quote?.designType?.id || "");

  const handleSelect = (design) => {
    setSelectedId(design.id);
    // Save selection in quote object
    setQuote({
      ...quote,
      designType: {
        id: design.id,
        title: design.title,
        price: design.price,
      },
    });
  };

  const handleNext = () => {
    if (!selectedId) {
      alert("Please select a design type to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Your Design Type
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {DESIGN_TYPES.map((design) => (
          <div
            key={design.id}
            onClick={() => handleSelect(design)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedId === design.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{design.title}</h3>
            <p className="text-gray-600 mb-4">{design.description}</p>
            <p className="font-bold text-[#3D85C6]">${design.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-[#0D004C] text-white font-semibold rounded-lg hover:bg-[#3D85C6] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
