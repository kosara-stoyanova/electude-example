import { useLayoutEffect, useState } from "react";

import "./HelpCallout.css";

type Placement = "top" | "right" | "bottom" | "left";

export default function HelpCallout({
  targetRect,
  text,
  placement = "bottom",
}: {
  targetRect: DOMRect | null;
  text: string;
  placement?: Placement;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!targetRect) return;

    const padding = 10;
    const bubbleW = 260;

    let top = 0;
    let left = 0;

    if (placement === "bottom") {
      top = targetRect.bottom + padding;
      left = targetRect.left + targetRect.width / 2 - bubbleW / 2;
    } else if (placement === "top") {
      top = targetRect.top - padding;
      left = targetRect.left + targetRect.width / 2 - bubbleW / 2;
    } else if (placement === "right") {
      top = targetRect.top;
      left = targetRect.right + padding;
    } else if (placement === "left") {
      top = targetRect.top;
      left = targetRect.left - bubbleW - padding;
    }

    // keep on screen
    left = Math.max(12, Math.min(left, window.innerWidth - bubbleW - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - 80));

    setStyle({
      position: "fixed",
      top,
      left,
      width: bubbleW,
      opacity: 1,
      zIndex: 9999,
    });
  }, [targetRect, placement]);

  return (
    <div className="e-callout" style={style}>
      {text}
    </div>
  );
}
