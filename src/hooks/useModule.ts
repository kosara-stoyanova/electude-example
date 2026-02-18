import { useEffect, useMemo, useState } from "react";
import { chapters } from "../data/moduleData";

/** UI feedback state after an action */
type Status = "idle" | "error" | "success";

/**
 * Module player hook:
 * - Tracks chapter/task position
 * - Validates click tasks + MCQ tasks
 * - Controls "Next" availability
 * - Supports step navigation (locked/unlocked)
 */
export const useModule = () => {
  // ---------------------------
  // Core progression state
  // ---------------------------
  const [chapterIndex, setChapterIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);

  // ---------------------------
  // Feedback state (banner)
  // ---------------------------
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // ---------------------------
  // MCQ state (selected options)
  // ---------------------------
  const [selected, setSelected] = useState<string[]>([]);

  // ---------------------------
  // Locked navigation state
  // ---------------------------
  const [maxChapterReached, setMaxChapterReached] = useState(0);
  const [maxTaskReachedByChapter, setMaxTaskReachedByChapter] = useState<
    number[]
  >(() => chapters.map(() => 0));

  // ---------------------------
  // Derived current objects
  // ---------------------------
  const chapter = chapters[chapterIndex];
  const task = chapter.tasks[taskIndex];
  const chapterCount = chapters.length;

  // ---------------------------
  // Derived UI flags
  // ---------------------------

  /** Progress bar: percent within current chapter tasks */
  const progressPct = useMemo(() => {
    const total = chapter.tasks.length;
    return Math.round(((taskIndex + 1) / total) * 100);
  }, [chapter.tasks.length, taskIndex]);

  /** Whether user is allowed to go to the next step */
  const canNext = useMemo(() => status === "success", [status]);

  /** If true, user can only click steps they've reached */
  const LOCKED_NAV = true;

  // ---------------------------
  // Effects
  // ---------------------------

  /** Clears MCQ selection when moving to a different task/chapter */
  useEffect(() => {
    setSelected([]);
  }, [chapterIndex, taskIndex]);

  useEffect(() => {
    if (task.type === "done") {
      setStatus("success");
      setMessage(null);
    }
  }, [task.type]);

  // ---------------------------
  // Small helpers
  // ---------------------------

  /** Clears banner feedback (returns to idle state) */
  const clearFeedback = () => {
    setStatus("idle");
    setMessage(null);
  };

  /** Marks the current task as "reached" so step buttons can be clicked */
  const unlockCurrentTask = () => {
    setMaxTaskReachedByChapter((prev) => {
      const copy = [...prev];
      copy[chapterIndex] = Math.max(copy[chapterIndex] ?? 0, taskIndex);
      return copy;
    });
  };

  /** Marks a given task index as "reached" for the current chapter */
  const unlockTaskIndex = (idx: number) => {
    setMaxTaskReachedByChapter((prev) => {
      const copy = [...prev];
      copy[chapterIndex] = Math.max(copy[chapterIndex] ?? 0, idx);
      return copy;
    });
  };

  /** Marks a chapter as reached and ensures its task reach array exists */
  const unlockChapterIndex = (idx: number) => {
    setMaxChapterReached((m) => Math.max(m, idx));
    setMaxTaskReachedByChapter((prev) => {
      const copy = [...prev];
      while (copy.length < chapters.length) copy.push(0);
      copy[idx] = Math.max(copy[idx] ?? 0, 0);
      return copy;
    });
  };

  // ---------------------------
  // Click task logic
  // ---------------------------

  /**
   * Validates a click interaction against the current click task.
   * - Ignores if task isn't click-type
   * - Sets success/error banner
   * - Unlocks the current task when correct
   */
  const handleHotspotClick = (id: string) => {
    if (status === "success") return;
    if (task.type !== "click") return;

    if (id === task.correctHotspotId) {
      setStatus("success");
      setMessage(task.successMessage);
      unlockCurrentTask();
    } else {
      setStatus("error");
      setMessage(task.errorMessage);
    }
  };

  // ---------------------------
  // MCQ logic
  // ---------------------------

  /**
   * Toggles an MCQ option in the local selection array.
   * - Adds if not selected
   * - Removes if selected
   */
  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option],
    );
  };

  /**
   * Submits the current MCQ selection.
   * - Checks equality of sets (order independent)
   * - Sets success/error banner
   */
  const submitMcq = () => {
    if (task.type !== "mcq") return;

    const a = [...selected].sort();
    const b = [...task.correctAnswers].sort();
    const ok = a.length === b.length && a.every((v, i) => v === b[i]);

    if (ok) {
      setStatus("success");
      setMessage(task.successMessage);
      unlockCurrentTask();
    } else {
      setStatus("error");
      setMessage(task.errorMessage);
    }
  };

  // ---------------------------
  // Progression logic
  // ---------------------------

  /**
   * Advances to next task/chapter.
   * - Only works when current task is successfully completed
   * - Unlocks the next task/chapter for step navigation
   */
  const next = () => {
    if (status !== "success") return;

    const isLastTask = taskIndex >= chapter.tasks.length - 1;
    const isLastChapter = chapterIndex >= chapters.length - 1;

    if (!isLastTask) {
      const nextTask = taskIndex + 1;
      setTaskIndex(nextTask);
      unlockTaskIndex(nextTask);
    } else if (!isLastChapter) {
      const nextChapter = chapterIndex + 1;
      setChapterIndex(nextChapter);
      setTaskIndex(0);
      unlockChapterIndex(nextChapter);
    }

    clearFeedback();
  };

  /**
   * Resets the module player back to the start.
   * - Also resets all unlocking state and banner state
   */
  const reset = () => {
    setChapterIndex(0);
    setTaskIndex(0);
    setStatus("idle");
    setMessage(null);
    setSelected([]);
    setMaxChapterReached(0);
    setMaxTaskReachedByChapter(chapters.map(() => 0));
  };

  // ---------------------------
  // Step navigation logic
  // ---------------------------

  /**
   * Returns whether a chapter step is clickable.
   * Locked mode: only chapters up to maxChapterReached.
   */
  const canGoToChapter = (target: number) => {
    if (!LOCKED_NAV) return target >= 0 && target < chapterCount;
    return target >= 0 && target <= maxChapterReached;
  };

  /**
   * Returns whether a task step is clickable (within current chapter).
   * Locked mode: tasks up to maxTaskReached OR current task index.
   */
  const canGoToTask = (target: number) => {
    if (!LOCKED_NAV) return target >= 0 && target < chapter.tasks.length;
    const maxTaskReached = maxTaskReachedByChapter[chapterIndex] ?? 0;
    return target >= 0 && target <= Math.max(maxTaskReached, taskIndex);
  };

  /**
   * Jumps to a chapter and resets task index to 0.
   * Clears banner feedback.
   */
  const goToChapter = (target: number) => {
    if (!canGoToChapter(target)) return;
    setChapterIndex(target);
    setTaskIndex(0);
    clearFeedback();
  };

  /**
   * Jumps to a task within the current chapter.
   * Clears banner feedback.
   */
  const goToTask = (target: number) => {
    if (!canGoToTask(target)) return;
    setTaskIndex(target);
    clearFeedback();
  };

  return {
    // location / counts
    chapterCount,
    chapter,
    chapterIndex,
    task,
    taskIndex,

    // feedback
    status,
    message,

    // click tasks
    handleHotspotClick,

    // mcq
    selected,
    toggleOption,
    submitMcq,

    // progression
    next,
    reset,
    canNext,
    progressPct,

    // navigation
    goToChapter,
    goToTask,
    canGoToChapter,
    canGoToTask,
  };
};
