import { useEffect, useState } from "react";

// Re-renderiza o componente a cada segundo enquanto `enabled` for true (relógios, contagens).
export function useTicker(enabled = true) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);
}
