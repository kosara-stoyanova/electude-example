import "./Hotspot.css";

type Props = {
  xPct: number;
  yPct: number;
  onClick: () => void;
};

export default function Hotspot({ xPct, yPct, onClick }: Props) {
  return (
    <button
      className="hotspot"
      onClick={onClick}
      style={
        {
          "--x": `${xPct}%`,
          "--y": `${yPct}%`,
        } as React.CSSProperties
      }
    />
  );
}
