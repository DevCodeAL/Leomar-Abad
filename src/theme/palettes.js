/**
 * Palette registry. The `swatch` values are only used to paint the selector
 * dots — the live UI colours come from the CSS variables in
 * src/styles/palettes.css, keyed by the same `id`.
 */
export const palettes = [
  {
    id: "default",
    name: "Default",
    description: "The original DevCode green",
    swatch: { dark: "#1ed760", light: "#16803c" },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Blue and cyan",
    swatch: { dark: "#22a7ee", light: "#0b6fae" },
  },
  {
    id: "emerald",
    name: "Emerald",
    description: "Green and teal",
    swatch: { dark: "#11c48f", light: "#087f5b" },
  },
  {
    id: "violet",
    name: "Violet",
    description: "Purple and indigo",
    swatch: { dark: "#9d7bf6", light: "#6d3fd4" },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Orange and pink",
    swatch: { dark: "#f5813c", light: "#c2530f" },
  },
];

export const paletteIds = palettes.map((palette) => palette.id);

export const DEFAULT_PALETTE = "default";
export const DEFAULT_THEME = "dark";
