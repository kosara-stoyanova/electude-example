import { useLayoutEffect, useState } from "react";
import HelpCallout from "../helpCallout/HelpCallout";
import "./HelpOverlay.css";

type Props = {
  open: boolean;
  onClose: () => void;

  helpBtnRef: React.RefObject<HTMLElement | null>;
  backBtnRef: React.RefObject<HTMLElement | null>;
  prevNextRef: React.RefObject<HTMLElement | null>;
  chapterDotsRef: React.RefObject<HTMLElement | null>;
  taskDotsRef: React.RefObject<HTMLElement | null>;
};

type Rect = DOMRect | null;

const getRect = (ref: React.RefObject<HTMLElement | null>): Rect =>
  ref.current ? ref.current.getBoundingClientRect() : null;

export default function HelpOverlay({
  open,
  onClose,
  helpBtnRef,
  backBtnRef,
  prevNextRef,
  chapterDotsRef,
  taskDotsRef,
}: Props) {
  const [helpBtnRect, setHelpBtnRect] = useState<Rect>(null);
  const [backBtnRect, setBackBtnRect] = useState<Rect>(null);
  const [prevNextRect, setPrevNextRect] = useState<Rect>(null);
  const [chapterDotsRect, setChapterDotsRect] = useState<Rect>(null);
  const [taskDotsRect, setTaskDotsRect] = useState<Rect>(null);

  /** Measure all target rects (on open, resize, scroll) */
  useLayoutEffect(() => {
    if (!open) return;

    const measure = () => {
      setHelpBtnRect(getRect(helpBtnRef));
      setBackBtnRect(getRect(backBtnRef));
      setPrevNextRect(getRect(prevNextRef));
      setChapterDotsRect(getRect(chapterDotsRef));
      setTaskDotsRect(getRect(taskDotsRef));
    };

    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, helpBtnRef, backBtnRef, prevNextRef, chapterDotsRef, taskDotsRef]);

  if (!open) return null;

  return (
    <>
      <div className="helpOverlay" onClick={onClose} />

      <HelpCallout
        targetRect={helpBtnRect}
        placement="left"
        text="Open or close help tips."
      />

      <HelpCallout
        targetRect={prevNextRect}
        placement="left"
        text="Navigate to previous or next question."
      />

      <HelpCallout
        targetRect={chapterDotsRect}
        placement="left"
        text="Navigate to any chapter."
      />

      <HelpCallout
        targetRect={taskDotsRect}
        placement="left"
        text="Navigate to any task."
      />

      <HelpCallout
        targetRect={backBtnRect}
        placement="right"
        text="Exit and return to previous page."
      />
    </>
  );
}
