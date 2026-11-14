"use server";

import Anthropic from "@anthropic-ai/sdk";
import { parseTabularAirData } from "@/lib/parsers/tabular-parser";
import { getPreviousBriefFromDb, saveBriefToDb } from "@/lib/db/neon";
import {
  CivicIntelligenceAnalysis,
  CivicIntelligenceAnalysisSchema,
  PersonaType,
  PERSONA_CONFIG
} from "@/types/air-quality";

export interface AnalyzeAirQualityResult {
  success: boolean;
  data?: CivicIntelligenceAnalysis;
  rawSummary?: any;
  error?: string;
}

export async function analyzeAirQualityAction(
  rawInput: string,
  persona: PersonaType = "ward_officer"
): Promise<AnalyzeAirQualityResult> {
  try {
    // 1. Validation & Input Sanitization
    if (!rawInput || typeof rawInput !== "string") {
      return { success: false, error: "Please provide valid tabular air quality data." };
    }

    if (rawInput.length > 500_000) {
      return { success: false, error: "Data payload exceeds 500KB limit. Please upload a smaller slice." };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "ANTHROPIC_API_KEY is not configured in server environment."
      };
    }

    // 2. Parse & Preprocess Tabular Data (Handles Messy CSV / TSV / Copy-Paste)
    const { summary, normalizedRows, rawSnippet } = parseTabularAirData(rawInput);

    // 3. Fetch Previous Brief from Neon PostgreSQL for Temporal Delta ("What Changed?")
    const previousBrief = await getPreviousBriefFromDb(persona);

    const personaInfo = PERSONA_CONFIG[persona] || PERSONA_CONFIG.ward_officer;

    // 4. Initialize Anthropic Client
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

    // 5. Build Structured Prompt with Persona & Evidence Traceability Directives
    const systemPrompt = `You are Atmos AI, an expert Civic Intelligence & Environmental Health Assistant.
Your mission is to turn messy, raw, or inconsistent air quality sensor data into prioritized, role-specific local civic actions.

TARGET PERSONA:
- Role: ${personaInfo.title}
- Scope: ${personaInfo.roleDescription}
- Practical Interventions they can actually take: ${personaInfo.exampleInterventions.join("; ")}

CRITICAL RULES:
1. HIGH EFFICIENCY & CONCISENESS: Output concise, direct, high-signal information. Do not write filler words.
2. TRACEABILITY: Every single hotspot, peak, and action justification MUST cite exact source evidence from the data (e.g. "[Station 3, Row #14 at 08:30 hrs - PM2.5: 284 µg/m³]"). Do not invent numbers.
3. HOTSPOTS: Return the top 3 most critical hotspots only.
4. DATA GAPS & RELIABILITY: Flag up to 3 most important missing sensors, unit mismatches, or glitch readings with row citations.
5. TEMPORAL DELTA ("WHAT CHANGED?"): Compare the current data with the previous brief (if provided below). Summarize in 2-3 sentences what changed, improving zones, and persistent hazards.
6. PERSONA-SPECIFIC ACTIONS: Provide exactly 3 prioritized, highly practical actions tailored to what this persona can execute.
7. DUAL COMMUNICATIONS:
   - 'internal_briefing_note': Crisp Markdown operational note (120-150 words) with SLAs and responsible teams.
   - 'citizen_advisory' in BOTH English (en) and Hindi (hi):
     * Standard advisory: 2 clear sentences.
     * Simple 4th-grade level advisory: 2 short sentences with basic words.
     * Vulnerable groups (Children, Elderly, Respiratory/Cardiac): Exactly 1 direct actionable sentence each.`;

    const previousBriefContext = previousBrief
      ? `PREVIOUS STORED BRIEF (for Temporal Comparison):
- Timestamp: ${previousBrief.created_at}
- Overall AQI Category: ${previousBrief.analysis.overall_aqi_category}
- Average PM2.5: ${previousBrief.analysis.average_pm25}
- Dominant Pollutant: ${previousBrief.analysis.dominant_pollutant}
- Previous Hotspots: ${previousBrief.analysis.hotspots.map((h) => `${h.location} (${h.peak_value})`).join(", ")}
- Previous Actions Taken: ${previousBrief.analysis.prioritized_actions.map((a) => a.action_title).join(", ")}`
      : `PREVIOUS STORED BRIEF: No previous record found in database. This is the baseline brief.`;

    const userPrompt = `Here is the current incoming air quality data:

DATA INGESTION SUMMARY:
- Total Rows: ${summary.rowCount}
- Stations / Monitors Detected: ${summary.stationsDetected.join(", ") || "Unknown"}
- Detected Pollutants: ${summary.detectedPollutants.join(", ") || "PM2.5"}
- Missing / Null Values Count: ${summary.missingValuesCount}
- Pre-detected Anomalies: ${summary.anomaliesDetected.join("; ") || "None"}

${previousBriefContext}

SAMPLE DATA ROWS (first 25 rows):
${JSON.stringify(summary.preprocessedRowsSample.slice(0, 25), null, 2)}

RAW TABLE SNIPPET:
\`\`\`
${rawSnippet.slice(0, 2500)}
\`\`\`

Generate a comprehensive civic intelligence analysis using the 'submit_civic_analysis' tool.`;

    // 6. Execute Claude API Call with Tool Calling for Guaranteed Schema Compliance
    const response = await anthropic.messages.create({
      model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      tools: [
        {
          name: "submit_civic_analysis",
          description: "Submits the structured civic intelligence analysis and recommendations",
          input_schema: {
            type: "object",
            properties: {
              executive_summary: { type: "string" },
              overall_aqi_category: {
                type: "string",
                enum: [
                  "Good",
                  "Moderate",
                  "Unhealthy for Sensitive Groups",
                  "Unhealthy",
                  "Very Unhealthy",
                  "Hazardous"
                ]
              },
              average_pm25: {
                type: "string",
                description: "Estimated average PM2.5 numerical value with unit ONLY, e.g. '118 µg/m³'. Do not write long sentences here."
              },
              dominant_pollutant: { type: "string" },
              hotspots: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    location: { type: "string" },
                    severity: { type: "string", enum: ["Moderate", "High", "Severe", "Critical"] },
                    primary_pollutant: { type: "string" },
                    peak_value: { type: "string" },
                    trace_citation: { type: "string" },
                    plain_language_cause: { type: "string" }
                  },
                  required: ["location", "severity", "primary_pollutant", "peak_value", "trace_citation", "plain_language_cause"]
                }
              },
              data_reliability_flags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    issue_type: {
                      type: "string",
                      enum: ["missing_sensor", "unit_mismatch", "flatline_anomaly", "irregular_timestamp"]
                    },
                    description: { type: "string" },
                    affected_station_or_row: { type: "string" }
                  },
                  required: ["issue_type", "description", "affected_station_or_row"]
                }
              },
              prioritized_actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    priority: { type: "number" },
                    action_title: { type: "string" },
                    action_detail: { type: "string" },
                    immediate_timeline: { type: "string" },
                    estimated_impact: { type: "string", enum: ["Critical", "High", "Medium"] },
                    trace_justification: { type: "string" }
                  },
                  required: ["priority", "action_title", "action_detail", "immediate_timeline", "estimated_impact", "trace_justification"]
                }
              },
              temporal_delta: {
                type: "object",
                properties: {
                  comparison_available: { type: "boolean" },
                  summary_of_changes: { type: "string" },
                  worsening_zones: { type: "array", items: { type: "string" } },
                  improving_zones: { type: "array", items: { type: "string" } },
                  persistent_hazards: { type: "array", items: { type: "string" } }
                },
                required: ["comparison_available", "summary_of_changes", "worsening_zones", "improving_zones", "persistent_hazards"]
              },
              internal_briefing_note: { type: "string" },
              citizen_advisory: {
                type: "object",
                properties: {
                  en: {
                    type: "object",
                    properties: {
                      standard_advisory: { type: "string" },
                      simple_grade4_advisory: { type: "string" },
                      vulnerable_groups: {
                        type: "object",
                        properties: {
                          children: { type: "string" },
                          elderly: { type: "string" },
                          respiratory_and_cardiac: { type: "string" }
                        },
                        required: ["children", "elderly", "respiratory_and_cardiac"]
                      }
                    },
                    required: ["standard_advisory", "simple_grade4_advisory", "vulnerable_groups"]
                  },
                  hi: {
                    type: "object",
                    properties: {
                      standard_advisory: { type: "string" },
                      simple_grade4_advisory: { type: "string" },
                      vulnerable_groups: {
                        type: "object",
                        properties: {
                          children: { type: "string" },
                          elderly: { type: "string" },
                          respiratory_and_cardiac: { type: "string" }
                        },
                        required: ["children", "elderly", "respiratory_and_cardiac"]
                      }
                    },
                    required: ["standard_advisory", "simple_grade4_advisory", "vulnerable_groups"]
                  }
                },
                required: ["en", "hi"]
              }
            },
            required: [
              "executive_summary",
              "overall_aqi_category",
              "average_pm25",
              "dominant_pollutant",
              "hotspots",
              "data_reliability_flags",
              "prioritized_actions",
              "temporal_delta",
              "internal_briefing_note",
              "citizen_advisory"
            ]
          }
        }
      ],
      tool_choice: { type: "tool", name: "submit_civic_analysis" }
    });

    console.log("Claude stop reason:", response.stop_reason);
    console.log("Claude usage:", response.usage);

    // Extract tool input
    const toolCall = response.content.find((block) => block.type === "tool_use");
    if (!toolCall || toolCall.type !== "tool_use") {
      console.log("Response content blocks:", response.content);
      throw new Error("AI did not produce structured tool output.");
    }

    const rawParsed: any = toolCall.input || {};
    console.log("Tool input keys received:", Object.keys(rawParsed));

    // Resilience safeguard: Ensure citizen_advisory and internal_briefing_note are never undefined
    if (!rawParsed.citizen_advisory || !rawParsed.citizen_advisory.en) {
      const aqiCat = rawParsed.overall_aqi_category || "Unhealthy";
      rawParsed.citizen_advisory = {
        en: {
          standard_advisory: `Air quality is currently ${aqiCat}. Limit prolonged outdoor activities and wear protective masks near hotspots.`,
          simple_grade4_advisory: `The air outside is dirty today. Stay indoors and keep windows closed so you do not breathe bad air.`,
          vulnerable_groups: {
            children: "Keep school children indoors during recess and cancel outdoor athletic activities.",
            elderly: "Senior citizens should remain inside well-ventilated rooms and avoid morning exertion.",
            respiratory_and_cardiac: "Individuals with asthma or heart conditions should keep medications handy and avoid exposure."
          }
        },
        hi: {
          standard_advisory: `वर्तमान वायु गुणवत्ता स्तर ${aqiCat} है। बाहर जाने से बचें और मास्क का उपयोग करें।`,
          simple_grade4_advisory: `आज बाहर की हवा खराब है। घर के अंदर रहें और खिड़कियां बंद रखें ताकि आप बीमार न पड़ें।`,
          vulnerable_groups: {
            children: "बच्चों को बाहर खेलने न दें और उन्हें घर के अंदर सुरक्षित रखें।",
            elderly: "बुजुर्ग घर के अंदर रहें और सुबह की सैर से बचें।",
            respiratory_and_cardiac: "दमा और सांस के मरीज अपनी दवाएं पास रखें और बाहर न निकलें।"
          }
        }
      };
    }

    if (!rawParsed.internal_briefing_note) {
      rawParsed.internal_briefing_note = `### Internal Briefing Note\n\n**Status:** ${rawParsed.overall_aqi_category || "Elevated"}\n\n**Summary:** ${rawParsed.executive_summary || "Immediate operational intervention required."}\n\n**Key Directives:**\n- Mobilize local response teams to identified hotspots.\n- Coordinate inter-departmental enforcement for emission curbs.`;
    }

    const validatedData = CivicIntelligenceAnalysisSchema.parse(rawParsed);

    // 7. Persist to Neon PostgreSQL Database for historical audits and future delta comparisons
    try {
      await saveBriefToDb({
        persona,
        analysis: validatedData,
        rawSummary: summary,
        stationCount: summary.stationsDetected.length
      });
    } catch (dbErr) {
      console.error("Failed to save to Neon DB:", dbErr);
      // Non-blocking for the immediate client return
    }

    return {
      success: true,
      data: validatedData,
      rawSummary: summary
    };
  } catch (error: any) {
    console.error("Error in analyzeAirQualityAction:", error);
    let errorMsg = error?.message || "An unexpected error occurred while analyzing air quality data.";
    if (error?.name === "ZodError" && Array.isArray(error.issues)) {
      errorMsg = error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join("; ");
    }
    return {
      success: false,
      error: errorMsg
    };
  }
}
