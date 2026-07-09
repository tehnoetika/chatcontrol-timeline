export function Footer({ updated }: { updated: string }) {
  return (
    <footer className="mt-16 border-t border-white/5 pt-8 pb-16 text-sm text-slate-400">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="max-w-md space-y-2">
          <a
            href="https://domovina.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-extrabold tracking-brand text-slate-200 hover:text-white"
          >
            DOMOVINA<span className="text-flag-red">.AI</span>
          </a>
          <p className="leading-relaxed">
            Otvoreni, kronološki jedinstveni izvor istine o EU regulativi{" "}
            <strong className="text-slate-200">Chat Control</strong>. Objedinjuje hrvatski medijski
            prostor, službene EU izvore i javne objave — radi transparentnosti.
          </p>
          <p className="text-xs text-slate-500">
            Dio mreže{" "}
            <a href="https://domovina.ai" className="underline hover:text-slate-300"
               target="_blank" rel="noopener noreferrer">
              DOMOVINA
            </a>{" "}
            — otvoreni hrvatski podcast / podatkovni / AI ekosustav.
          </p>
        </div>

        <div className="text-xs space-y-1 sm:text-right">
          <p>
            Metodologija: WebSearch discovery + Firecrawl ekstrakcija + AI klasifikacija.
          </p>
          <p>Svaki događaj vodi na primarni izvor. Doprinosi i ispravci dobrodošli.</p>
          <p className="text-slate-500">
            Ažurirano: <time className="tabular-nums">{updated}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}
