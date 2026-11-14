import Papa from "papaparse";
import { ParsedDataSummary } from "@/types/air-quality";

// Column aliases mapping
const COLUMN_ALIASES: Record<string, string[]> = {
  station: ["station", "sensor", "site", "location", "ward", "area", "monitor_id", "device"],
  timestamp: ["time", "timestamp", "date", "datetime", "hour", "recorded_at"],
  pm25: ["pm25", "pm2.5", "pm 2.5", "pm2_5", "particulate_matter_2.5", "fine_dust"],
  pm10: ["pm10", "pm 10", "pm_10", "particulate_matter_10", "coarse_dust"],
  no2: ["no2", "nitrogen_dioxide", "no_2"],
  so2: ["so2", "sulfur_dioxide", "so_2"],
  co: ["co", "carbon_monoxide"],
  aqi: ["aqi", "air_quality_index", "overall_aqi"]
};

function normalizeHeader(header: string): string {
  const cleaned = header.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      const cleanedAlias = alias.replace(/[^a-z0-9]/g, "");
      if (cleaned === cleanedAlias || cleaned.includes(cleanedAlias)) {
        return canonical;
      }
    }
  }
  return header.trim();
}

export function parseTabularAirData(rawInput: string): {
  summary: ParsedDataSummary;
  normalizedRows: Record<string, any>[];
  rawSnippet: string;
} {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error("Input data is empty. Please paste or upload air quality readings.");
  }

  // Parse using PapaParse with automatic delimiter detection
  const parseResult = Papa.parse<Record<string, any>>(trimmed, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => normalizeHeader(h)
  });

  const rows = parseResult.data;
  if (!rows || rows.length === 0) {
    throw new Error("Unable to parse table rows. Ensure data has column headers (e.g. Station, Time, PM2.5).");
  }

  const columnsDetected = Object.keys(rows[0] || {});
  const stationsSet = new Set<string>();
  const pollutantsSet = new Set<string>();
  const anomalies: string[] = [];
  let missingValuesCount = 0;

  // Track potential flatlines (sensor stuck on exact same reading)
  const lastValues: Record<string, { val: any; count: number }> = {};

  const normalizedRows: Record<string, any>[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const cleanRow: Record<string, any> = { _rowNum: rowNum };

    for (const [col, rawVal] of Object.entries(row)) {
      if (rawVal === undefined || rawVal === null || rawVal === "" || rawVal === "-" || rawVal === "N/A" || rawVal === "null") {
        missingValuesCount++;
        cleanRow[col] = null;
        if (["pm25", "pm10", "station"].includes(col)) {
          anomalies.push(`Row #${rowNum}: Missing mandatory field '${col}'`);
        }
      } else {
        // Strip unit strings if embedded (e.g. "210 ug/m3", "185 µg/m³" -> 210)
        const strVal = String(rawVal).trim();
        const numMatch = strVal.match(/^([-+]?[0-9]*\.?[0-9]+)/);
        const numVal = numMatch ? parseFloat(numMatch[1]) : NaN;

        if (!isNaN(numVal) && (strVal.match(/\d/) && !col.includes("time") && !col.includes("station"))) {
          cleanRow[col] = numVal;

          // Check extreme sensor faults
          if (numVal < 0) {
            anomalies.push(`Row #${rowNum} [${col}]: Negative value (${numVal}) indicates sensor calibration error`);
          } else if (col === "pm25" && numVal > 1500) {
            anomalies.push(`Row #${rowNum} [PM2.5]: Extreme out-of-scale reading (${numVal} µg/m³) - potential sensor defect`);
          }

          // Flatline check for PM2.5
          if (col === "pm25") {
            const prev = lastValues[cleanRow.station || "default"];
            if (prev && prev.val === numVal) {
              prev.count++;
              if (prev.count === 4) {
                anomalies.push(`Station '${cleanRow.station || "Unknown"}': Consecutive identical PM2.5 readings (${numVal}) suggesting stuck telemetry`);
              }
            } else {
              lastValues[cleanRow.station || "default"] = { val: numVal, count: 1 };
            }
          }
        } else {
          cleanRow[col] = strVal;
        }

        if (col === "station" && cleanRow[col]) {
          stationsSet.add(String(cleanRow[col]));
        }
        if (["pm25", "pm10", "no2", "so2", "co", "aqi"].includes(col)) {
          pollutantsSet.add(col.toUpperCase());
        }
      }
    }
    normalizedRows.push(cleanRow);
  });

  // Limit sample size for token efficiency
  const preprocessedRowsSample = normalizedRows.slice(0, 30);

  const summary: ParsedDataSummary = {
    rowCount: normalizedRows.length,
    columnsDetected,
    stationsDetected: Array.from(stationsSet),
    detectedPollutants: Array.from(pollutantsSet),
    missingValuesCount,
    preprocessedRowsSample,
    anomaliesDetected: anomalies.slice(0, 10) // Top 10 anomalies
  };

  return {
    summary,
    normalizedRows,
    rawSnippet: trimmed.slice(0, 4000) // First 4k characters for LLM prompt context
  };
}
