import type { Hotspot, Chapter } from "../types/module.types";

export const hotspots: Hotspot[] = [
  { id: "battery", label: "Battery", xPct: 75, yPct: 55 },
  { id: "engine", label: "Engine", xPct: 45, yPct: 50 },
];

export const chapters: Chapter[] = [
  {
    id: "intro",
    title: "Introduction",
    context: "This module is about the engine bay and what can we find in it.",
    tasks: [
      {
        id: "step1",
        type: "click",
        instruction: "Click on the Battery",
        correctHotspotId: "battery",
        successMessage: "Correct! That is the battery.",
        errorMessage: "That is not the battery. Try again.",
      },
      {
        id: "step2",
        type: "click",
        instruction: "Click on the Engine",
        correctHotspotId: "engine",
        successMessage: "Correct! That is the engine.",
        errorMessage: "That is not the engine. Try again.",
      },
    ],
  },

  {
    id: "safety",
    title: "Safety and preparation",
    context:
      "Before working in the engine bay, you must make the area safe. In this chapter you will answer safety questions about working around the battery and engine components.",
    tasks: [
      {
        id: "safety-q1",
        type: "mcq",
        question:
          "Which of the following should you do before working on a vehicle's battery?",
        options: [
          "Turn off the ignition and remove the key.",
          "Disconnect the negative terminal first.",
          "Wear appropriate eye protection.",
          "Touch both terminals with a metal tool to test voltage.",
        ],
        correctAnswers: [
          "Turn off the ignition and remove the key.",
          "Disconnect the negative terminal first.",
          "Wear appropriate eye protection.",
        ],
        successMessage:
          "Correct. Switch off the ignition, wear protection, and disconnect the negative terminal first.",
        errorMessage:
          "Not quite. Think about ignition status, PPE, and the correct disconnection order.",
      },
      {
        id: "safety-q2",
        type: "mcq",
        question:
          "Why is the negative terminal disconnected first when removing a battery?",
        options: [
          "To reduce the risk of short circuits.",
          "Because the negative cable is always shorter.",
          "To prevent accidental sparking if a tool touches the chassis.",
          "Because it improves battery performance.",
        ],
        correctAnswers: [
          "To reduce the risk of short circuits.",
          "To prevent accidental sparking if a tool touches the chassis.",
        ],
        successMessage:
          "Correct. Disconnecting negative first reduces short-circuit risk.",
        errorMessage: "Incorrect. Think about grounding and short circuits.",
      },
      {
        id: "safety-q3",
        type: "mcq",
        question: "Which hazards are present in an engine bay?",
        options: [
          "Hot surfaces such as the engine block.",
          "Moving components like belts and fans.",
          "Pressurized fluids.",
          "Decorative plastic covers.",
        ],
        correctAnswers: [
          "Hot surfaces such as the engine block.",
          "Moving components like belts and fans.",
          "Pressurized fluids.",
        ],
        successMessage:
          "Correct. Engine bays contain heat, moving parts, and pressurized systems.",
        errorMessage:
          "Not quite. Consider mechanical, thermal, and fluid risks.",
      },
    ],
  },
  {
    id: "battery-removal",
    title: "Battery removal",
    context:
      "To safely remove a battery, disconnect the negative terminal first. This reduces the risk of short circuits. After the negative cable is disconnected, disconnect the positive terminal.",
    tasks: [
      {
        id: "bat-step1",
        type: "click",
        instruction:
          "Disconnect the negative terminal (drag the negative cable off the terminal).",
        correctHotspotId: "negative",
        successMessage: "Well done. The negative terminal is disconnected.",
        errorMessage: "Not quite. Disconnect the negative terminal first.",
      },
      {
        id: "bat-step2",
        type: "click",
        instruction:
          "Disconnect the positive terminal (drag the positive cable off the terminal).",
        correctHotspotId: "positive",
        successMessage: "Well done. The positive terminal is disconnected.",
        errorMessage: "Not quite. Disconnect the positive terminal.",
      },
    ],
  },
];
