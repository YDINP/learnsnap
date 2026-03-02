interface Props { content: string; }

export function MemoryTipStep({ content }: Props) {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 my-4 flex gap-3">
      <span className="text-2xl">💡</span>
      <div>
        <div className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">암기 팁</div>
        <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
