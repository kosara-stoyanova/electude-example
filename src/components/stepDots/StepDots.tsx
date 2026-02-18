import "./StepDots.css";

type Props = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  canSelect?: (index: number) => boolean;
  variant?: "chapters" | "tasks";
  ariaLabel: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function StepDots({
  count,
  activeIndex,
  onSelect,
  canSelect,
  variant = "tasks",
  ariaLabel,
  containerRef,
}: Props) {
  return (
    <div
      className={`e-steps e-steps--${variant}`}
      aria-label={ariaLabel}
      ref={containerRef}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;

        const cls = isActive
          ? "e-stepdot e-stepdot--active"
          : isDone
            ? "e-stepdot e-stepdot--done"
            : "e-stepdot";

        const disabled = canSelect ? !canSelect(i) : false;

        return (
          <button
            key={i}
            type="button"
            className={cls}
            onClick={() => onSelect(i)}
            disabled={disabled}
            title={`${ariaLabel} ${i + 1}`}
          >
            {isActive ? i + 1 : null}
          </button>
        );
      })}
    </div>
  );
}
