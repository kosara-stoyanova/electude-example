import { useEffect, useMemo, useRef, useState } from "react";

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
  negative: { x: 280, y: 150 }, // blue cap (approx)
  positive: { x: 580, y: 90 }, // red cap (approx)
};

const ANCHORS: Record<TerminalId, { x: number; y: number }> = {
  negative: { x: 0, y: 700 }, // left side area
  positive: { x: 800, y: 800 }, // right side area
};

const DISCONNECT_DIST = 90;

export default function BatteryDragScene({
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

  function setClamp(id: TerminalId, p: { x: number; y: number }) {
    if (id === "negative") setNegClamp(p);
    else setPosClamp(p);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
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
  }

  const lastDraggedRef = useRef<TerminalId | null>(null);
  const wrongTriggeredRef = useRef(false);

  function onPointerDown(id: TerminalId) {
    if (disabled) return;
    if (disconnected[id]) return;

    lastDraggedRef.current = id; // ✅ add this

    if (id !== required) onWrongAttempt();

    draggingRef.current = id;
  }

  function onPointerUp() {
    const last = lastDraggedRef.current;
    draggingRef.current = null;
    wrongTriggeredRef.current = false;

    if (last && last !== required) {
      // snap wrong clamp back to its terminal
      if (last === "negative") setNegClamp(TERMINALS.negative);
      if (last === "positive") setPosClamp(TERMINALS.positive);
    }

    lastDraggedRef.current = null;
  }

  const negA = ANCHORS.negative;
  const posA = ANCHORS.positive;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: VIEW_W }}>
      <img
        src={imgSrc}
        alt="Battery"
        style={{ width: "100%", display: "block" }}
        draggable={false}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Cable from ANCHOR -> CLAMP */}
        <path
          d={`M ${negA.x} ${negA.y} C ${negA.x + 80} ${negA.y - 80}, ${negClamp.x - 120} ${negClamp.y + 60}, ${negClamp.x} ${negClamp.y}`}
          stroke="rgba(7, 10, 15, 0.85)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${posA.x} ${posA.y} C ${posA.x - 80} ${posA.y - 80}, ${posClamp.x + 120} ${posClamp.y + 60}, ${posClamp.x} ${posClamp.y}`}
          stroke="rgba(90,40,40,.85)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Optional: show anchor dots while tuning (remove later) */}
        {/* <circle cx={negA.x} cy={negA.y} r="8" fill="yellow" />
        <circle cx={posA.x} cy={posA.y} r="8" fill="yellow" /> */}

        {/* Draggable CLAMP handles (the end that disconnects) */}
        <g
          onPointerDown={() => onPointerDown("negative")}
          style={{
            cursor: "grab",
          }}
        >
          <circle
            cx={negClamp.x}
            cy={negClamp.y}
            r="18"
            fill={
              required === "negative"
                ? "rgba(255,255,255,.85)"
                : "rgba(255,255,255,.45)"
            }
          />
          <circle
            cx={negClamp.x}
            cy={negClamp.y}
            r="10"
            fill="rgba(23, 23, 24, 0.85)"
          />
        </g>

        <g
          onPointerDown={() => onPointerDown("positive")}
          style={{
            cursor: "grab",
          }}
        >
          <circle
            cx={posClamp.x}
            cy={posClamp.y}
            r="18"
            fill={
              required === "positive"
                ? "rgba(255,255,255,.85)"
                : "rgba(255,255,255,.45)"
            }
          />
          <circle
            cx={posClamp.x}
            cy={posClamp.y}
            r="10"
            fill="rgba(255,90,70,.90)"
          />
        </g>

        {/* Optional: success ring around the terminal that was disconnected */}
        {isDisconnected && (
          <circle
            cx={requiredTerminal.x}
            cy={requiredTerminal.y}
            r="46"
            fill="rgba(75,140,92,0.20)"
            stroke="rgba(75,140,92,0.9)"
            strokeWidth="3"
          />
        )}
      </svg>
    </div>
  );
}
