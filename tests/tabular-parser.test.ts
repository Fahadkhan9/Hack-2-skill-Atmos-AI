import { describe, it, expect } from "vitest";
import { parseTabularAirData } from "../src/lib/parsers/tabular-parser";
import { CivicIntelligenceAnalysisSchema } from "../src/types/air-quality";

describe("Tabular Air Quality Parser", () => {
  it("should parse clean CSV data correctly", () => {
    const csv = `Station,Timestamp,PM2.5,PM10,NO2
Ward 4 Park,08:00 AM,45,90,18
Ward 7 Market,08:00 AM,185,290,45`;

    const { summary, normalizedRows } = parseTabularAirData(csv);

    expect(summary.rowCount).toBe(2);
    expect(summary.stationsDetected).toContain("Ward 4 Park");
    expect(summary.stationsDetected).toContain("Ward 7 Market");
    expect(normalizedRows[0].pm25).toBe(45);
    expect(normalizedRows[1].pm25).toBe(185);
  });

  it("should normalize messy headers and strip embedded units", () => {
    const messyCsv = `LOCATION, TIME, Particulate Matter 2.5, COARSE DUST
Ward 12 Ind, 09:00 AM, 340 ug/m3, 510 µg/m³`;

    const { summary, normalizedRows } = parseTabularAirData(messyCsv);

    expect(summary.rowCount).toBe(1);
    expect(normalizedRows[0].pm25).toBe(340);
    expect(normalizedRows[0].pm10).toBe(510);
  });

  it("should detect missing sensors and negative glitch anomalies", () => {
    const glitchCsv = `Station, Time, PM2.5, PM10
Ward 2 Hospital, 08:00 AM, -, 115
Ward 15 Highway, 08:00 AM, -999, 450`;

    const { summary } = parseTabularAirData(glitchCsv);

    expect(summary.missingValuesCount).toBeGreaterThanOrEqual(1);
    expect(summary.anomaliesDetected.some(a => a.includes("Missing mandatory field"))).toBe(true);
    expect(summary.anomaliesDetected.some(a => a.includes("Negative value"))).toBe(true);
  });
});

describe("Civic Intelligence Zod Schema", () => {
  it("should validate a complete civic analysis payload", () => {
    const mockPayload = {
      executive_summary: "Severe air quality detected across industrial corridors.",
      overall_aqi_category: "Very Unhealthy",
      average_pm25: "185 µg/m³",
      dominant_pollutant: "PM2.5",
      hotspots: [
        {
          location: "Ward 12 Industrial Corridor",
          severity: "Critical",
          primary_pollutant: "PM2.5",
          peak_value: "385 µg/m³",
          trace_citation: "Station 12 (Row 3) at 08:00 hrs",
          plain_language_cause: "Industrial furnace emission"
        }
      ],
      data_reliability_flags: [
        {
          issue_type: "missing_sensor",
          description: "PM2.5 sensor offline at Ward 2 Hospital",
          affected_station_or_row: "Ward 2 (Row 5)"
        }
      ],
      prioritized_actions: [
        {
          priority: 1,
          action_title: "Halt Industrial Furnaces",
          action_detail: "Issue immediate temporary shutdown notices to furnaces.",
          immediate_timeline: "Next 2 hours",
          estimated_impact: "Critical",
          trace_justification: "Peak PM2.5 of 385 µg/m³ observed"
        }
      ],
      temporal_delta: {
        comparison_available: true,
        summary_of_changes: "Ward 7 improved by 40% while Ward 12 remains severe.",
        worsening_zones: [],
        improving_zones: ["Ward 7 Market"],
        persistent_hazards: ["Ward 12 Industrial Corridor"]
      },
      internal_briefing_note: "### Directive\nEnforce emission standards.",
      citizen_advisory: {
        en: {
          standard_advisory: "Air quality is poor today. Avoid outdoor recreation.",
          simple_grade4_advisory: "The air is dirty. Stay inside.",
          vulnerable_groups: {
            children: "Keep children indoors.",
            elderly: "Avoid morning walks.",
            respiratory_and_cardiac: "Carry inhalers."
          }
        },
        hi: {
          standard_advisory: "आज वायु गुणवत्ता खराब है।",
          simple_grade4_advisory: "हवा गंदी है, घर पर रहें।",
          vulnerable_groups: {
            children: "बच्चों को अंदर रखें।",
            elderly: "बुजुर्ग बाहर न जाएं।",
            respiratory_and_cardiac: "दवा पास रखें।"
          }
        }
      }
    };

    const parsed = CivicIntelligenceAnalysisSchema.safeParse(mockPayload);
    expect(parsed.success).toBe(true);
  });
});
