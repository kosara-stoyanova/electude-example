import "./LeftPanel.css";

import type { Task } from "../../types/module.types";
import HotspotsModule from "../../modules/hotspotsModule/HotspotsModule";
import CableDragModule from "../../modules/cableDragModule/CableDragModule";
import type { SvgHotspotDef } from "../../types/hotspot.types";

type TerminalId = "negative" | "positive";

type Props = {
  chapterId: string;
  task: Task;
  status: "idle" | "error" | "success";

  carImg: string;
  batteryImg: string;

  sceneWidth: number;
  sceneHeight: number;
  svgHotspots: SvgHotspotDef[];

  onHotspotSelect: (id: string) => void;

  batterySceneKey: number;
  disconnected: Record<TerminalId, boolean>;
  setDisconnected: React.Dispatch<
    React.SetStateAction<Record<TerminalId, boolean>>
  >;
};

export default function LeftPanel({
  chapterId,
  task,
  status,
  carImg,
  batteryImg,
  sceneWidth,
  sceneHeight,
  svgHotspots,
  onHotspotSelect,
  batterySceneKey,
  disconnected,
  setDisconnected,
}: Props) {
  if (chapterId === "battery-removal") {
    if (task.type !== "click") return <div />;

    const required = task.correctHotspotId as TerminalId;

    return (
      <div className="left-panel__container">
        <CableDragModule
          key={`battery-${batterySceneKey}`}
          imgSrc={batteryImg}
          required={required}
          disconnected={disconnected}
          onCorrect={() => {
            setDisconnected((prev) => ({ ...prev, [required]: true }));
            onHotspotSelect(required);
          }}
          onWrongAttempt={() => {
            const wrong = required === "negative" ? "positive" : "negative";
            onHotspotSelect(wrong);
          }}
          disabled={status === "success"}
        />
      </div>
    );
  }

  return (
    <div className="left-panel__container">
      <HotspotsModule
        imgSrc={carImg}
        imgAlt="Engine bay"
        sceneWidth={sceneWidth}
        sceneHeight={sceneHeight}
        hotspots={task.type === "mcq" ? [] : svgHotspots}
        onSelect={onHotspotSelect}
        debug={false}
        highlightId={
          task.type === "click" && status === "success"
            ? task.correctHotspotId
            : undefined
        }
        disabled={false}
      />
    </div>
  );
}
