import { useEffect, useRef, useState } from "react";
import { useModule } from "./hooks/useModule";

import car from "../public/car.jpg";
import batteryImg from "../public/car-battery.jpg";

import LayoutShell from "./components/layoutShell/LayoutShell";
import LeftPanel from "./components/leftPanel/LeftPanel";
import RightPanel from "./components/rightPanel/RightPanel";
import HelpOverlay from "./components/helpOverlay/HelpOverlay";

import { SCENE, svgHotspots } from "./data/hotspotsSvg";
import "./App.css";

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

  // help overlay
  const [helpOpen, setHelpOpen] = useState(false);
  const helpBtnRef = useRef<HTMLButtonElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const prevNextRef = useRef<HTMLDivElement>(null);
  const chapterDotsRef = useRef<HTMLDivElement>(null);
  const taskDotsRef = useRef<HTMLDivElement>(null);

  // battery module reset
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

  const onResetAll = () => {
    reset();
    setDisconnected({ negative: false, positive: false });
    setBatterySceneKey((k) => k + 1);
  };

  return (
    <>
      <LayoutShell
        title="Engine bay basics and safety"
        helpBtnRef={helpBtnRef}
        backBtnRef={backBtnRef}
        onHelpClick={() => setHelpOpen((v) => !v)}
        left={
          <LeftPanel
            chapterId={chapter.id}
            task={task}
            status={status}
            carImg={car}
            batteryImg={batteryImg}
            sceneWidth={SCENE.w}
            sceneHeight={SCENE.h}
            svgHotspots={svgHotspots}
            onHotspotSelect={handleHotspotClick}
            batterySceneKey={batterySceneKey}
            disconnected={disconnected}
            setDisconnected={setDisconnected}
          />
        }
        right={
          <RightPanel
            chapterTitle={chapter.title}
            chapterContext={chapter.context}
            chapterCount={chapterCount}
            chapterIndex={chapterIndex}
            onSelectChapter={goToChapter}
            canSelectChapter={canGoToChapter}
            taskCount={chapter.tasks.length}
            taskIndex={taskIndex}
            onSelectTask={goToTask}
            canSelectTask={canGoToTask}
            progressPct={progressPct}
            task={task}
            selected={selected}
            onToggleOption={toggleOption}
            onSubmitMcq={submitMcq}
            status={status}
            message={message}
            canNext={canNext}
            onNext={next}
            onReset={onResetAll}
            prevNextRef={prevNextRef}
            chapterDotsRef={chapterDotsRef}
            taskDotsRef={taskDotsRef}
          />
        }
        footer={<>© Kosara's demo — last modification: 2026-02-18</>}
      />

      {helpOpen && (
        <HelpOverlay
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          helpBtnRef={helpBtnRef}
          backBtnRef={backBtnRef}
          prevNextRef={prevNextRef}
          chapterDotsRef={chapterDotsRef}
          taskDotsRef={taskDotsRef}
        />
      )}
    </>
  );
}
