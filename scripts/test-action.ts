import { analyzeAirQualityAction } from "../src/app/actions/analyze-air";

const MESSY_SAMPLE = `
Location, Time, PM2.5, PM10, NO2, Notes
Ward 7 - Market, 08:00 AM, 210 ug/m3, 340, 65, heavy freight trucks idling
Ward 4 - Green Park, 08:00 AM, 45, 90, 18, normal baseline
Ward 12 - Ind Area, 08:00 AM, 385, 520, 110, furnace operations
Ward 9 - School Zone, 08:00 AM, 195, 280, 42, morning drop-off congestion
Ward 2 - Hospital, 08:00 AM, -, 115, 22, sensor PM2.5 disconnected
Ward 7 - Market, 09:00 AM, 285, 410, 85, traffic standstill
Ward 12 - Ind Area, 09:00 AM, 410, 560, 125, thick plume visible
Ward 4 - Green Park, 09:00 AM, 52, 95, 20, slight drift
Ward 9 - School Zone, 09:00 AM, 230, 310, 48, ongoing sports practice
Ward 15 - Highway, 09:00 AM, -999, 450, 95, glitch reading
`;

async function main() {
  console.log("Testing end-to-end analyzeAirQualityAction with Ward Officer persona...");
  const result = await analyzeAirQualityAction(MESSY_SAMPLE, "ward_officer");

  if (!result.success) {
    console.error("Analysis failed:", result.error);
    process.exit(1);
  }

  console.log("\n--- RESULT ANALYSIS ---");
  console.log("Overall AQI Category:", result.data?.overall_aqi_category);
  console.log("Executive Summary:", result.data?.executive_summary);
  console.log("Hotspots Count:", result.data?.hotspots.length);
  console.log("First Hotspot Trace Citation:", result.data?.hotspots[0]?.trace_citation);
  console.log("Data Reliability Flags:", result.data?.data_reliability_flags);
  console.log("Prioritized Actions:", result.data?.prioritized_actions.map(a => `${a.priority}. ${a.action_title} (${a.estimated_impact})`));
  console.log("Temporal Delta:", result.data?.temporal_delta.summary_of_changes);
  console.log("Citizen Advisory (English Grade 4):", result.data?.citizen_advisory.en.simple_grade4_advisory);
  console.log("Citizen Advisory (Hindi Children):", result.data?.citizen_advisory.hi.vulnerable_groups.children);
  console.log("\nPipeline successfully verified with Claude and Neon DB!");
}

main().catch(console.error);
