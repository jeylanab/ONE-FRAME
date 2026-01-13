import React, { useState, useEffect } from "react";

export default function QuoteSummary({ quote, setQuote }) {
  const [totals, setTotals] = useState({
    shape: 0,
    formula: 0,
    measurements: 0,
    frame: 0,
    corners: 0,
    setup: 0,
    fabric: 0,
    lighting: 0,
    acoustics: 0,
    powderCoating: 0,
    prebuild: 0,
    freight: 0,
    grandTotal: 0,
  });

  // calculate totals whenever quote changes
  useEffect(() => {
    const shapeCost = quote.shape?.sell || 0;
    const formulaCost = quote.formula?.sell || 0;
    const measurementsCost = quote.measurements?.cost || 0;
    const frameCost = quote.frame?.sell || 0;
    const cornersCost = quote.corners?.sell || 0;
    const setupCost = quote.setup?.sell || 0;
    const fabricCost = quote.fabric?.sell || 0;
    const lightingCost = quote.lighting?.sell || 0;
    const acousticsCost = quote.acoustics?.sell || 0;
    const powderCost = quote.powderCoating?.sell || 0;
    const prebuildCost = quote.prebuild ? (quote.prebuild?.sell || 0) : 0;
    const freightCost = quote.freight?.sell || 0;

    const grandTotal =
      shapeCost +
      formulaCost +
      measurementsCost +
      frameCost +
      cornersCost +
      setupCost +
      fabricCost +
      lightingCost +
      acousticsCost +
      powderCost +
      prebuildCost +
      freightCost;

    setTotals({
      shape: shapeCost,
      formula: formulaCost,
      measurements: measurementsCost,
      frame: frameCost,
      corners: cornersCost,
      setup: setupCost,
      fabric: fabricCost,
      lighting: lightingCost,
      acoustics: acousticsCost,
      powderCoating: powderCost,
      prebuild: prebuildCost,
      freight: freightCost,
      grandTotal,
    });
  }, [quote]);

  const handleEditPrice = (section, value) => {
    const newSell = parseFloat(value) || 0;
    setQuote((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        sell: newSell,
      },
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Quote Summary
      </h2>

      <div className="space-y-4">
        {[
          "shape",
          "formula",
          "measurements",
          "frame",
          "corners",
          "setup",
          "fabric",
          "lighting",
          "acoustics",
          "powderCoating",
          "prebuild",
          "freight",
        ].map((section) => {
          const item = quote[section];
          if (!item) return null;

          return (
            <div
              key={section}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <div>
                <p className="font-semibold capitalize">{section}</p>
                {item.description && (
                  <p className="text-gray-500 text-sm">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#3D85C6]">
                  ${item.sell?.toLocaleString() || 0}
                </span>
                <input
                  type="number"
                  className="w-24 border rounded px-2 py-1 text-right"
                  value={item.sell || 0}
                  onChange={(e) => handleEditPrice(section, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 text-right">
        <p className="text-xl font-bold text-[#0D004C]">
          Total: ${totals.grandTotal.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
