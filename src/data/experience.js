import { Briefcase, Building2, GraduationCap, Rocket } from "lucide-react";
import { experience as experienceData } from "../../lib/portfolio/experience.js";

/**
 * Timeline entries for the UI.
 *
 * The entries live in `lib/portfolio/experience.js`, shared with the AI
 * assistant's serverless function; this module swaps each `icon` key for its
 * lucide component, matching the pattern `focusAreas` already used.
 */
const ENTRY_ICONS = {
  rocket: Rocket,
  graduation: GraduationCap,
  briefcase: Briefcase,
  building: Building2,
};

export const experience = experienceData.map((entry) => ({
  ...entry,
  icon: ENTRY_ICONS[entry.icon] ?? Briefcase,
}));
