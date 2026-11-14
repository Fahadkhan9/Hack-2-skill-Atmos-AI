import React from "react";
import { Hotspot } from "@/types/air-quality";
import { MapPin, ShieldCheck, Flame, Compass } from "lucide-react";

interface HotspotsTableProps {
  hotspots: Hotspot[];
}

export function HotspotsTable({ hotspots }: HotspotsTableProps) {
  if (!hotspots || hotspots.length === 0) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
      case "Severe":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
      case "Moderate":
      default:
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-sm text-zinc-900 uppercase tracking-wider dark:text-zinc-100 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Identified Local Hotspots & Likely Causes</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Ranked by pollution intensity. Every hotspot is strictly verified with underlying sensor rows.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {hotspots.length} Priority Hotspots
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {hotspots.map((h, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-zinc-200/90 bg-zinc-50/50 hover:bg-zinc-50 transition-all dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{h.location}</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(h.severity)}`}>
                  {h.severity}
                </span>
              </div>

              {/* Peak Value & Pollutant */}
              <div className="flex items-center gap-3 text-xs mb-2.5">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Peak: <strong className="text-zinc-900 dark:text-white font-mono">{h.peak_value}</strong>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Pollutant: <strong className="text-zinc-900 dark:text-white">{h.primary_pollutant}</strong>
                </span>
              </div>

              {/* Plain Language Cause */}
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Probable Source: </span>
                {h.plain_language_cause}
              </p>
            </div>

            {/* Traceability Citation Badge */}
            <div className="pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">Evidence Trace:</span>
              </div>
              <span className="font-mono text-zinc-600 dark:text-zinc-400 text-right truncate max-w-[230px]" title={h.trace_citation}>
                {h.trace_citation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
