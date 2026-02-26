import { INSTRUMENTS } from "@/lib/instruments";

type Props = {
  selected: string[];
  onChange: (updated: string[]) => void;
};

export default function InstrumentPicker({ selected, onChange }: Props) {
  const toggle = (instrument: string) => {
    onChange(
      selected.includes(instrument)
        ? selected.filter((i) => i !== instrument)
        : [...selected, instrument]
    );
  };

  return (
    <div>
      <p
        className="text-sm font-semibold mb-3"
        style={{ color: "#5a7a50" }}
      >
        Instruments you teach
        {selected.length > 0 && (
          <span className="ml-2" style={{ color: "#b85c3a" }}>
            ({selected.length} selected)
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {INSTRUMENTS.map((instrument) => {
          const isSelected = selected.includes(instrument);
          return (
            <button
              key={instrument}
              type="button"
              onClick={() => toggle(instrument)}
              className="px-3 py-1.5 rounded-full text-sm transition-all duration-150"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #b85c3a, #d4784e)"
                  : "rgba(255,255,255,0.8)",
                color: isSelected ? "#fff" : "#3d5535",
                border: isSelected
                  ? "1px solid transparent"
                  : "1px solid rgba(90,120,80,0.25)",
                boxShadow: isSelected
                  ? "0 2px 8px rgba(184,92,58,0.25)"
                  : "none",
              }}
            >
              {instrument}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs mt-2" style={{ color: "#b85c3a" }}>
          Please select at least one instrument
        </p>
      )}
    </div>
  );
}