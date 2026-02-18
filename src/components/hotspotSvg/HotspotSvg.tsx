import "./HotspotSvg.css";
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
  debug?: boolean;
  disabled?: boolean;
}) {
  const commonProps = {
    className: "svg-hotspot",
    "data-state": state,
    "data-debug": debug ? "true" : "false",
    "data-disabled": disabled ? "true" : "false",
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) onSelect(def.id);
    },
    "aria-label": def.label ?? def.id,
  } as const;

  const { shape } = def;

  if (shape.kind === "poly") {
    return <polygon points={shape.points} {...commonProps} />;
  }

  if (shape.kind === "rect") {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        {...commonProps}
      />
    );
  }

  return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...commonProps} />;
}
