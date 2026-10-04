"use client";

import { useEffect, useState } from "react";

/**
 * True once the client has hydrated (avoids SSR/CSR markup mismatch
 * for things like returning-visitor copy that depends on storage).
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
