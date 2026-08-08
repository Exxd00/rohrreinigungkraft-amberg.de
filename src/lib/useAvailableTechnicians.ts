"use client";

import { useEffect, useState } from "react";
import { company } from "@/data/company";

const BASE_RANGE = company.urgency.availableTechnicians;

// Cached per browser page load so every badge on the page agrees on the
// same number instead of each picking its own random value independently.
let cachedRange: string | null = null;

function rollRange(): string {
  if (cachedRange) return cachedRange;
  const [low, high] = BASE_RANGE.split("-").map(Number);
  const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
  cachedRange = `${low + shift}-${high + shift}`;
  return cachedRange;
}

/**
 * Returns the "X-Y Techniker verfügbar" range, shifted by -1/0/+1 on each
 * fresh page load to feel live. Starts at the static BASE_RANGE on first
 * render (matches the prerendered HTML) and updates after mount to avoid
 * hydration mismatches.
 */
export function useAvailableTechnicians(): string {
  const [range, setRange] = useState(BASE_RANGE);

  useEffect(() => {
    setRange(rollRange());
  }, []);

  return range;
}
