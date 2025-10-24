export function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Soft color glows */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(168,85,247,0.1),transparent_60%)]" />
      </div>

      {/* Mesh grid */}
      <div className="absolute inset-0 opacity-25 mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
      </div>

      {/* Gradient fades top + bottom for smoothness */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
}
