import React from "react";
import { PrioritizedAction, PersonaType, PERSONA_CONFIG } from "@/types/air-quality";
import { Clock, ShieldCheck, CheckSquare, Zap } from "lucide-react";

interface PrioritizedActionsCardProps {
  actions: PrioritizedAction[];
  persona: PersonaType;
}

export function PrioritizedActionsCard({ actions, persona }: PrioritizedActionsCardProps) {
  if (!actions || actions.length === 0) return null;

  const personaMeta = PERSONA_CONFIG[persona];

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "Critical":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
      case "Medium":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-sm text-zinc-900 uppercase tracking-wider dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Prioritized Local Interventions ({personaMeta.title})</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Actionable mandates calibrated strictly to your operational powers and available jurisdiction.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
          {actions.length} Action Items Ready
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.priority}
            className="p-4 rounded-xl border border-zinc-200/90 bg-zinc-50/40 hover:bg-zinc-50 transition-all dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/60"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {act.priority}
                </span>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {act.action_title}
                </h4>
              </div>

              <div className="flex items-center gap-2 ml-8 sm:ml-0">
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{act.immediate_timeline}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getImpactBadge(act.estimated_impact)}`}>
                  {act.estimated_impact} Impact
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 ml-8 leading-relaxed mb-2.5">
              {act.action_detail}
            </p>

            <div className="ml-8 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Data Evidence:</span>
              <span className="italic truncate">{act.trace_justification}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
