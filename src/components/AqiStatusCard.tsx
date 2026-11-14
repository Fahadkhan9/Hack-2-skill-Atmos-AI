import React from "react";
import { CivicIntelligenceAnalysis } from "@/types/air-quality";
import { AlertTriangle, CheckCircle, Info, Wind, ShieldAlert, BarChart3 } from "lucide-react";

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
          text: "text-emerald-900 dark:text-emerald-200",
          badge: "bg-emerald-700 text-white",
          icon: <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        };
      case "Moderate":
        return {
          bg: "bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800",
          text: "text-amber-900 dark:text-amber-200",
          badge: "bg-amber-700 text-white",
          icon: <Info className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        };
      case "Unhealthy for Sensitive Groups":
        return {
          bg: "bg-orange-50 border-orange-300 dark:bg-orange-950/40 dark:border-orange-800",
          text: "text-orange-900 dark:text-orange-200",
          badge: "bg-orange-700 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        };
      case "Unhealthy":
        return {
          bg: "bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-800",
          text: "text-red-900 dark:text-red-200",
          badge: "bg-red-700 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        };
      case "Very Unhealthy":
        return {
          bg: "bg-purple-50 border-purple-300 dark:bg-purple-950/40 dark:border-purple-800",
          text: "text-purple-900 dark:text-purple-200",
          badge: "bg-purple-700 text-white",
          icon: <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        };
      case "Hazardous":
      default:
        return {
          bg: "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800",
          text: "text-rose-900 dark:text-rose-200",
          badge: "bg-rose-800 text-white",
          icon: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        };
    }
  };

  const theme = getCategoryTheme(analysis.overall_aqi_category);

  return (
    <div
      className={`rounded-2xl border p-6 transition-all shadow-sm ${theme.bg}`}
      role="region"
      aria-label="Overall Air Quality Assessment"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-xs dark:bg-zinc-900">
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Civic Air Quality Status
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
                {analysis.overall_aqi_category}
              </span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${theme.text}`}>
              {analysis.overall_aqi_category} Conditions Detected
            </h3>
            <p className="text-sm mt-1 text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed">
              {analysis.executive_summary}
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-white/70 dark:bg-zinc-900/70 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Avg PM2.5</span>
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              {analysis.average_pm25}
            </span>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Dominant</span>
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              {analysis.dominant_pollutant}
            </span>
          </div>
          {stationCount !== undefined && (
            <>
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 block font-medium">Monitors</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  {stationCount} Stations
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
