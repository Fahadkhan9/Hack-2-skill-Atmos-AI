"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PersonaSelector } from "@/components/PersonaSelector";
import { DataIngestionCard } from "@/components/DataIngestionCard";
import { AqiStatusCard } from "@/components/AqiStatusCard";
import { DataReliabilityAlert } from "@/components/DataReliabilityAlert";
import { TemporalDeltaCard } from "@/components/TemporalDeltaCard";
import { HotspotsTable } from "@/components/HotspotsTable";
import { PrioritizedActionsCard } from "@/components/PrioritizedActionsCard";
import { DualOutputStudio } from "@/components/DualOutputStudio";
import { PersonaType, CivicIntelligenceAnalysis } from "@/types/air-quality";
import { SAMPLE_MORNING_MESSY } from "@/lib/data/sample-datasets";
import { analyzeAirQualityAction } from "@/app/actions/analyze-air";
import { AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("ward_officer");
  const [inputData, setInputData] = useState<string>(SAMPLE_MORNING_MESSY);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CivicIntelligenceAnalysis | null>(null);
  const [stationCount, setStationCount] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await analyzeAirQualityAction(inputData, selectedPersona);
      if (res.success && res.data) {
        setAnalysisResult(res.data);
        setStationCount(res.rawSummary?.stationsDetected?.length);
      } else {
        setErrorMessage(res.error || "Failed to analyze air quality data.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Civic Intelligence & Air Action Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Turn Raw Air Quality Data into Local Civic Interventions
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Interpret messy, inconsistent sensor logs. Pinpoint hotspots with 100% data traceability, compare temporal changes, and broadcast role-specific actions.
          </p>
        </div>

        {/* Step 1: Persona Switcher */}
        <section aria-labelledby="persona-selection-heading">
          <h2 id="persona-selection-heading" className="sr-only">Persona Selection</h2>
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelectPersona={setSelectedPersona}
            disabled={isLoading}
          />
        </section>

        {/* Step 2: Data Ingestion */}
        <section aria-labelledby="data-ingestion-heading">
          <h2 id="data-ingestion-heading" className="sr-only">Data Ingestion</h2>
          <DataIngestionCard
            inputData={inputData}
            setInputData={setInputData}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-900 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Analysis Failed: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Dynamic AI Results Section (Accessible live region) */}
        <div aria-live="polite" className="space-y-6">
          {analysisResult && (
            <>
              {/* Overall Status */}
              <AqiStatusCard
                analysis={analysisResult}
                stationCount={stationCount}
              />

              {/* Data Reliability & Missing Sensor Flags */}
              <DataReliabilityAlert
                flags={analysisResult.data_reliability_flags}
              />

              {/* Temporal Delta ("What Changed?") */}
              <TemporalDeltaCard
                delta={analysisResult.temporal_delta}
              />

              {/* Hotspots & Traceability */}
              <HotspotsTable
                hotspots={analysisResult.hotspots}
              />

              {/* Prioritized Role-Specific Actions */}
              <PrioritizedActionsCard
                actions={analysisResult.prioritized_actions}
                persona={selectedPersona}
              />

              {/* Dual Output Studio (Internal Briefing Note vs Multilingual Citizen Advisory) */}
              <DualOutputStudio
                analysis={analysisResult}
              />
            </>
          )}
        </div>
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Atmos AI — Built for Hackathon Excellence</span>
          <div className="flex items-center gap-4">
            <span>Powered by Claude 3.5 Sonnet</span>
            <span>•</span>
            <span>Neon Serverless PostgreSQL</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
