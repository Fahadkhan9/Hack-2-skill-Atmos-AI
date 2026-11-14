# Hack-2-skill-Atmos-AI

## Atmos AI — Civic Intelligence for Local Air Quality Interventions

An AI-driven civic intelligence platform designed for municipal ward officers, housing societies (RWAs), and school administrators to turn raw, messy air quality data into actionable, localized interventions.

### Key Capabilities
- **Messy Tabular Data Ingestion**: Handles raw, inconsistently formatted pollutant readings ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, AQI) with missing data and unit discrepancies.
- **Persona-Tailored Interventions**: Prioritized, role-specific action matrices for Ward Officers, Housing Societies, and Schools.
- **Evidence Traceability**: Every finding, hotspot, and recommendation is strictly traceable to underlying sensor timestamps and row data.
- **Temporal Delta Analysis**: Automatically tracks what changed compared to previous briefs (worsening vs improving zones).
- **Dual Communication Outputs**: Generates operational **Internal Briefing Notes** for authorities and **Citizen Advisories** in multiple languages and reading levels, with dedicated health advisories for children, seniors, and sensitive groups.

### Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS, Lucide React (WCAG 2.1 AA accessible)
- **AI Engine**: Anthropic Claude 3.5 Sonnet
- **Data Engine**: PapaParse, Zod Validation

### Getting Started

1. Clone repository:
   ```bash
   git clone https://github.com/Fahadkhan9/Hack-2-skill-Atmos-AI.git
   cd Hack-2-skill-Atmos-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.local.example .env.local
   # Add your ANTHROPIC_API_KEY in .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
