export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 bg-zinc-900/50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h4 className="mb-1 text-lg font-bold text-zinc-50">CineMesh</h4>
              <p className="text-sm text-zinc-500">
                A Modern Film Discovery Experience
              </p>
            </div>
            <p className="text-sm text-zinc-600">
              © 2026 CineMesh.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
