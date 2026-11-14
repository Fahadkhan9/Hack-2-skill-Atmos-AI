import React from "react";
import { CivicIntelligenceAnalysis } from "@/types/air-quality";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Activity, Compass, Wind } from "lucide-react";

interface AqiStatusCardProps {
  analysis: CivicIntelligenceAnalysis;
  stationCount?: number;
}

export function AqiStatusCard({ analysis, stationCount }: AqiStatusCardProps) {
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "Good":
        return {
          bg: "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800",
          text: "text-emerald-950 dark:text-emerald-100",
          badge: "bg-emerald-700 text-white",
          icon: <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        };
      case "Moderate":
        return {
          bg: "bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800",
          text: "text-amber-950 dark:text-amber-100",
          badge: "bg-amber-700 text-white",
          icon: <Info className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        };
      case "Unhealthy for Sensitive Groups":
        return {
          bg: "bg-orange-50 border-orange-300 dark:bg-orange-950/40 dark:border-orange-800",
          text: "text-orange-950 dark:text-orange-100",
          badge: "bg-orange-700 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        };
      case "Unhealthy":
        return {
          bg: "bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-800",
          text: "text-red-950 dark:text-red-100",
          badge: "bg-red-700 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        };
      case "Very Unhealthy":
        return {
          bg: "bg-purple-50 border-purple-300 dark:bg-purple-950/40 dark:border-purple-800",
          text: "text-purple-950 dark:text-purple-100",
          badge: "bg-purple-700 text-white",
          icon: <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        };
      case "Hazardous":
      default:
        return {
          bg: "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800",
          text: "text-rose-950 dark:text-rose-100",
          badge: "bg-rose-800 text-white",
          icon: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        };
    }
  };

  const theme = getCategoryTheme(analysis.overall_aqi_category);

  // Extract clean short metric (e.g. "117.9 µg/m³") and optional details if Claude returned a verbose explanation
  const parseMetric = (raw: string) => {
    if (!raw) return { short: "N/A", details: "" };
    const parenIdx = raw.indexOf("(");
    if (parenIdx > 0) {
      return {
        short: raw.substring(0, parenIdx).trim(),
        details: raw.substring(parenIdx).replace(/^\(|\)$/g, "").trim()
      };
    }
    return { short: raw, details: "" };
  };

  const pm25Parsed = parseMetric(analysis.average_pm25);

  return (
    <div
      className={`rounded-2xl border p-6 transition-all shadow-sm ${theme.bg}`}
      role="region"
      aria-label="Overall Air Quality Assessment"
    >
      {/* Header & Category Badge */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-white rounded-xl shadow-xs dark:bg-zinc-900 shrink-0">
          {theme.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Civic Air Quality Status
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
              {analysis.overall_aqi_category}
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold mt-1 tracking-tight ${theme.text}`}>
            {analysis.overall_aqi_category} Conditions Detected
          </h3>
          <p className="text-sm mt-2 text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {analysis.executive_summary}
          </p>
        </div>
      </div>

      {/* Metrics Row: Dedicated Grid that never squishes the title */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
        {/* Average PM2.5 */}
        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Average PM2.5</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white font-mono block">
            {pm25Parsed.short}
          </span>
          {pm25Parsed.details && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2" title={pm25Parsed.details}>
              {pm25Parsed.details}
            </p>
          )}
        </div>

        {/* Dominant Pollutant */}
        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Primary Pollutant</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white block">
            {analysis.dominant_pollutant}
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 block">
            Dominant civic health threat
          </span>
        </div>

        {/* Total Monitoring Stations */}
        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Monitors Audited</span>
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white block">
            {stationCount !== undefined ? `${stationCount} Sensor Stations` : `${analysis.hotspots.length} Key Sites`}
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 block">
            Standardized & QA verified
          </span>
        </div>
      </div>
    </div>
  );
}
