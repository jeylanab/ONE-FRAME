import { useState, useEffect } from "react";

// Formulas for each shape
const FORMULAS = {
  SQUARE: {
    fields: ["A"],
    circumference: ({ A }) => 4 * A,
    area: ({ A }) => A ** 2,
  },
  RECTANGLE: {
    fields: ["L", "W"],
    circumference: ({ L, W }) => 2 * (L + W),
    area: ({ L, W }) => L * W,
  },
  ROUND: {
    fields: ["R"],
    circumference: ({ R }) => 2 * Math.PI * R,
    area: ({ R }) => Math.PI * R ** 2,
  },
  TRIANGLE: {
    fields: ["a", "b", "c", "H"], // H = height
    circumference: ({ a, b, c }) => a + b + c,
    area: ({ b, H }) => 0.5 * b * H,
  },
  OVAL: {
    fields: ["A", "B"],
    circumference: ({ A, B }) => Math.PI * (3 * (A + B) - Math.sqrt((3 * A + B) * (A + 3 * B))),
    area: ({ A, B }) => Math.PI * (A / 2) * (B / 2),
  },
  DIAMOND: {
    fields: ["L1", "L2", "D1", "D2"],
    circumference: ({ L1, L2 }) => 2 * (L1 + L2),
    area: ({ D1, D2 }) => (D1 * D2) / 2,
  },
  TRAPEZIUM: {
    fields: ["a", "b", "c", "d", "H"],
    circumference: ({ a, b, c, d }) => a + b + c + d,
    area: ({ A, b, H }) => 0.5 * (A + b) * H,
  },
  CUSTOM: {
    fields: ["A", "B"], // customizable for user-defined shapes
    circumference: ({ A, B }) => 2 * (A + B),
    area: ({ A, B }) => A * B,
  },
};

export default function StepMeasurements({ quote, setQuote, onNext }) {
  const shapeId = quote?.shape?.id;
  const formula = FORMULAS[shapeId];

  // Initialize measurements with current quote values or zeros
  const [measurements, setMeasurements] = useState(
    formula?.fields.reduce((acc, field) => {
      acc[field] = quote?.measurements?.[field] || "";
      return acc;
    }, {}) || {}
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Update quote whenever measurements change
    if (formula) {
      const valid = Object.values(measurements).every((v) => !isNaN(parseFloat(v)) && v !== "");
      if (valid) {
        const circ = formula.circumference(
          Object.fromEntries(Object.entries(measurements).map(([k, v]) => [k, parseFloat(v)]))
        );
        const area = formula.area(
          Object.fromEntries(Object.entries(measurements).map(([k, v]) => [k, parseFloat(v)]))
        );

        setQuote({
          ...quote,
          measurements: { ...measurements },
          estimates: {
            ...quote.estimates,
            circumference: circ,
            area: area,
          },
        });
      }
    }
  }, [measurements]);

  const handleChange = (field, value) => {
    // allow only numbers
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setMeasurements({ ...measurements, [field]: value });
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleNext = () => {
    let hasError = false;
    const newErrors = {};
    formula.fields.forEach((field) => {
      if (!measurements[field] || isNaN(measurements[field])) {
        hasError = true;
        newErrors[field] = "Required number";
      }
    });
    setErrors(newErrors);

    if (!hasError) {
      onNext();
    }
  };

  if (!formula) return <p>Please select a shape first.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0D004C]">
        Enter Measurements for {shapeId}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {formula.fields.map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{field}</label>
            <input
              type="text"
              value={measurements[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className={`border rounded p-2 ${errors[field] ? "border-red-500" : "border-gray-300"}`}
              placeholder={`Enter ${field}`}
            />
            {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">
          Circumference: {quote?.estimates?.circumference?.toFixed(2) || 0}
        </p>
        <p className="text-lg font-semibold">
          Area: {quote?.estimates?.area?.toFixed(2) || 0}
        </p>
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
