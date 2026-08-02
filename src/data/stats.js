import { CloudUpload, FolderGit2, Layers, MessageSquareQuote } from "lucide-react";
import { projects } from "./projects";
import { totalSkills } from "./skills";
import { testimonials } from "./testimonials";

/**
 * Every figure is counted from the real content in ./projects, ./skills and
 * ./testimonials — nothing is typed in by hand, so the numbers can never drift
 * away from what the portfolio actually shows.
 */
export const stats = [
  {
    label: "Projects",
    value: projects.length,
    caption: "Built & shipped",
    icon: FolderGit2,
  },
  {
    label: "Live Deployments",
    value: projects.filter((project) => project.demo).length,
    caption: "Publicly reachable",
    icon: CloudUpload,
  },
  {
    label: "Technologies",
    value: totalSkills,
    caption: "In my toolkit",
    icon: Layers,
  },
  {
    label: "Recommendations",
    value: testimonials.length,
    caption: "Clients, mentors & peers",
    icon: MessageSquareQuote,
  },
];
