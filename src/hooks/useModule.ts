import { useEffect, useMemo, useState } from "react";
import { chapters } from "../data/moduleData";

type Status = "idle" | "error" | "success";

export function useModule() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected([]);
  }, [chapterIndex, taskIndex]);

  // ✅ track furthest reached (used to lock step navigation)
  const [maxChapterReached, setMaxChapterReached] = useState(0);
  const [maxTaskReachedByChapter, setMaxTaskReachedByChapter] = useState<
    number[]
  >(() => chapters.map(() => 0));

  const chapter = chapters[chapterIndex];
  const task = chapter.tasks[taskIndex];

  const chapterCount = chapters.length;

  const progressPct = useMemo(() => {
    const total = chapter.tasks.length;
    return Math.round(((taskIndex + 1) / total) * 100);
  }, [chapter.tasks.length, taskIndex]);

  const canNext = useMemo(() => status === "success", [status]);

  function clearFeedback() {
    setStatus("idle");
    setMessage(null);
  }

  function handleHotspotClick(id: string) {
    if (status === "success") return;
    if (task.type !== "click") return;

    if (id === task.correctHotspotId) {
      setStatus("success");
      setMessage(task.successMessage);

      // ✅ unlock current task (so you can click its dot later)
      setMaxTaskReachedByChapter((prev) => {
        const copy = [...prev];
        copy[chapterIndex] = Math.max(copy[chapterIndex] ?? 0, taskIndex);
        return copy;
      });
    } else {
      setStatus("error");
      setMessage(task.errorMessage);
    }
  }

  function next() {
    if (status !== "success") return;

    const isLastTask = taskIndex >= chapter.tasks.length - 1;
    const isLastChapter = chapterIndex >= chapters.length - 1;

    if (!isLastTask) {
      const nextTask = taskIndex + 1;
      setTaskIndex(nextTask);

      // unlock nextTask as reachable
      setMaxTaskReachedByChapter((prev) => {
        const copy = [...prev];
        copy[chapterIndex] = Math.max(copy[chapterIndex] ?? 0, nextTask);
        return copy;
      });
    } else if (!isLastChapter) {
      const nextChapter = chapterIndex + 1;
      setChapterIndex(nextChapter);
      setTaskIndex(0);

      setMaxChapterReached((m) => Math.max(m, nextChapter));
      setMaxTaskReachedByChapter((prev) => {
        const copy = [...prev];
        // ensure array long enough (in case chapters change)
        while (copy.length < chapters.length) copy.push(0);
        copy[nextChapter] = Math.max(copy[nextChapter] ?? 0, 0);
        return copy;
      });
    }

    clearFeedback();
  }

  function reset() {
    setChapterIndex(0);
    setTaskIndex(0);
    setStatus("idle");
    setMessage(null);
    setMaxChapterReached(0);
    setMaxTaskReachedByChapter(chapters.map(() => 0));
  }

  // ---------------------------
  // ✅ CLICK NAVIGATION
  // ---------------------------

  // toggle this if you want "free" navigation:
  const LOCKED_NAV = true;

  function canGoToChapter(target: number) {
    if (!LOCKED_NAV) return target >= 0 && target < chapterCount;
    return target >= 0 && target <= maxChapterReached;
  }

  function canGoToTask(target: number) {
    if (!LOCKED_NAV) return target >= 0 && target < chapter.tasks.length;
    const maxTaskReached = maxTaskReachedByChapter[chapterIndex] ?? 0;
    return target >= 0 && target <= Math.max(maxTaskReached, taskIndex);
  }

  function goToChapter(target: number) {
    if (!canGoToChapter(target)) return;

    setChapterIndex(target);
    setTaskIndex(0);
    clearFeedback();
  }

  function goToTask(target: number) {
    if (!canGoToTask(target)) return;

    setTaskIndex(target);
    clearFeedback();
  }

  function toggleOption(option: string) {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option],
    );
  }

  function submitMcq() {
    if (task.type !== "mcq") return;

    const a = [...selected].sort();
    const b = [...task.correctAnswers].sort();
    const ok = a.length === b.length && a.every((v, i) => v === b[i]);

    if (ok) {
      setStatus("success");
      setMessage(task.successMessage);
    } else {
      setStatus("error");
      setMessage(task.errorMessage);
    }
  }

  return {
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

    // ✅ new exports
    goToChapter,
    goToTask,
    canGoToChapter,
    canGoToTask,

    selected,
    toggleOption,
    submitMcq,
  };
}
