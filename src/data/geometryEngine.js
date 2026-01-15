// geometryEngine.js

export const calculateGeometry = (shape, dims) => {
  const { a, b, c, d } = dims;
  const A = parseFloat(a) || 0;
  const B = parseFloat(b) || 0;
  const C = parseFloat(c) || 0;
  const D = parseFloat(d) || 0;

  let circumference = 0;
  let area = 0;

  switch (shape.toUpperCase()) {
    case "SQUARE":
      circumference = 4 * A;
      area = Math.pow(A, 2);
      break;

    case "RECTANGLE":
      circumference = 2 * (A + B);
      area = A * B;
      break;

    case "ROUND":
      // A is Radius (R)
      circumference = 2 * Math.PI * A;
      area = Math.PI * Math.pow(A, 2);
      break;

    case "TRIANGLE":
      circumference = A + B + C;
      // Heron's Formula for area when 3 sides are known
      const s = circumference / 2;
      area = Math.sqrt(s * (s - A) * (s - B) * (s - C));
      break;

    case "OVAL":
      // A = Semi-major axis, B = Semi-minor axis
      // Using Ramanujan Approximation for circumference
      const h = Math.pow(A - B, 2) / Math.pow(A + B, 2);
      circumference = Math.PI * (A + B) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
      area = Math.PI * (A / 2) * (B / 2);
      break;

    case "DIAMOND":
    case "RHOMBUS":
      // A & B are diagonals
      const side = Math.sqrt(Math.pow(A / 2, 2) + Math.pow(B / 2, 2));
      circumference = 4 * side;
      area = (A * B) / 2;
      break;

    case "TRAPEZIUM":
      circumference = A + B + C + D;
      // Requires a specific height (H) calculation or H as an input
      // Assuming A and B are parallel sides and C/D are legs
      area = 0.5 * (A + B) * C; // Simplified: user inputs height as C
      break;

    default:
      circumference = 0;
      area = 0;
  }

  return {
    lm: circumference / 1000, // Convert mm to LM
    sqm: area / 1000000,      // Convert mm² to SQM
  };
};