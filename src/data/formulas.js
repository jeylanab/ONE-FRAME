export const calculateCircumference = (shapeId, values) => {
  switch (shapeId) {
    case "SQUARE":
      return 4 * values.A;

    case "RECTANGLE":
      return 2 * (values.A + values.B);

    case "ROUND":
      return 2 * Math.PI * values.R;

    case "TRIANGLE":
      return values.A + values.B + values.C;

    case "OVAL":
      return Math.PI * (3 * (values.A + values.B) -
        Math.sqrt((3 * values.A + values.B) * (values.A + 3 * values.B)));

    default:
      return 0;
  }
};

export const calculateArea = (shapeId, values) => {
  switch (shapeId) {
    case "SQUARE":
      return values.A * values.A;

    case "RECTANGLE":
      return values.A * values.B;

    case "ROUND":
      return Math.PI * values.R * values.R;

    case "TRIANGLE":
      return 0.5 * values.B * values.H;

    case "OVAL":
      return Math.PI * (values.A / 2) * (values.B / 2);

    default:
      return 0;
  }
};
