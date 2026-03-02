interface Props { content: string; }

export function SummaryStep({ content }: Props) {
  const points = content.split('\n').filter(Boolean);
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-5 my-4">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">핵심 정리</div>
      <ol className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="text-indigo-400 font-bold">{i + 1}.</span>
            <span>{p.replace(/^\d+\.\s*/, '')}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
