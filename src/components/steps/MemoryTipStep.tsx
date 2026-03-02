interface Props { content: string; }

export function MemoryTipStep({ content }: Props) {
  return (
    <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 my-4 flex gap-3">
      <span className="text-2xl">💡</span>
      <div>
        <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">암기 팁</div>
        <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
