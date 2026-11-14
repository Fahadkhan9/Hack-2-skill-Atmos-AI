import { neon } from "@neondatabase/serverless";
import { CivicIntelligenceAnalysis, PersonaType, ParsedDataSummary } from "@/types/air-quality";

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }
  return neon(connectionString);
}

export interface StoredCivicBrief {
  id: string;
  persona: PersonaType;
  created_at: string;
  analysis: CivicIntelligenceAnalysis;
  raw_summary: ParsedDataSummary;
  station_count: number;
}

// Auto-initialize table schema if it doesn't exist
export async function initDbSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS civic_air_briefs (
      id TEXT PRIMARY KEY,
      persona TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      analysis JSONB NOT NULL,
      raw_summary JSONB NOT NULL,
      station_count INT NOT NULL
    );
  `;
}

// Save a brief into Neon PostgreSQL
export async function saveBriefToDb(data: {
  persona: PersonaType;
  analysis: CivicIntelligenceAnalysis;
  rawSummary: ParsedDataSummary;
  stationCount: number;
}): Promise<StoredCivicBrief> {
  const sql = getDb();
  await initDbSchema();

  const id = `brief_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  await sql`
    INSERT INTO civic_air_briefs (id, persona, created_at, analysis, raw_summary, station_count)
    VALUES (
      ${id},
      ${data.persona},
      ${now},
      ${JSON.stringify(data.analysis)},
      ${JSON.stringify(data.rawSummary)},
      ${data.stationCount}
    )
  `;

  return {
    id,
    persona: data.persona,
    created_at: now,
    analysis: data.analysis,
    raw_summary: data.rawSummary,
    station_count: data.stationCount
  };
}

// Get the most recent brief (to compare what changed)
export async function getPreviousBriefFromDb(persona?: PersonaType): Promise<StoredCivicBrief | null> {
  try {
    const sql = getDb();
    await initDbSchema();

    let rows;
    if (persona) {
      rows = await sql`
        SELECT id, persona, created_at, analysis, raw_summary, station_count
        FROM civic_air_briefs
        WHERE persona = ${persona}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    } else {
      rows = await sql`
        SELECT id, persona, created_at, analysis, raw_summary, station_count
        FROM civic_air_briefs
        ORDER BY created_at DESC
        LIMIT 1
      `;
    }

    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      persona: row.persona,
      created_at: row.created_at,
      analysis: typeof row.analysis === "string" ? JSON.parse(row.analysis) : row.analysis,
      raw_summary: typeof row.raw_summary === "string" ? JSON.parse(row.raw_summary) : row.raw_summary,
      station_count: row.station_count
    };
  } catch (err) {
    console.warn("Could not query previous brief from DB, proceeding without delta:", err);
    return null;
  }
}

// Fetch all historical briefs
export async function getAllHistoricalBriefs(): Promise<StoredCivicBrief[]> {
  try {
    const sql = getDb();
    await initDbSchema();
    const rows = await sql`
      SELECT id, persona, created_at, analysis, raw_summary, station_count
      FROM civic_air_briefs
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return rows.map((row: any) => ({
      id: row.id,
      persona: row.persona,
      created_at: row.created_at,
      analysis: typeof row.analysis === "string" ? JSON.parse(row.analysis) : row.analysis,
      raw_summary: typeof row.raw_summary === "string" ? JSON.parse(row.raw_summary) : row.raw_summary,
      station_count: row.station_count
    }));
  } catch (err) {
    console.warn("Could not fetch historical briefs:", err);
    return [];
  }
}
