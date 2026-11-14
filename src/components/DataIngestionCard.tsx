import React, { useRef } from "react";
import { Upload, FileText, Sparkles, RefreshCw, Trash2, Zap } from "lucide-react";
import { SAMPLE_MORNING_MESSY, SAMPLE_AFTERNOON_FOLLOWUP } from "@/lib/data/sample-datasets";

interface DataIngestionCardProps {
  inputData: string;
  setInputData: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function DataIngestionCard({
  inputData,
  setInputData,
  onAnalyze,
  isLoading
}: DataIngestionCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputData(content);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider dark:text-zinc-100">
            Step 2: Ingest Raw / Messy Air Quality Data
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Paste messy logs from WhatsApp, spreadsheets, or broken sensors. Supports missing fields and inconsistent units.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium hidden lg:inline">Presets:</span>
          <button
            type="button"
            onClick={() => setInputData(SAMPLE_MORNING_MESSY)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Morning Messy Peak</span>
          </button>
          <button
            type="button"
            onClick={() => setInputData(SAMPLE_AFTERNOON_FOLLOWUP)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Afternoon Delta Follow-up</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="raw-air-data" className="sr-only">
          Air Quality Tabular Data
        </label>
        <textarea
          id="raw-air-data"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Paste CSV, TSV, or messy table text here...&#10;Example:&#10;Location, Time, PM2.5, PM10, NO2&#10;Ward 7 - Market, 08:00 AM, 210 ug/m3, 340, 65&#10;Ward 2 - Hospital, 08:00 AM, -, 115, 22"
          rows={7}
          disabled={isLoading}
          className="w-full font-mono text-xs sm:text-sm p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:bg-zinc-950"
        />

        {inputData && (
          <button
            type="button"
            onClick={() => setInputData("")}
            disabled={isLoading}
            title="Clear data"
            className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-colors dark:hover:bg-zinc-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.tsv,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors w-full sm:w-auto dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV / File</span>
          </button>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            {inputData ? `${inputData.split("\n").filter(Boolean).length} rows ready` : "No file chosen"}
          </span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !inputData.trim()}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all w-full sm:w-auto ${
            isLoading || !inputData.trim()
              ? "bg-zinc-400 cursor-not-allowed shadow-none"
              : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-600/25"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with Claude Sonnet...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Civic Interventions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
