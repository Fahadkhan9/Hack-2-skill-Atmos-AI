import React, { useState } from "react";
import { Hotspot } from "@/types/air-quality";
import { MapPin, ShieldCheck, Flame, Compass, Info, Radio, Layers } from "lucide-react";

interface CivicWardMapProps {
  hotspots: Hotspot[];
}

export function CivicWardMap({ hotspots }: CivicWardMapProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(
    hotspots && hotspots.length > 0 ? hotspots[0] : null
  );

  if (!hotspots || hotspots.length === 0) return null;

  // Generate deterministic grid positions for wards across a civic blueprint
  const getNodeCoordinates = (index: number, total: number) => {
    const layoutPositions = [
      { x: 30, y: 35 },
      { x: 70, y: 30 },
      { x: 25, y: 70 },
      { x: 75, y: 65 },
      { x: 50, y: 50 },
      { x: 50, y: 20 },
      { x: 50, y: 80 }
    ];
    return layoutPositions[index % layoutPositions.length];
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return {
          fill: "bg-rose-500",
          ring: "ring-rose-500/40 border-rose-600",
          text: "text-rose-700 dark:text-rose-300",
          badge: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
          radar: "bg-rose-500/20 animate-ping"
        };
      case "Severe":
        return {
          fill: "bg-purple-500",
          ring: "ring-purple-500/40 border-purple-600",
          text: "text-purple-700 dark:text-purple-300",
          badge: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
          radar: "bg-purple-500/20 animate-ping"
        };
      case "High":
        return {
          fill: "bg-amber-500",
          ring: "ring-amber-500/40 border-amber-600",
          text: "text-amber-700 dark:text-amber-300",
          badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
          radar: "bg-amber-500/20 animate-ping"
        };
      case "Moderate":
      default:
        return {
          fill: "bg-emerald-500",
          ring: "ring-emerald-500/40 border-emerald-600",
          text: "text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
          radar: "bg-emerald-500/20"
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-sm text-zinc-900 uppercase tracking-wider dark:text-zinc-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Civic Ward Hotspot Map</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Click any ward sector node to inspect localized pollutant telemetry and underlying evidence citations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical
          </span>
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Severe
          </span>
          <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Interactive Civic Blueprint Canvas */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-xl border border-zinc-200 bg-zinc-950 p-4 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Civic Grid Lines */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px"
            }}
          />

          {/* Compass Rose Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-emerald-500/30 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-emerald-500/20" />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Civic Grid Telemetry • Active</span>
          </div>

          {/* Ward Sector Hotspot Nodes */}
          {hotspots.map((h, idx) => {
            const coords = getNodeCoordinates(idx, hotspots.length);
            const style = getSeverityStyle(h.severity);
            const isSelected = selectedHotspot?.location === h.location;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedHotspot(h)}
                style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-full cursor-pointer transition-transform hover:scale-125 z-10 ${
                  isSelected ? "scale-125" : ""
                }`}
                title={`${h.location}: ${h.peak_value}`}
              >
                {/* Concentric Radar Ring */}
                <div
                  className={`absolute -inset-2 rounded-full ${style.radar} opacity-75`}
                />

                {/* Node Marker */}
                <div
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
                    style.fill
                  } ${
                    isSelected
                      ? "ring-4 ring-white border-white scale-110"
                      : "border-zinc-900 hover:ring-2 hover:ring-white/80"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                {/* Micro Label */}
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all shadow-md ${
                    isSelected
                      ? "bg-white text-zinc-950 font-bold"
                      : "bg-zinc-900/90 text-zinc-300 group-hover:bg-zinc-800"
                  }`}
                >
                  {h.location.split("-")[0]?.trim() || h.location}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Telemetry Inspector */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/60">
          {selectedHotspot ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Sector Inspector
                  </span>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{selectedHotspot.location}</span>
                  </h4>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    getSeverityStyle(selectedHotspot.severity).badge
                  }`}
                >
                  {selectedHotspot.severity}
                </span>
              </div>

              {/* Telemetry Highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Observed Peak
                  </span>
                  <span className="text-base font-bold font-mono text-zinc-900 dark:text-white">
                    {selectedHotspot.peak_value}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Critical Pollutant
                  </span>
                  <span className="text-base font-bold text-zinc-900 dark:text-white">
                    {selectedHotspot.primary_pollutant}
                  </span>
                </div>
              </div>

              {/* Likely Cause */}
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 block mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Probable Local Emission Source</span>
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {selectedHotspot.plain_language_cause}
                </p>
              </div>

              {/* Strict Evidence Trace */}
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-mono mb-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Underlying Sensor Citation:</span>
                </div>
                <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-800/60">
                  {selectedHotspot.trace_citation}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-zinc-400">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">Click any node on the blueprint to view localized telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
