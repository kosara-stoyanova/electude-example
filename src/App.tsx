import { useModule } from "./hooks/useModule";
import car from "./assets/car.jpg";
import batteryImg from "./assets/car-battery.jpg";

import LayoutShell from "./components/layoutShell/LayoutShell";

import "./App.css";
import SceneWithHotspots from "./components/scene/SceneWithHotspots";
import { SCENE, svgHotspots } from "./data/hotspotsSvg";
import { useEffect, useMemo, useRef, useState } from "react";
import HelpCallout from "./components/helpCallout/HelpCallout";
import BatteryDragScene from "./components/scene/BatteryDragScene";

type TerminalId = "negative" | "positive";

export default function App() {
  const {
    chapterCount,
    chapter,
    chapterIndex,
    task,
    taskIndex,
    status,
    message,
    handleHotspotClick,
    next,
    reset,
    canNext,
    progressPct,
    goToChapter,
    goToTask,
    canGoToChapter,
    canGoToTask,
    selected,
    toggleOption,
    submitMcq,
  } = useModule();

  const [helpOpen, setHelpOpen] = useState(false);
  const helpBtnRef = useRef<HTMLButtonElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const prevNextRef = useRef<HTMLDivElement>(null);
  const chapterCountRef = useRef<HTMLDivElement>(null);
  const taskCountRef = useRef<HTMLDivElement>(null);

  const helpBtnRect = useMemo(
    () => helpBtnRef.current?.getBoundingClientRect() ?? null,
    [helpOpen],
  );
  const backBtnRect = useMemo(
    () => backBtnRef.current?.getBoundingClientRect() ?? null,
    [helpOpen],
  );
  const prevNextRect = useMemo(
    () => prevNextRef.current?.getBoundingClientRect() ?? null,
    [helpOpen],
  );
  const chapterCountRect = useMemo(
    () => chapterCountRef.current?.getBoundingClientRect() ?? null,
    [helpOpen],
  );
  const taskCountRect = useMemo(
    () => taskCountRef.current?.getBoundingClientRect() ?? null,
    [helpOpen],
  );

  const [batterySceneKey, setBatterySceneKey] = useState(0);

  const [disconnected, setDisconnected] = useState<Record<TerminalId, boolean>>(
    {
      negative: false,
      positive: false,
    },
  );

  useEffect(() => {
    if (chapter.id !== "battery-removal") return;
    setDisconnected({ negative: false, positive: false });
  }, [chapter.id]);

  return (
    <>
      <LayoutShell
        title="Engine bay basics and safety"
        helpBtnRef={helpBtnRef}
        backBtnRef={backBtnRef}
        onHelpClick={() => setHelpOpen((v) => !v)}
        left={
          chapter.id === "battery-removal" ? (
            <div style={{ width: "min(1100px, 96%)" }}>
              {chapter.id === "battery-removal" && task.type === "click" ? (
                <BatteryDragScene
                  key={`battery-${batterySceneKey}`}
                  imgSrc={batteryImg}
                  required={task.correctHotspotId as "negative" | "positive"}
                  disconnected={disconnected}
                  onCorrect={() => {
                    const t = task.correctHotspotId as "negative" | "positive";
                    setDisconnected((prev) => ({ ...prev, [t]: true }));
                    handleHotspotClick(t);
                  }}
                  onWrongAttempt={() => {
                    const wrong =
                      task.correctHotspotId === "negative"
                        ? "positive"
                        : "negative";
                    handleHotspotClick(wrong);
                  }}
                  disabled={status === "success"}
                />
              ) : (
                <div />
              )}
            </div>
          ) : (
            <div style={{ width: "min(1100px, 96%)" }}>
              <SceneWithHotspots
                imgSrc={car}
                imgAlt="Engine bay"
                sceneWidth={SCENE.w}
                sceneHeight={SCENE.h}
                hotspots={task.type === "mcq" ? [] : svgHotspots}
                onSelect={handleHotspotClick}
                debug={false}
                highlightId={
                  task.type === "click" && status === "success"
                    ? task.correctHotspotId
                    : undefined
                }
                disabled={false}
              />
            </div>
          )
        }
        right={
          <>
            <div className="e-progress">
              <div className="e-progress__bar">
                <div
                  className="e-progress__fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div
              className="e-steps e-steps--chapters"
              aria-label="Chapters"
              ref={chapterCountRef}
            >
              {Array.from({ length: chapterCount }).map((_, i) => {
                const isActive = i === chapterIndex;
                const isDone = i < chapterIndex;

                const cls = isActive
                  ? "e-stepdot e-stepdot--active"
                  : isDone
                    ? "e-stepdot e-stepdot--done"
                    : "e-stepdot";

                return (
                  <button
                    key={i}
                    type="button"
                    className={cls}
                    onClick={() => goToChapter(i)}
                    disabled={!canGoToChapter(i)}
                    title={`Chapter ${i + 1}`}
                  >
                    {isActive ? i + 1 : null}
                  </button>
                );
              })}
            </div>

            <div className="e-h2">{chapter.title}</div>
            <p className="e-p">{chapter.context}</p>

            <div className="e-card">
              <div className="e-card__row">
                <div
                  className="e-steps e-steps--tasks"
                  aria-label="Tasks"
                  ref={taskCountRef}
                >
                  {chapter.tasks.map((_, i) => {
                    const isActive = i === taskIndex;
                    const isDone = i < taskIndex;

                    const cls = isActive
                      ? "e-stepdot e-stepdot--active"
                      : isDone
                        ? "e-stepdot e-stepdot--done"
                        : "e-stepdot";

                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls}
                        onClick={() => goToTask(i)}
                        disabled={!canGoToTask(i)}
                        title={`Task ${i + 1}`}
                      >
                        {isActive ? i + 1 : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {task.type === "mcq" ? (
                <>
                  <div className="e-p" style={{ margin: "10px 0 12px" }}>
                    {task.question}
                  </div>

                  <div className="e-mcq">
                    {task.options.map((opt) => {
                      const checked = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          className={`e-mcq__opt ${checked ? "is-checked" : ""}`}
                          onClick={() => toggleOption(opt)}
                          disabled={status === "success"}
                        >
                          <span className="e-mcq__box">
                            {checked ? "✓" : ""}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="e-checkbtn"
                    onClick={submitMcq}
                    disabled={selected.length === 0 || status === "success"}
                  >
                    Check
                  </button>
                </>
              ) : (
                <div className="e-p" style={{ margin: 0 }}>
                  {task.instruction}
                </div>
              )}
            </div>

            {status === "success" && (
              <div className="e-banner e-banner--success">
                <p className="e-banner__title">Well done.</p>
                <p className="e-banner__text">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="e-banner e-banner--error">
                <p className="e-banner__title">Try again.</p>
                <p className="e-banner__text">{message}</p>
              </div>
            )}

            <div className="e-nav" ref={prevNextRef}>
              <button
                className="e-navbtn"
                onClick={() => {
                  reset(); // your module reset
                  setDisconnected({ negative: false, positive: false }); // reset chapter cable state
                  setBatterySceneKey((k) => k + 1); // ✅ remount BatteryDragScene -> clamps reset
                }}
                aria-label="Reset"
              >
                ↺
              </button>
              <button className="e-navbtn" disabled aria-label="Back">
                ‹
              </button>
              <button
                className="e-navbtn"
                onClick={next}
                disabled={!canNext}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </>
        }
        footer={<>© Kosara's demo — last modification: 2026-02-17</>}
      />

      {helpOpen && (
        <>
          <div className="e-help-overlay" onClick={() => setHelpOpen(false)} />

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
            targetRect={chapterCountRect}
            placement="left"
            text="Navigate to any chapter."
          />

          <HelpCallout
            targetRect={taskCountRect}
            placement="left"
            text="Navigate to any task."
          />

          <HelpCallout
            targetRect={backBtnRect}
            placement="right"
            text="Exit and return to previous page."
          />
        </>
      )}
    </>
  );
}
