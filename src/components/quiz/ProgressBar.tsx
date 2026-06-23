// src/components/quiz/ProgressBar.tsx

type Props = {
  progress: number;
  current: number;
  total: number;
};

export function ProgressBar({ progress, current, total }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[#eef0f3] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FFA300] to-[#cc8200] transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-[#4a5058] whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
}
