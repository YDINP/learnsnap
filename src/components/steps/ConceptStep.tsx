interface Props { content: string; }

export function ConceptStep({ content }: Props) {
  return (
    <div className="bg-blue-950/40 border-l-4 border-blue-500 rounded-r-xl p-5 my-4">
      <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">핵심 개념</div>
      <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
