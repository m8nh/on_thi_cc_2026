import { useEffect, useState } from "react";

// Carregados sob demanda; sem o arquivo (clone do repo), a tela mostra lista vazia.
const modules = import.meta.glob("../data/vong2/*.json", { import: "default" });

export function useVong2Data(name) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let active = true;
    const load = modules[`../data/vong2/${name}.json`];
    (load ? load() : Promise.resolve([])).then((d) => { if (active) setData(d); });
    return () => { active = false; };
  }, [name]);
  return data;
}
