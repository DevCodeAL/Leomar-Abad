import {
  Bot,
  Gauge,
  Globe,
  Layers,
  Network,
  PenTool,
  Server,
  Smartphone,
  Workflow,
} from "lucide-react";
import { services as serviceData } from "../../lib/portfolio/services.js";

/**
 * Services for the card grid.
 *
 * Copy lives in `lib/portfolio/services.js`, shared with the AI assistant's
 * serverless function; this module resolves each `icon` key to its glyph.
 */
const SERVICE_ICONS = {
  layers: Layers,
  globe: Globe,
  smartphone: Smartphone,
  server: Server,
  gauge: Gauge,
  pen: PenTool,
  bot: Bot,
  workflow: Workflow,
  network: Network,
};

export const services = serviceData.map((service) => ({
  ...service,
  icon: SERVICE_ICONS[service.icon] ?? Layers,
}));
