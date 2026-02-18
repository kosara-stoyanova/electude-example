import type { SvgHotspotDef } from "../../types/hotspot.types";

export default function SvgHotspot({
  def,
  state = "idle",
  onSelect,
  debug = false,
  disabled = false,
}: {
  def: SvgHotspotDef;
  state?: "idle" | "hover" | "correct" | "wrong";
  onSelect: (id: string) => void;
  debug?: boolean; // show outlines while tuning
  disabled?: boolean;
}) {
  const commonProps = {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) onSelect(def.id);
    },
    style: { cursor: disabled ? "not-allowed" : "pointer" },
    "aria-label": def.label ?? def.id,
  } as const;

  // Visuals
  const fill =
    state === "correct"
      ? "rgba(75, 140, 92, 0.25)"
      : state === "wrong"
        ? "rgba(170, 70, 70, 0.22)"
        : debug
          ? "rgba(59,130,246,0.12)"
          : "transparent";

  const stroke =
    state === "correct"
      ? "rgba(75, 140, 92, 0.9)"
      : state === "wrong"
        ? "rgba(170, 70, 70, 0.9)"
        : debug
          ? "rgba(59,130,246,0.7)"
          : "transparent";

  const strokeWidth = debug || state === "correct" || state === "wrong" ? 2 : 0;

  const baseStyle = {
    fill,
    stroke,
    strokeWidth,
    transition: "fill 120ms ease, stroke 120ms ease",
    pointerEvents: disabled ? "none" : "auto",
  } as const;

  const { shape } = def;

  if (shape.kind === "poly") {
    return (
      <polygon
        points={shape.points}
        {...commonProps}
        style={{ ...commonProps.style, ...baseStyle }}
      />
    );
  }

  if (shape.kind === "rect") {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        {...commonProps}
        style={{ ...commonProps.style, ...baseStyle }}
      />
    );
  }

  // circle
  return (
    <circle
      cx={shape.cx}
      cy={shape.cy}
      r={shape.r}
      {...commonProps}
      style={{ ...commonProps.style, ...baseStyle }}
    />
  );
}
