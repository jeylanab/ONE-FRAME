import { useState } from "react";

// Freight & Packaging data for all cities
const FREIGHT_OPTIONS = [
  {
    city: "AUCKLAND",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 4.9, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 38.74, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 38.74, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 38.74, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 141.1, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "CHRISTCHURCH",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 32.42, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 62.67, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 62.67, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 67.04, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 626.88, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "WELLINGTON",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 20.45, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 52.49, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 386.38, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "HAMILTON",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 10.61, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 185.31, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "TAURANGA",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 20.45, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 197.13, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "PALMERSTON NORTH",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 20.45, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 295.7, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "NELSON",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 32.42, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 62.67, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 62.97, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 69.99, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 654.48, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "NAPIER",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 20.45, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 291.76, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "NEW PLYMOUTH",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 20.45, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 291.76, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "WHANGAREI",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 10.61, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 50.14, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 50.14, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 50.14, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 193.19, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "INVERCARGIL",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 32.42, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 193.68, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 232.42, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 310.82, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 1515.58, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
  {
    city: "DUNEDIN",
    options: [
      { id: "FAB_ONLY", label: "Fabric Only", cost: 32.42, size: "470 x 460 x 260 mm", weight: "25kg" },
      { id: "SMALL", label: "Small - Complete", cost: 62.67, size: "1800 x 120 x 120 mm", weight: "6kg per mtr - frame" },
      { id: "MEDIUM", label: "Medium - Complete", cost: 62.67, size: "2400 x 120 x 120 mm", weight: "Varies" },
      { id: "LARGE", label: "Large - Complete", cost: 76.73, size: "3000 x 120 x 120 mm", weight: "Varies" },
      { id: "PALLET", label: "Pallet / Crate", cost: 717.57, size: "1200 x 2400 x 1200 mm", weight: "500kg" },
    ],
  },
];

// Main Component
export default function StepFreight({ quote, setQuote, onNext }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedOptionId(""); // reset option selection when city changes
  };

  const handleOptionSelect = (option) => {
    setSelectedOptionId(option.id);
    setQuote({
      ...quote,
      freight: {
        city: selectedCity,
        ...option,
      },
    });
  };

  const handleNext = () => {
    if (!selectedCity || !selectedOptionId) {
      alert("Please select city and shipping option to continue.");
      return;
    }
    onNext();
  };

  const cityData = FREIGHT_OPTIONS.find((c) => c.city === selectedCity);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Freight & Packaging
      </h2>

      {/* City Selection */}
      <div className="mb-8 grid md:grid-cols-4 gap-4">
        {FREIGHT_OPTIONS.map((city) => (
          <button
            key={city.city}
            onClick={() => handleCitySelect(city.city)}
            className={`p-4 rounded-lg border cursor-pointer font-semibold text-center transition
              ${selectedCity === city.city ? "border-[#0D004C] bg-[#0D004C] text-white" : "border-gray-300 hover:bg-gray-100"}
            `}
          >
            {city.city}
          </button>
        ))}
      </div>

      {/* Freight Options */}
      {cityData && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {cityData.options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`p-6 border rounded-xl cursor-pointer transition
                ${selectedOptionId === option.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
              `}
            >
              <h3 className="text-xl font-semibold mb-2">{option.label}</h3>
              <p className="text-gray-600 mb-1">Cost: ${option.cost.toFixed(2)}</p>
              <p className="text-gray-600 mb-1">Size: {option.size}</p>
              <p className="text-gray-600 mb-1">Weight: {option.weight}</p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-[#0D004C] text-white font-semibold rounded-lg hover:bg-[#3D85C6] transition"
        >
          Finish Quote
        </button>
      </div>
    </div>
  );
}
