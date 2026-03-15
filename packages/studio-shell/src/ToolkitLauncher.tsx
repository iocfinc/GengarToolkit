'use client';

import Link from 'next/link';
import type { ToolkitDefinition } from './types';

export function ToolkitLauncher({
  title,
  subtitle,
  toolkits
}: {
  title: string;
  subtitle: string;
  toolkits: ToolkitDefinition[];
}) {
  return (
    <main className="min-h-screen px-4 py-6 text-fog md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col gap-6 rounded-[32px] border border-white/8 bg-white/[0.03] p-5 shadow-panel">
        <header className="panel-surface rounded-[28px] px-5 py-6">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Dioscuri Platform</p>
          <h1 className="mt-3 font-display text-4xl text-fog md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-white/62 md:text-base">{subtitle}</p>
        </header>
        <section className="grid gap-4 lg:grid-cols-3">
          {toolkits.map((toolkit) =>
            toolkit.status === 'live' && toolkit.href ? (
              <Link
                className="panel-surface rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:border-white/18"
                href={toolkit.href}
                key={toolkit.id}
              >
                <ToolkitCardContent toolkit={toolkit} />
              </Link>
            ) : (
              <article
                className="panel-surface rounded-[28px] border border-white/6 p-5 opacity-80"
                key={toolkit.id}
              >
                <ToolkitCardContent toolkit={toolkit} />
              </article>
            )
          )}
        </section>
      </div>
    </main>
  );
}

function ToolkitCardContent({ toolkit }: { toolkit: ToolkitDefinition }) {
  const statusLabel = toolkit.status === 'live' ? 'Live' : 'Planned';

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-white/46">{statusLabel}</p>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/54">
          {toolkit.capabilities.map((capability) => capability.label).join(' / ')}
        </span>
      </div>
      <h2 className="mt-6 font-display text-3xl text-fog">{toolkit.label}</h2>
      <p className="mt-3 text-sm leading-6 text-white/62">{toolkit.summary}</p>
    </>
  );
}
