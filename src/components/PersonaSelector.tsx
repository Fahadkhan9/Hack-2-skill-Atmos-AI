import React from "react";
import { PersonaType, PERSONA_CONFIG } from "@/types/air-quality";
import { Landmark, Building2, GraduationCap, CheckCircle2 } from "lucide-react";

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  disabled?: boolean;
}

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  disabled
}: PersonaSelectorProps) {
  const personas: { id: PersonaType; title: string; icon: React.ReactNode; subtitle: string }[] = [
    {
      id: "ward_officer",
      title: "Ward Officer",
      icon: <Landmark className="w-5 h-5" />,
      subtitle: "Municipal & Traffic Command"
    },
    {
      id: "housing_society",
      title: "Housing Society (RWA)",
      icon: <Building2 className="w-5 h-5" />,
      subtitle: "Residential Community Admin"
    },
    {
      id: "school",
      title: "School Principal",
      icon: <GraduationCap className="w-5 h-5" />,
      subtitle: "Student & Campus Protection"
    }
  ];

  const currentMetadata = PERSONA_CONFIG[selectedPersona];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider dark:text-zinc-100">
            Step 1: Select Civic Persona
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Recommendations are tailored strictly to what each authority has the power to execute.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-medium dark:bg-zinc-800 dark:text-zinc-300 self-start sm:self-auto">
          {currentMetadata.badge}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Civic Persona Selector"
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {personas.map((p) => {
          const isSelected = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectPersona(p.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-500 ring-1 ring-emerald-500"
                  : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {p.title}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate dark:text-zinc-400 mt-0.5">
                  {p.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scope banner */}
      <div className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 dark:bg-zinc-950/50 dark:border-zinc-800/80 dark:text-zinc-400">
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          Authority Scope:{" "}
        </span>
        {currentMetadata.roleDescription}
      </div>
    </div>
  );
}
