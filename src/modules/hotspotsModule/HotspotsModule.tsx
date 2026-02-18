import type { SvgHotspotDef } from "../../types/hotspot.types";
import SvgHotspot from "../../components/hotspotSvg/HotspotSvg";

export default function HotspotsModule({
  imgSrc,
  imgAlt,
  sceneWidth,
  sceneHeight,
  hotspots,
  onSelect,
  debug = false,
  highlightId,
  disabled = false,
}: {
  imgSrc: string;
  imgAlt: string;
  sceneWidth: number;
  sceneHeight: number;
  hotspots: SvgHotspotDef[];
  onSelect: (id: string) => void;
  debug?: boolean;
  highlightId?: string; // highlight correct one if you want
  disabled?: boolean;
}) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: sceneWidth }}>
      <img
        src={imgSrc}
        alt={imgAlt}
        style={{ width: "100%", display: "block" }}
        draggable={false}
      />

      <svg
        viewBox={`0 0 ${sceneWidth} ${sceneHeight}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {hotspots.map((h) => (
          <SvgHotspot
            key={h.id}
            def={h}
            onSelect={onSelect}
            debug={debug}
            disabled={disabled}
            state={highlightId === h.id ? "correct" : "idle"}
          />
        ))}
      </svg>
    </div>
  );
}
