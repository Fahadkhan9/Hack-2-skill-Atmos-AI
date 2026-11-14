import React from "react";
import { TemporalDelta } from "@/types/air-quality";
import { ArrowDownRight, ArrowUpRight, History, AlertOctagon, CheckCircle2 } from "lucide-react";

interface TemporalDeltaCardProps {
  delta: TemporalDelta;
}

export function TemporalDeltaCard({ delta }: TemporalDeltaCardProps) {
  if (!delta) return null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            Temporal Delta: What Changed Since Previous Brief?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Automated comparison with previous historical readings saved in Neon PostgreSQL.
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 dark:bg-zinc-950/50 dark:border-zinc-800 dark:text-zinc-300 mb-4 leading-relaxed">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
          Executive Trend Delta:
        </span>
        {delta.summary_of_changes}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Improving Zones */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/60">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-2">
            <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Improving Zones ({delta.improving_zones.length})</span>
          </div>
          {delta.improving_zones.length > 0 ? (
            <ul className="space-y-1.5">
              {delta.improving_zones.map((zone, idx) => (
                <li key={idx} className="text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{zone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">No significant improvements registered yet.</p>
          )}
        </div>

        {/* Worsening Zones */}
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/60">
          <div className="flex items-center gap-1.5 text-red-800 dark:text-red-300 font-semibold text-xs mb-2">
            <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Deteriorating Zones ({delta.worsening_zones.length})</span>
          </div>
          {delta.worsening_zones.length > 0 ? (
            <ul className="space-y-1.5">
              {delta.worsening_zones.map((zone, idx) => (
                <li key={idx} className="text-xs text-red-900 dark:text-red-200 flex items-start gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>{zone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">No new deterioration spikes detected.</p>
          )}
        </div>

        {/* Persistent Hazards */}
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/60">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold text-xs mb-2">
            <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Persistent Hazards ({delta.persistent_hazards.length})</span>
          </div>
          {delta.persistent_hazards.length > 0 ? (
            <ul className="space-y-1.5">
              {delta.persistent_hazards.map((hazard, idx) => (
                <li key={idx} className="text-xs text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{hazard}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">No stagnant or unresolved hotspots.</p>
          )}
        </div>
      </div>
    </div>
  );
}
