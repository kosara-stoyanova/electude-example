type Props = {
  xPct: number;
  yPct: number;
  onClick: () => void;
};

export default function Hotspot({ xPct, yPct, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
        width: 28,
        height: 28,
        borderRadius: "999px",
        background: "rgba(59,130,246,0.25)",
        border: "2px solid rgba(59,130,246,0.9)",
        cursor: "pointer",
      }}
    />
  );
}
