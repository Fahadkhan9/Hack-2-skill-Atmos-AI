# Atmos AI — Civic Intelligence for Local Air Quality Interventions

> An AI-driven civic intelligence platform designed for municipal ward officers, housing societies (RWAs), and school administrators to turn raw, messy air quality data into actionable, localized interventions.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Anthropic Claude](https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-indigo?style=flat&logo=anthropic)](https://www.anthropic.com/)
[![Neon PostgreSQL](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-green?style=flat&logo=vitest)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue?style=flat)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🌟 Key Capabilities & Hackathon Assessment Alignment

### 1. Robust Messy Data Ingestion & Anomaly Auditing
* **Flexible Parser**: Handles raw, inconsistently formatted pollutant readings ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{AQI}$) from CSV, TSV, or copy-pasted text.
* **Auto-Normalization**: Cleans column variations (`PM 2.5`, `pm25`, `Location`, `Area`) and embedded units (`210 ug/m3` $\rightarrow$ `210`).
* **Sensor Gap & Glitch Auditing**: Clearly flags missing readings, disconnected sensors, and impossible negative readings (`-999`) with row-level citations.

### 2. Persona-Tailored Civic Interventions
* Contextual action matrices customized to what each authority has the legal and operational power to execute:
  * 🏛️ **Ward Officer**: Water mist cannons, freight traffic rerouting, wet-sweeping, open-waste burning patrols.
  * 🏢 **Housing Society (RWA)**: Diesel generator runtime restrictions, indoor HEPA filtration, morning jogger advisories.
  * 🏫 **School Principal**: Moving physical sports indoors, bus window closures, classroom air purifiers.

### 3. Interactive Civic Ward Hotspot Map
* Real-time radar grid plotting ward sectors with severity color-coded pulsing nodes (Critical, Severe, High, Moderate).
* Interactive **Sector Inspector** with exact observed values, probable local causes, and underlying data citations.

### 4. 100% Evidence Traceability
* Zero AI hallucinations: every identified hotspot, peak value, and intervention cites exact data source telemetry:
  * Example: `[Station 12, Row #3, 08:00 AM — PM2.5: 385 µg/m³]`.

### 5. Temporal Delta Progression ("What Changed?")
* Powered by **Neon Serverless PostgreSQL** to automatically compare new briefs against previous runs:
  * Visual Before vs. Current intervention progression chart with percentage reduction badges ($\downarrow 67\%$).
  * Automatic categorization of Improving Zones, Deteriorating Zones, and Persistent Hazards.

### 6. Dual Multi-Audience Communication Studio
* **Internal Briefing Note**: Technical, SLA-driven operational directive for municipal authorities.
* **Citizen Health Advisory**:
  * Multi-lingual: **English 🇬🇧** and **हिन्दी 🇮🇳**.
  * Multi-reading level: **Standard Public** vs. **4th-Grade Simple (Children/Low-Literacy)**.
  * Dedicated health advisories for high-risk groups: **Children**, **Senior Citizens**, and **Asthma/Cardiac Patients**.
* **1-Click Official Notice Export**: Instant print / PDF civic bulletin export.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router, Server Actions, TypeScript)
* **AI Model**: Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`) with structured JSON schema
* **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
* **Styling & UI**: Tailwind CSS v4, Lucide React (WCAG 2.1 AA accessible)
* **Testing**: Vitest (`npm test`)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Fahadkhan9/Hack-2-skill-Atmos-AI.git
cd Hack-2-skill-Atmos-AI
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```
Add your credentials:
```env
DATABASE_URL="postgresql://neondb_owner:password@your-neon-host/neondb?sslmode=require"
ANTHROPIC_API_KEY="sk-ant-your-claude-api-key"
ANTHROPIC_MODEL="claude-sonnet-4-6"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Verifies CSV parsing, header normalization, unit stripping, anomaly auditing, and Zod output schemas.

---

## 👥 Authors
* **Fahad Khan** ([@Fahadkhan9](https://github.com/Fahadkhan9))
