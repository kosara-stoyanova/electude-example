export type HotspotShape =
  | { kind: "poly"; points: string }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "circle"; cx: number; cy: number; r: number };

export type SvgHotspotDef = {
  id: string;
  label?: string;
  shape: HotspotShape;
};
