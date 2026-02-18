import "./RightPanel.css";

import type { Task } from "../../types/module.types";
import StepDots from "../stepDots/StepDots";
import McqModule from "../../modules/mcqModule/McqModule";

type Props = {
  chapterTitle: string;
  chapterContext: string;

  chapterCount: number;
  chapterIndex: number;
  onSelectChapter: (i: number) => void;
  canSelectChapter: (i: number) => boolean;

  taskCount: number;
  taskIndex: number;
  onSelectTask: (i: number) => void;
  canSelectTask: (i: number) => boolean;

  progressPct: number;

  task: Task;

  selected: string[];
  onToggleOption: (opt: string) => void;
  onSubmitMcq: () => void;

  status: "idle" | "error" | "success";
  message: string | null;
  canNext: boolean;
  onNext: () => void;
  onReset: () => void;

  prevNextRef: React.RefObject<HTMLDivElement | null>;
  chapterDotsRef: React.RefObject<HTMLDivElement | null>;
  taskDotsRef: React.RefObject<HTMLDivElement | null>;
};

export default function RightPanel({
  chapterTitle,
  chapterContext,
  chapterCount,
  chapterIndex,
  onSelectChapter,
  canSelectChapter,
  taskCount,
  taskIndex,
  onSelectTask,
  canSelectTask,
  progressPct,
  task,
  selected,
  onToggleOption,
  onSubmitMcq,
  status,
  message,
  canNext,
  onNext,
  onReset,
  prevNextRef,
  chapterDotsRef,
  taskDotsRef,
}: Props) {
  return (
    <div
      className="right-panel"
      style={
        {
          "--pct": `${progressPct}%`,
        } as React.CSSProperties
      }
    >
      <div className="e-progress">
        <div className="e-progress__bar">
          <div className="e-progress__fill right-panel__progressFill" />
        </div>
      </div>

      <StepDots
        count={chapterCount}
        activeIndex={chapterIndex}
        onSelect={onSelectChapter}
        canSelect={canSelectChapter}
        variant="chapters"
        ariaLabel="Chapter"
        containerRef={chapterDotsRef}
      />

      <div className="e-h2">{chapterTitle}</div>
      <p className="e-p">{chapterContext}</p>

      <div className="e-card">
        <div className="e-card__row">
          <StepDots
            count={taskCount}
            activeIndex={taskIndex}
            onSelect={onSelectTask}
            canSelect={canSelectTask}
            variant="tasks"
            ariaLabel="Task"
            containerRef={taskDotsRef}
          />
        </div>

        {task.type === "mcq" ? (
          <McqModule
            question={task.question}
            options={task.options}
            selected={selected}
            onToggleOption={onToggleOption}
            onSubmit={onSubmitMcq}
            disabled={status === "success"}
          />
        ) : (
          <div className="e-p right-panel__instruction">{task.instruction}</div>
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
        <button className="e-navbtn" onClick={onReset} aria-label="Reset">
          ↺
        </button>
        <button className="e-navbtn" disabled aria-label="Back">
          ‹
        </button>
        <button
          className="e-navbtn"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}
