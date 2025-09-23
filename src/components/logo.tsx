export default function Logo() {
  return (
    <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-xl">e</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-cyan-400 rounded-full bg-white"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full"></div>
    </div>
  );
}
