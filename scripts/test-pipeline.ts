import { parseTabularAirData } from "../src/lib/parsers/tabular-parser.js";

// Sample messy dataset representing real-world sensor logs with inconsistencies
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

console.log("Testing tabular parser...");
const { summary, anomaliesDetected } = parseTabularAirData(MESSY_SAMPLE);
console.log("Parsed rows:", summary.rowCount);
console.log("Stations detected:", summary.stationsDetected);
console.log("Pollutants detected:", summary.detectedPollutants);
console.log("Missing values:", summary.missingValuesCount);
console.log("Anomalies flagged:", summary.anomaliesDetected);
