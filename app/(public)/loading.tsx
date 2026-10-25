export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[300] pointer-events-none">
      <div className="h-0.5 w-full bg-blue-600/20 overflow-hidden">
        <div className="h-full w-1/3 bg-blue-600 animate-[loading-bar_0.8s_ease-in-out_infinite]" />
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
