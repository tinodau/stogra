function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="border-b border-border">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <a href="/" className="font-serif text-xl font-semibold">
              Stogra
            </a>
            <div className="hidden gap-6 md:flex">
              <a href="/markets" className="text-muted-foreground hover:text-foreground">
                Markets
              </a>
              <a href="/sectors" className="text-muted-foreground hover:text-foreground">
                Sectors
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle placeholder */}
            <button
              className="rounded-md p-2 hover:bg-muted"
              aria-label="Toggle theme"
            >
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Stock Graphic
          </h1>
          <p className="mt-4 text-center text-muted-foreground md:text-lg">
            Professional US market monitoring with editorial precision.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
