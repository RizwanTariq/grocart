type DividerProps = { text?: string };

function Divider({ text }: DividerProps) {
  return (
    <div className="w-full flex items-center gap-2 text-gray-400 text-sm mt-2">
      <span className="flex-1 h-px bg-gray-200"></span>
      {text && text}
      <span className="flex-1 h-px bg-gray-200"></span>
    </div>
  );
}

export default Divider;
