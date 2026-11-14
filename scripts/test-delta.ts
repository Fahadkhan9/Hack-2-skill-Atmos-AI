import { analyzeAirQualityAction } from "../src/app/actions/analyze-air";

// Afternoon follow-up dataset showing mist cannon deployment worked in Ward 7, but Ward 12 is still high
const AFTERNOON_UPDATE = `
Location, Time, PM2.5, PM10, NO2, Notes
Ward 7 - Market, 02:00 PM, 95 ug/m3, 160, 38, mist cannons deployed, freight diverted
Ward 4 - Green Park, 02:00 PM, 38, 70, 15, clean air pocket
Ward 12 - Ind Area, 02:00 PM, 340, 480, 98, furnace partial shutdown
Ward 9 - School Zone, 02:00 PM, 80, 130, 25, students dismissed safely
Ward 2 - Hospital, 02:00 PM, 65, 110, 20, backup sensor online
`;

async function main() {
  console.log("Testing 2nd brief to verify Temporal Delta Engine (What Changed?)...");
  const result = await analyzeAirQualityAction(AFTERNOON_UPDATE, "ward_officer");

  if (!result.success) {
    console.error("Delta test failed:", result.error);
    process.exit(1);
  }

  console.log("\n=== TEMPORAL DELTA COMPARISON ===");
  console.log("Summary of Changes:", result.data?.temporal_delta.summary_of_changes);
  console.log("Improving Zones:", result.data?.temporal_delta.improving_zones);
  console.log("Worsening Zones:", result.data?.temporal_delta.worsening_zones);
  console.log("Persistent Hazards:", result.data?.temporal_delta.persistent_hazards);
  console.log("\nDelta comparison test passed with flying colors!");
}

main().catch(console.error);
