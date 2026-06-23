// src/components/quiz/ProgressBar.tsx

type Props = {
  progress?: number;
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-shell">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
      <div className="progress-label">
        <span className="cur">{current}</span>/{total}
      </div>
    </div>
  );
}
