/**
 * Projects — re-exported from the isomorphic data layer.
 *
 * The records themselves live in `lib/portfolio/projects.js` so the AI
 * assistant's serverless function can read them without importing anything
 * from `src/`. This file is the import path the UI has always used, so
 * nothing in the dashboard had to change.
 */
export {
  projects,
  featuredProject,
  gridProjects,
  projectCategories,
} from "../../lib/portfolio/projects.js";
