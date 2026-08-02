import { createContext } from "react";

/** Shared by <ThemeProvider> and useTheme(); kept separate so both files
 *  export exactly one thing and stay Fast Refresh friendly. */
export const ThemeContext = createContext(null);
