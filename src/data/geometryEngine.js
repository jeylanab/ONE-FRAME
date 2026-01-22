/**
 * OneFrame Geometry Engine - Updated with Spreadsheet Logic
 * Converts mm inputs to LM (Perimeter) and SQM (Area)
 */

export const SHAPE_FORMULAS = {
  SQUARE: {
    label: "Square",
    dimensions: ["a"],
    calc: (d) => ({
      lm: (4 * d.a) / 1000,
      sqm: Math.pow(d.a, 2) / 1000000
    })
  },
  RECTANGLE: {
    label: "Rectangle",
    dimensions: ["a", "b"], // L and W
    calc: (d) => ({
      lm: (2 * (parseFloat(d.a) + parseFloat(d.b))) / 1000,
      sqm: (d.a * d.b) / 1000000
    })
  },
  ROUND: {
    label: "Round",
    dimensions: ["a"], // Diameter (A). R = A/2
    calc: (d) => {
      const r = d.a / 2;
      return {
        lm: (2 * Math.PI * r) / 1000,
        sqm: (Math.PI * Math.pow(r, 2)) / 1000000
      };
    }
  },
  TRIANGLE: {
    label: "Triangle",
    dimensions: ["a", "b", "c"], // Sides a, b, c for perimeter; b and h for area
    // Note: We assume 'c' is the height (H) for the area calculation 0.5 * b * H
    calc: (d) => ({
      lm: (parseFloat(d.a) + parseFloat(d.b) + parseFloat(d.c)) / 1000,
      sqm: (0.5 * d.b * d.c) / 1000000
    })
  },
  OVAL: {
    label: "Oval",
    dimensions: ["a", "b"], 
    calc: (d) => {
      // Spreadsheet Formula: PI() * (3*(A+b) - SQRT((3*A+b)*(A+3*b)))
      const a = parseFloat(d.a);
      const b = parseFloat(d.b);
      const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
      const area = Math.PI * (a / 2) * (b / 2);
      return {
        lm: perimeter / 1000,
        sqm: area / 1000000
      };
    }
  },
  DIAMOND: {
    label: "Diamond / Rhombus",
    dimensions: ["a", "b"], // L1 and L2 for perimeter; D1 and D2 for area
    calc: (d) => ({
      lm: (2 * (parseFloat(d.a) + parseFloat(d.b))) / 1000,
      sqm: ((d.a * d.b) / 2) / 1000000
    })
  },
  TRAPEZIUM: {
    label: "Trapezium",
    dimensions: ["a", "b", "c", "d"], // a, b, c, d for perimeter; a, b, and height for area
    // We treat 'd' as the Height (H) for area: 0.5 * (A + B) * H
    calc: (d) => ({
      lm: (parseFloat(d.a) + parseFloat(d.b) + parseFloat(d.c) + parseFloat(d.d)) / 1000,
      sqm: (0.5 * (parseFloat(d.a) + parseFloat(d.b)) * d.d) / 1000000
    })
  }
};

export const calculateStats = (shapeName, dims) => {
  const key = shapeName?.toUpperCase().split(' ')[0]; // Handle "DIAMOND / RHOMBUS"
  const formula = SHAPE_FORMULAS[key] || SHAPE_FORMULAS.RECTANGLE;
  
  const d = {
    a: parseFloat(dims.a) || 0,
    b: parseFloat(dims.b) || 0,
    c: parseFloat(dims.c) || 0,
    d: parseFloat(dims.d) || 0,
  };

  return formula.calc(d);
};