import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atmos AI — Civic Intelligence for Local Air Interventions",
  description: "AI-driven civic intelligence platform enabling local authorities, housing societies, and schools to turn raw air quality data into actionable interventions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
