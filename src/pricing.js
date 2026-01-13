export const PRICING = {
  base: 75,
  sizeBands: [
    { label: "Small (<0.6 m²)", max: 0.6, add: 0 },
    { label: "Medium (0.6 - 1.2 m²)", max: 1.2, add: 25 },
    { label: "Large (>1.2 m²)", max: Infinity, add: 55 },
  ],
  glazing: { single: 0, double: 40, triple: 90 },
  height: { ground: 0, first: 30, second: 60, scaffold: 120 },
  condition: { good: 0, fair: 35, poor: 80 },
  perWindowMultiplier: 1,
};
