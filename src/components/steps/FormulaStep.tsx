interface Props { content: string; }

export function FormulaStep({ content }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-4 text-center">
      <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">공식</div>
      <div className="font-mono text-xl font-bold text-amber-900 bg-amber-100 rounded-lg py-3 px-4 whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
