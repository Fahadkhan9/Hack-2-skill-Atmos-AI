import React from "react";
import { DataReliabilityFlag } from "@/types/air-quality";
import { AlertCircle, FileWarning, HelpCircle } from "lucide-react";

interface DataReliabilityAlertProps {
  flags: DataReliabilityFlag[];
}

export function DataReliabilityAlert({ flags }: DataReliabilityAlertProps) {
  if (!flags || flags.length === 0) return null;

  const getIssueBadge = (type: string) => {
    switch (type) {
      case "missing_sensor":
        return { label: "Disconnected / Missing Sensor", color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" };
      case "flatline_anomaly":
        return { label: "Glitch / Out-of-Scale Anomaly", color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" };
      case "unit_mismatch":
        return { label: "Unit Inconsistency", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" };
      case "irregular_timestamp":
      default:
        return { label: "Timestamp Gap", color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300" };
    }
  };

  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm dark:bg-amber-950/20 dark:border-amber-800/80"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <h3 className="font-semibold text-sm text-amber-950 dark:text-amber-200">
          Data Reliability & Sensor Gap Warnings ({flags.length} Flagged)
        </h3>
      </div>
      <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mb-3">
        Raw data feeds contained missing readings or inconsistent units. The AI flagged these unreliable points and excluded erroneous values from polluting civic decision-making:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {flags.map((flag, idx) => {
          const badge = getIssueBadge(flag.issue_type);
          return (
            <div
              key={idx}
              className="bg-white/90 p-3.5 rounded-xl border border-amber-200/80 shadow-xs dark:bg-zinc-900/90 dark:border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
                    {flag.affected_station_or_row}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {flag.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
