interface Props { content: string; }

export function ExampleStep({ content }: Props) {
  const lines = content.split('\n').filter(Boolean);
  return (
    <div className="space-y-2 my-4">
      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">예시</div>
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span className="text-emerald-500 font-bold mt-0.5">•</span>
          <p className="text-gray-700 text-sm">{line.replace(/^[-•]\s*/, '')}</p>
        </div>
      ))}
    </div>
  );
}
