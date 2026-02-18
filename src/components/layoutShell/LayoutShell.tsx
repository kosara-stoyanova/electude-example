import type { ReactNode } from "react";
import "./LayoutShell.css";

export default function LayoutShell({
  title,
  left,
  right,
  footer,
  onHelpClick,
  helpBtnRef,
  backBtnRef,
}: {
  title: string;
  left: ReactNode;
  right: ReactNode;
  footer?: ReactNode;
  onHelpClick?: () => void;
  helpBtnRef?: React.RefObject<HTMLButtonElement | null>;
  backBtnRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="e-page">
      <header className="e-topbar">
        <div className="e-topbar__left">
          <button ref={backBtnRef} className="e-iconbtn" aria-label="Back">
            ←
          </button>
          <div className="e-title">{title}</div>
        </div>

        <div className="e-topbar__right">
          <div className="e-brand">electude example</div>
          <button
            ref={helpBtnRef}
            className="e-iconbtn"
            aria-label="Help"
            onClick={onHelpClick}
          >
            ?
          </button>
        </div>
      </header>

      <div className="e-body">
        <section className="e-scene">{left}</section>
        <aside className="e-panel">{right}</aside>
      </div>

      {footer ? <footer className="e-footer">{footer}</footer> : null}
    </div>
  );
}
