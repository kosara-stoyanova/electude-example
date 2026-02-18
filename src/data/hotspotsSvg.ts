import type { SvgHotspotDef } from "../types/hotspot.types";

export const SCENE = { w: 700, h: 439 };

export const svgHotspots: SvgHotspotDef[] = [
  {
    id: "engine",
    label: "Engine",
    shape: {
      kind: "poly",
      points: "215,160 360,135 425,165 430,260 390,295 240,295 200,230",
    },
  },
  {
    id: "battery",
    label: "Battery",
    shape: {
      kind: "poly",
      points: "462,236 569,236 578,286 575,300 466,300 458,286",
    },
  },
];
