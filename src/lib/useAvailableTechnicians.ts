"use client";

import { useEffect, useState } from "react";
import { company } from "@/data/company";

const TOTAL = company.urgency.totalTechnicians;
const DEFAULT_LABEL = `${TOTAL}/${TOTAL}`;

// Cached per browser page load so every badge on the page agrees on the
// same number instead of each picking its own random value independently.
let cachedLabel: string | null = null;

function rollLabel(): string {
  if (cachedLabel) return cachedLabel;
  const available = Math.floor(Math.random() * TOTAL) + 1; // 1..TOTAL
  cachedLabel = `${available}/${TOTAL}`;
  return cachedLabel;
}

/**
 * Returns "X/3" (total team size fixed at 3, X varies 1-3) — random on each
 * fresh page load to feel live. Starts at DEFAULT_LABEL on first render
 * (matches the prerendered HTML) and updates after mount to avoid
 * hydration mismatches.
 */
export function useAvailableTechnicians(): string {
  const [label, setLabel] = useState(DEFAULT_LABEL);

  useEffect(() => {
    setLabel(rollLabel());
  }, []);

  return label;
}
