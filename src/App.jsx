import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ScrollToHash } from "@/components/layout/ScrollToHash";
import { RouteFallback } from "@/components/layout/RouteFallback";

/* The Markdown renderer and syntax highlighter are only needed once someone
   opens the blog, and together they are larger than the entire dashboard.
   Splitting them out keeps the portfolio — still the primary experience —
   loading at its original weight. */
const BlogList = lazy(() =>
  import("@/components/blog/BlogList").then((m) => ({ default: m.BlogList })),
);
const BlogArticle = lazy(() =>
  import("@/components/blog/BlogArticle").then((m) => ({
    default: m.BlogArticle,
  })),
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToHash />
        <DashboardLayout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
