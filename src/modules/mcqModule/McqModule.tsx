import "./McqModule.css";

type Props = {
  question: string;
  options: string[];
  selected: string[];
  onToggleOption: (option: string) => void;
  onSubmit: () => void;
  disabled?: boolean; // e.g. status === "success"
};

export default function McqModule({
  question,
  options,
  selected,
  onToggleOption,
  onSubmit,
  disabled = false,
}: Props) {
  return (
    <div className="mcq">
      <div className="mcq__question">{question}</div>

      <div className="mcq__options">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={`mcq__opt ${checked ? "is-checked" : ""}`}
              onClick={() => onToggleOption(opt)}
              disabled={disabled}
            >
              <span className="mcq__box">{checked ? "✓" : ""}</span>
              <span className="mcq__text">{opt}</span>
            </button>
          );
        })}
      </div>

      <button
        className="mcq__check"
        onClick={onSubmit}
        disabled={disabled || selected.length === 0}
        type="button"
      >
        Check
      </button>
    </div>
  );
}
