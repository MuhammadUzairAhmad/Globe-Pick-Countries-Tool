import type { Metadata } from "next";
import { countries } from "@/data/countries";
import { ThemeShowcase } from "@/features/theme-showcase/theme-showcase";

export const metadata: Metadata = {
  title: "Dark Theme Studio",
  description: "Compare six dark color palettes for GlobePick.",
  robots: { index: false, follow: false },
};

export default function ThemeShowcasePage() {
  const samples = ["JP", "ZA", "BR"].map((id) =>
    countries.find((country) => country.id === id)!,
  );
  return <ThemeShowcase samples={samples} />;
}
