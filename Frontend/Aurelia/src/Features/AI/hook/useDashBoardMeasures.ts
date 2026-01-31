import { useMemo } from "react";
import type { Measure, MeasureItem } from "../types";

export function useDashBoardMeasures(datas?: Measure) {
  const measures: MeasureItem[] = useMemo(
    () => [
      {
        label: "Vai",
        value: datas?.vai,
        icon:' <Move className="w-5 h-5 text-blue-600" /> ' ,
        unit: "cm",
      },
      {
        label: "Ngực",
        value: datas?.nguc,
        icon: ' <Heart className="w-5 h-5 text-pink-600" /> ',
        unit: "cm",
      },
      {
        label: "Eo",
        value: datas?.eo,
        icon: ' <Circle className="w-5 h-5 text-green-600" /> ',
        unit: "cm",
      },
      {
        label: "Hông",
        value: datas?.hong,
        icon: ' <Square className="w-5 h-5 text-purple-600" /> ',
        unit: "cm",
      },
    ],
    [datas]
  );

  const hasData = useMemo(
    () => measures.some((m) => m.value),
    [measures]
  );

  return { measures, hasData };
}
