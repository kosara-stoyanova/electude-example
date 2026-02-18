import { useEffect, useMemo, useRef, useState } from "react";
import "./CableDragModule.css";

type TerminalId = "negative" | "positive";

type Props = {
  imgSrc: string;
  required: "negative" | "positive";
  disconnected: { negative: boolean; positive: boolean };
  onCorrect: () => void;
  onWrongAttempt: () => void;
  disabled?: boolean;
};

const VIEW_W = 800;
const VIEW_H = 569;

const TERMINALS: Record<TerminalId, { x: number; y: number }> = {
  negative: { x: 280, y: 150 },
  positive: { x: 580, y: 90 },
};

const ANCHORS: Record<TerminalId, { x: number; y: number }> = {
  negative: { x: 0, y: 700 },
  positive: { x: 800, y: 800 },
};

const DISCONNECT_DIST = 90;

export default function CableDragModule({
  imgSrc,
  required,
  disconnected,
  onCorrect,
  onWrongAttempt,
  disabled,
}: Props) {
  const [negClamp, setNegClamp] = useState(TERMINALS.negative);
  const [posClamp, setPosClamp] = useState(TERMINALS.positive);

  const draggingRef = useRef<TerminalId | null>(null);
  const lastDraggedRef = useRef<TerminalId | null>(null);

  const requiredTerminal = TERMINALS[required];
  const requiredClamp = required === "negative" ? negClamp : posClamp;

  const isDisconnected = useMemo(() => {
    const dx = requiredClamp.x - requiredTerminal.x;
    const dy = requiredClamp.y - requiredTerminal.y;
    return Math.sqrt(dx * dx + dy * dy) >= DISCONNECT_DIST;
  }, [requiredClamp, requiredTerminal]);

  useEffect(() => {
    if (!disabled && isDisconnected) onCorrect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  const setClamp = (id: TerminalId, p: { x: number; y: number }) => {
    if (id === "negative") setNegClamp(p);
    else setPosClamp(p);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const id = draggingRef.current;
    if (!id) return;

    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const loc = pt.matrixTransform(ctm.inverse());

    const x = Math.max(0, Math.min(VIEW_W, loc.x));
    const y = Math.max(0, Math.min(VIEW_H, loc.y));

    setClamp(id, { x, y });
  };

  const onPointerDown = (id: TerminalId) => {
    if (disabled) return;
    if (disconnected[id]) return;

    lastDraggedRef.current = id;

    if (id !== required) onWrongAttempt();

    draggingRef.current = id;
  };

  const onPointerUp = () => {
    const last = lastDraggedRef.current;
    draggingRef.current = null;

    if (last && last !== required) {
      if (last === "negative") setNegClamp(TERMINALS.negative);
      if (last === "positive") setPosClamp(TERMINALS.positive);
    }

    lastDraggedRef.current = null;
  };

  const negA = ANCHORS.negative;
  const posA = ANCHORS.positive;

  return (
    <div className="cableDrag" data-required={required}>
      <img
        className="cableDrag__img"
        src={imgSrc}
        alt="Battery"
        draggable={false}
      />

      <svg
        className="cableDrag__svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <path
          className="cableDrag__cableNeg"
          d={`M ${negA.x} ${negA.y} C ${negA.x + 80} ${negA.y - 80}, ${negClamp.x - 120} ${negClamp.y + 60}, ${negClamp.x} ${negClamp.y}`}
        />
        <path
          className="cableDrag__cablePos"
          d={`M ${posA.x} ${posA.y} C ${posA.x - 80} ${posA.y - 80}, ${posClamp.x + 120} ${posClamp.y + 60}, ${posClamp.x} ${posClamp.y}`}
        />

        <g
          className="cableDrag__handle"
          data-terminal="negative"
          data-disabled={disabled || disconnected.negative ? "true" : "false"}
          onPointerDown={() => onPointerDown("negative")}
        >
          <circle
            cx={negClamp.x}
            cy={negClamp.y}
            className="cableDrag__clampOuter"
          />
          <circle
            cx={negClamp.x}
            cy={negClamp.y}
            className="cableDrag__clampInner"
          />
        </g>

        <g
          className="cableDrag__handle"
          data-terminal="positive"
          data-disabled={disabled || disconnected.positive ? "true" : "false"}
          onPointerDown={() => onPointerDown("positive")}
        >
          <circle
            cx={posClamp.x}
            cy={posClamp.y}
            className="cableDrag__clampOuter"
          />
          <circle
            cx={posClamp.x}
            cy={posClamp.y}
            className="cableDrag__clampInner"
          />
        </g>

        {isDisconnected && (
          <circle
            cx={requiredTerminal.x}
            cy={requiredTerminal.y}
            r="46"
            className="cableDrag__successRing"
          />
        )}
      </svg>
    </div>
  );
}
