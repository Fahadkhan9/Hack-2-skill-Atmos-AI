import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CivicIntelligenceAnalysis } from "@/types/air-quality";
import {
  FileText,
  Users,
  Copy,
  Check,
  Languages,
  Baby,
  HeartPulse,
  UserCheck,
  BookOpen,
  Printer
} from "lucide-react";

interface DualOutputStudioProps {
  analysis: CivicIntelligenceAnalysis;
}

export function DualOutputStudio({ analysis }: DualOutputStudioProps) {
  const [activeTab, setActiveTab] = useState<"internal" | "citizen">("internal");
  const [citizenLanguage, setCitizenLanguage] = useState<"en" | "hi">("en");
  const [readingLevel, setReadingLevel] = useState<"standard" | "simple">("standard");
  const [copiedInternal, setCopiedInternal] = useState(false);
  const [copiedCitizen, setCopiedCitizen] = useState(false);

  const citizenContent = analysis.citizen_advisory[citizenLanguage];

  const handleCopyInternal = async () => {
    await navigator.clipboard.writeText(analysis.internal_briefing_note);
    setCopiedInternal(true);
    setTimeout(() => setCopiedInternal(false), 2000);
  };

  const handleCopyCitizen = async () => {
    const textToCopy = `AIR QUALITY CITIZEN ADVISORY (${citizenLanguage.toUpperCase()})
${readingLevel === "standard" ? citizenContent.standard_advisory : citizenContent.simple_grade4_advisory}

HEALTH SAFEGUARDS FOR VULNERABLE RESIDENTS:
• Children & Students: ${citizenContent.vulnerable_groups.children}
• Senior Citizens: ${citizenContent.vulnerable_groups.elderly}
• Respiratory / Cardiac Sensitive: ${citizenContent.vulnerable_groups.respiratory_and_cardiac}`;

    await navigator.clipboard.writeText(textToCopy);
    setCopiedCitizen(true);
    setTimeout(() => setCopiedCitizen(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <h3 className="font-semibold text-sm text-zinc-900 uppercase tracking-wider dark:text-zinc-100">
            Step 3: Dual Communication Output Studio
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Generate separate tailored communications for internal operational command vs citizen health protection.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl dark:bg-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "internal"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Internal Briefing Note</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("citizen")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "citizen"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Citizen Health Advisory</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERNAL BRIEFING NOTE */}
      {activeTab === "internal" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Format: Operational Directive | Target Audience: Ward Officers & Enforcement Teams
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                title="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF Directive</span>
              </button>
              <button
                type="button"
                onClick={handleCopyInternal}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
              >
                {copiedInternal ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Note!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Briefing Note</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/60 font-sans text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 prose prose-sm dark:prose-invert max-w-none leading-relaxed">
            <ReactMarkdown>{analysis.internal_briefing_note}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN ADVISORY */}
      {activeTab === "citizen" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-500 font-medium">Language:</span>
              <div className="flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setCitizenLanguage("en")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    citizenLanguage === "en"
                      ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  English 🇬🇧
                </button>
                <button
                  type="button"
                  onClick={() => setCitizenLanguage("hi")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    citizenLanguage === "hi"
                      ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  हिन्दी 🇮🇳
                </button>
              </div>
            </div>

            {/* Reading Level Selector */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-500 font-medium">Reading Level:</span>
              <div className="flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setReadingLevel("standard")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    readingLevel === "standard"
                      ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Standard Public
                </button>
                <button
                  type="button"
                  onClick={() => setReadingLevel("simple")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    readingLevel === "simple"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  4th-Grade Simple (Children / Low Literacy)
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCitizen}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors self-end sm:self-auto"
            >
              {copiedCitizen ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Advisory!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Advisory</span>
                </>
              )}
            </button>
          </div>

          {/* Main Citizen Advisory Message Box */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
              {readingLevel === "standard" ? "Public Health Broadcast" : "Simplified Easy-Read Message"}
            </span>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
              {readingLevel === "standard"
                ? citizenContent.standard_advisory
                : citizenContent.simple_grade4_advisory}
            </p>
          </div>

          {/* High-Risk Demographics (Children, Elderly, Respiratory Sensitive) */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider dark:text-zinc-200 mb-2.5">
              Specific Health Protections for Vulnerable Populations:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Children */}
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
                <div className="flex items-center gap-2 mb-1.5 text-sky-800 dark:text-sky-300 font-bold text-xs">
                  <Baby className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Children & School Students</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {citizenContent.vulnerable_groups.children}
                </p>
              </div>

              {/* Elderly */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 mb-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Older Adults & Seniors</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {citizenContent.vulnerable_groups.elderly}
                </p>
              </div>

              {/* Respiratory / Cardiac */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20">
                <div className="flex items-center gap-2 mb-1.5 text-rose-800 dark:text-rose-300 font-bold text-xs">
                  <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Asthma & Cardiac Sensitive</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {citizenContent.vulnerable_groups.respiratory_and_cardiac}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
