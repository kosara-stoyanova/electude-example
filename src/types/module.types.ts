export type Hotspot = {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
};

export type ClickTask = {
  id: string;
  type: "click";
  instruction: string;
  correctHotspotId: string;
  successMessage: string;
  errorMessage: string;
};

export type McqTask = {
  id: string;
  type: "mcq";
  question: string;
  options: string[];
  correctAnswers: string[];
  successMessage: string;
  errorMessage: string;
};

export type DoneTask = {
  id: string;
  type: "done";
  title: string;
  body: string;
};

export type Task = ClickTask | McqTask | DoneTask;

export type Chapter = {
  id: string;
  title: string;
  context: string;
  tasks: Task[];
};
