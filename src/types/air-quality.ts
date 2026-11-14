import { z } from "zod";

export type PersonaType = "ward_officer" | "housing_society" | "school";

export interface PersonaMetadata {
  id: PersonaType;
  title: string;
  roleDescription: string;
  badge: string;
  exampleInterventions: string[];
}

export const PERSONA_CONFIG: Record<PersonaType, PersonaMetadata> = {
  ward_officer: {
    id: "ward_officer",
    title: "Ward Officer / Municipal Authority",
    roleDescription: "Responsible for municipal compliance, dust control, traffic rerouting, and street-level mitigations.",
    badge: "🏛️ Municipal Ward Command",
    exampleInterventions: [
      "Deploy anti-smog water mist cannons to arterial roads",
      "Divert heavy diesel commercial transport to bypass roads",
      "Mobilize quick-response patrols against open municipal solid waste burning",
      "Enforce mandatory wet-sweeping on construction corridors"
    ]
  },
  housing_society: {
    id: "housing_society",
    title: "Housing Society / RWA Admin",
    roleDescription: "Responsible for residential community health, backup power operations, and neighborhood protocols.",
    badge: "🏢 Residential Society / RWA",
    exampleInterventions: [
      "Restrict diesel generator (DG) operations to emergency-only slots (pause non-essential morning backup)",
      "Advise elderly residents and joggers to avoid morning outdoor recreation",
      "Turn on centralized HEPA filtration in clubhouse and common indoor spaces",
      "Post real-time AQI boards at all society entry gates"
    ]
  },
  school: {
    id: "school",
    title: "School Principal / Administrator",
    roleDescription: "Responsible for child health protection, student transportation, and school activity safety.",
    badge: "🏫 School & Daycare Administration",
    exampleInterventions: [
      "Move morning assemblies and sports/physical education classes indoors",
      "Ensure school buses keep windows shut during transit through known hotspots",
      "Equip primary grade classrooms with active air purification units",
      "Issue health advisories to parents for children with known pediatric asthma"
    ]
  }
};

// Structured Output Schema for Claude AI
export const HotspotSchema = z.object({
  location: z.string().describe("Specific station, ward, or street hotspot identified"),
  severity: z.enum(["Moderate", "High", "Severe", "Critical"]),
  primary_pollutant: z.string().describe("E.g., PM2.5, PM10, NO2"),
  peak_value: z.string().describe("Peak observed value with unit, e.g., 284 µg/m³"),
  trace_citation: z.string().describe("Exact source citation: e.g. 'Station 4 (Row 18) at 08:30 hrs'"),
  plain_language_cause: z.string().describe("Likely cause in plain language (e.g. morning peak freight traffic, localized biomass burning)")
});

export const DataReliabilityFlagSchema = z.object({
  issue_type: z.enum(["missing_sensor", "unit_mismatch", "flatline_anomaly", "irregular_timestamp"]),
  description: z.string().describe("Plain language description of the data gap or anomaly"),
  affected_station_or_row: z.string().describe("Specific row number, station name, or parameter affected")
});

export const PrioritizedActionSchema = z.object({
  priority: z.number().int().min(1),
  action_title: z.string().describe("Short punchy action name"),
  action_detail: z.string().describe("Specific, operational steps tailored to the selected persona"),
  immediate_timeline: z.string().describe("E.g., Next 2 hours, Before 07:00 AM, Immediate"),
  estimated_impact: z.enum(["Critical", "High", "Medium"]),
  trace_justification: z.string().describe("Data evidence justifying why this action is required now")
});

export const TemporalDeltaSchema = z.object({
  comparison_available: z.boolean(),
  summary_of_changes: z.string().describe("Clear summary comparing this brief with previous conditions: what worsened, what improved"),
  worsening_zones: z.array(z.string()).describe("Locations or metrics that deteriorated"),
  improving_zones: z.array(z.string()).describe("Locations or metrics that got better"),
  persistent_hazards: z.array(z.string()).describe("Locations that remain dangerously elevated")
});

export const CitizenAdvisoryContentSchema = z.object({
  standard_advisory: z.string().describe("Standard clear language advisory for general public"),
  simple_grade4_advisory: z.string().describe("Simplified advisory written at 4th-grade reading level (short sentences, easy words)"),
  vulnerable_groups: z.object({
    children: z.string().describe("Specific advice for infants and school children"),
    elderly: z.string().describe("Specific advice for senior citizens and grandparents"),
    respiratory_and_cardiac: z.string().describe("Specific advice for people with asthma, COPD, or heart disease")
  })
});

export const CivicIntelligenceAnalysisSchema = z.object({
  executive_summary: z.string().describe("2-3 sentence high-level overview in plain language"),
  overall_aqi_category: z.enum(["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"]),
  average_pm25: z.string().describe("Estimated average PM2.5 with units"),
  dominant_pollutant: z.string(),
  hotspots: z.array(HotspotSchema),
  data_reliability_flags: z.array(DataReliabilityFlagSchema),
  prioritized_actions: z.array(PrioritizedActionSchema),
  temporal_delta: TemporalDeltaSchema,
  internal_briefing_note: z.string().describe("Formal internal briefing note formatted in clean Markdown with timestamps, responsible departments, and operational directives"),
  citizen_advisory: z.object({
    en: CitizenAdvisoryContentSchema,
    hi: CitizenAdvisoryContentSchema
  })
});

export type CivicIntelligenceAnalysis = z.infer<typeof CivicIntelligenceAnalysisSchema>;
export type Hotspot = z.infer<typeof HotspotSchema>;
export type DataReliabilityFlag = z.infer<typeof DataReliabilityFlagSchema>;
export type PrioritizedAction = z.infer<typeof PrioritizedActionSchema>;
export type TemporalDelta = z.infer<typeof TemporalDeltaSchema>;
export type CitizenAdvisoryContent = z.infer<typeof CitizenAdvisoryContentSchema>;

export interface ParsedDataSummary {
  rowCount: number;
  columnsDetected: string[];
  stationsDetected: string[];
  detectedPollutants: string[];
  missingValuesCount: number;
  preprocessedRowsSample: Record<string, any>[];
  anomaliesDetected: string[];
}

