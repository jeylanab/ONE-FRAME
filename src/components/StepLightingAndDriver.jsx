import { useState } from "react";

export default function StepLightingAndDriver({ quote, setQuote, onNext }) {
  // Lighting fixtures
  const LIGHTINGS = [
    { id: "L235-6500", size: "235mm - 6500K", lumens: 1475, sellPerSQM: 50 },
    { id: "L470-6500", size: "470mm - 6500K", lumens: 2950, sellPerSQM: 100 },
    { id: "L235-3500", size: "235mm - 3500K", lumens: 1400, sellPerSQM: 45 },
    { id: "L470-3500", size: "470mm - 3500K", lumens: 2800, sellPerSQM: 90 },
    { id: "8W24V-W", size: "100mm x 100mm", lumens: 300, sellPerSQM: 30 },
    { id: "8W24V-T", size: "100mm x 100mm", lumens: 300, sellPerSQM: 30 },
    { id: "8W24V-C", size: "100mm x 100mm", lumens: 300, sellPerSQM: 30 },
  ];

  // Drivers / DALI controllers
  const LIGHT_DRIVERS = [
    { code: "SLD80", output: "235mm - 6500K", description: "MeanWell driver - 80W/24VDC", sellPerUnit: 50 },
    { code: "ELG240", output: "24V/10A/240W", description: "MeanWell driver - 240W/24VDC", sellPerUnit: 120 },
    { code: "LM-240-24-G1D2", output: "24V/10A/240W", description: "LTECH DALI driver - 240W/24VDC - white", sellPerUnit: 150 },
    { code: "LM-240-24-G2D2", output: "24V/10A/240W", description: "LTECH DALI driver - 240W/24VDC - tunable", sellPerUnit: 160 },
    { code: "LM-240-24-G4K3", output: "24V/10A/240W", description: "LTECH DALI driver - 240W/24VDC - RGBW", sellPerUnit: 180 },
    { code: "DGDALIDM", output: "", description: "DALI Control Panel - white", sellPerUnit: 100 },
    { code: "DGDALIDM8", output: "", description: "DALI Control Panel - tunable", sellPerUnit: 120 },
    { code: "EDT4", output: "", description: "DALI Control Panel - RGBW", sellPerUnit: 150 },
  ];

  const [selectedLight, setSelectedLight] = useState(quote?.lighting?.id || "");
  const [selectedDriver, setSelectedDriver] = useState(quote?.driver?.code || "");
  const area = quote?.estimates?.area || 0;

  // Select lighting fixture
  const handleLightingSelect = (light) => {
    setSelectedLight(light.id);
    setQuote({
      ...quote,
      lighting: {
        ...light,
        totalCost: light.sellPerSQM * area,
      },
    });
  };

  // Select driver / controller
  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver.code);
    setQuote({
      ...quote,
      driver: {
        ...driver,
        totalCost: driver.sellPerUnit, // cost per unit
      },
    });
  };

  const handleNext = () => {
    if (!selectedLight) {
      alert("Please select a lighting option to continue.");
      return;
    }
    if (!selectedDriver) {
      alert("Please select a driver/controller to continue.");
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* LIGHTING SECTION */}
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Lighting Fixture
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {LIGHTINGS.map((light) => (
          <div
            key={light.id}
            onClick={() => handleLightingSelect(light)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedLight === light.id ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{light.size}</h3>
            <p className="text-gray-600 mb-2">Lumens: {light.lumens}</p>
            <p className="font-bold text-[#3D85C6]">Sell per sqm: ${light.sellPerSQM}</p>
            <p className="text-gray-700 mt-2">Total Cost: ${(light.sellPerSQM * area).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* DRIVER SECTION */}
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Select Driver / Controller
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {LIGHT_DRIVERS.map((driver) => (
          <div
            key={driver.code}
            onClick={() => handleDriverSelect(driver)}
            className={`p-6 border rounded-xl cursor-pointer transition
              ${selectedDriver === driver.code ? "border-[#0D004C] shadow-lg" : "border-gray-300 hover:shadow-md"}
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{driver.code} {driver.output && `- ${driver.output}`}</h3>
            <p className="text-gray-600 mb-2">{driver.description}</p>
            <p className="font-bold text-[#3D85C6]">Sell: ${driver.sellPerUnit}</p>
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
