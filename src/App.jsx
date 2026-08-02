import { ThemeProvider } from "@/theme/ThemeProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function App() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ThemeProvider>
  );
}
