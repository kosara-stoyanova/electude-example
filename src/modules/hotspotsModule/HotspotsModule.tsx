import "./HotspotsModule.css";

import type { SvgHotspotDef } from "../../types/hotspot.types";
import SvgHotspot from "../../components/hotspotSvg/HotspotSvg";

type Props = {
  imgSrc: string;
  imgAlt: string;
  sceneWidth: number;
  sceneHeight: number;
  hotspots: SvgHotspotDef[];
  onSelect: (id: string) => void;
  debug?: boolean;
  highlightId?: string;
  disabled?: boolean;
};

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
}: Props) {
  return (
    <div
      className="hotspotsModule"
      style={
        {
          "--scene-width": `${sceneWidth}px`,
        } as React.CSSProperties
      }
    >
      <img
        src={imgSrc}
        alt={imgAlt}
        className="hotspotsModule__img"
        draggable={false}
      />

      <svg
        className="hotspotsModule__svg"
        viewBox={`0 0 ${sceneWidth} ${sceneHeight}`}
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
