import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import NotFound from "./pages/NotFound";

// Public Pages
import { PublicLayout } from "./components/public/PublicLayout";
import PublicHome from "./pages/public/Home";
import PromiseTracker from "./pages/public/PromiseTracker";
import PromiseDetail from "./pages/public/PromiseDetail";
import PromisesByTag from "./pages/public/PromisesByTag";
import Membership from "./pages/public/Membership";
import Methodology from "./pages/public/Methodology";
import First100Days from "./pages/public/First100Days";
import PublicIndicators from "./pages/public/Indicators";
import Actions from "./pages/public/Actions";
import { Appointments } from "./pages/public/Appointments";
import { BrandAssets } from "./pages/public/BrandAssets";

// CMS Pages
import CMSLogin from "./pages/cms/CMSLogin";
import CMSLayout from "./pages/cms/CMSLayout";
import Dashboard from "./pages/cms/Dashboard";
import Promises from "./pages/cms/Promises";
import PromiseEdit from "./pages/cms/PromiseEdit";
import Indicators from "./pages/cms/Indicators";
import IndicatorEdit from "./pages/cms/IndicatorEdit";
import Import from "./pages/cms/Import";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsListener />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<PublicHome />} />
              <Route path="/promises" element={<PromiseTracker />} />
              <Route path="/promises/tag/:tag" element={<PromisesByTag />} />
              <Route path="/promises/:slug" element={<PromiseDetail />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/about" element={<Methodology />} />
              <Route path="/zohran-mamdani-first-100-days" element={<First100Days />} />
              <Route path="/first100days" element={<Navigate to="/zohran-mamdani-first-100-days" replace />} />
              <Route path="/indicators" element={<PublicIndicators />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/brand-assets" element={<BrandAssets />} />
            </Route>
            
            {/* CMS Routes */}
            <Route path="/rat-control/cms/admin" element={<CMSLogin />} />
            <Route path="/rat-control/cms" element={<CMSLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="promises" element={<Promises />} />
              <Route path="promises/:id" element={<PromiseEdit />} />
              <Route path="indicators" element={<Indicators />} />
              <Route path="indicators/:id" element={<IndicatorEdit />} />
              <Route path="import" element={<Import />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
