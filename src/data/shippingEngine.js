// shippingEngine.js

export const determineFreightTier = (dims, totalWeight) => {
  const maxDim = Math.max(dims.a || 0, dims.b || 0, dims.c || 0);

  // 1. Check for Pallet Tier (Weight based)
  if (totalWeight > 100) return "pallet / crate";

  // 2. Check for Size Tiers (Dimension based in mm)
  if (maxDim <= 1800) return "small - complete";
  if (maxDim <= 2400) return "medim - complete";
  if (maxDim <= 3000) return "large - complete";

  // 3. Fallback to Pallet if over 3m
  return "pallet / crate";
};