import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import NotFound from "./pages/NotFound";

// Public Pages (eagerly loaded)
import { PublicLayout } from "./components/public/PublicLayout";
import PublicHome from "./pages/public/Home";
import PromiseTracker from "./pages/public/PromiseTracker";
import PromiseDetail from "./pages/public/PromiseDetail";
import PromisesByTag from "./pages/public/PromisesByTag";
import Membership from "./pages/public/Membership";
import Methodology from "./pages/public/Methodology";
import First100Days from "./pages/public/First100Days";
import First100DayDetail from "./pages/public/First100DayDetail";
import PublicIndicators from "./pages/public/Indicators";
import Actions from "./pages/public/Actions";
import AppointmentTracker from "./pages/public/AppointmentTracker";
import { BrandAssets } from "./pages/public/BrandAssets";
import BudgetLanding from "./pages/public/BudgetLanding";
import BudgetFY2027 from "./pages/public/Budget";
import BuildYourBudget from "./pages/public/BuildYourBudget";
import SharedBudget from "./pages/public/SharedBudget";
import BudgetResults from "./pages/public/BudgetResults";
import RatifyRedirect from "./pages/public/RatifyRedirect";

// CMS Pages — lazy-loaded to avoid exposing CMS code in public bundles
const CMSLogin = lazy(() => import("./pages/cms/CMSLogin"));
const CMSLayout = lazy(() => import("./pages/cms/CMSLayout"));
const Dashboard = lazy(() => import("./pages/cms/Dashboard"));
const Promises = lazy(() => import("./pages/cms/Promises"));
const PromiseEdit = lazy(() => import("./pages/cms/PromiseEdit"));
const Indicators = lazy(() => import("./pages/cms/Indicators"));
const IndicatorEdit = lazy(() => import("./pages/cms/IndicatorEdit"));
const Import = lazy(() => import("./pages/cms/Import"));
const Memberships = lazy(() => import("./pages/cms/Memberships"));
const First100DaysCMS = lazy(() => import("./pages/cms/First100Days"));
const First100DayEdit = lazy(() => import("./pages/cms/First100DayEdit"));
const AppointmentsCMS = lazy(() => import("./pages/cms/Appointments"));
const AppointmentEdit = lazy(() => import("./pages/cms/AppointmentEdit"));
const Users = lazy(() => import("./pages/cms/Users"));
const ChangePassword = lazy(() => import("./pages/cms/ChangePassword"));
const BudgetSubmissions = lazy(() => import("./pages/cms/BudgetSubmissions"));

const queryClient = new QueryClient();

const CMSLoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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
              <Route path="/zohran-mamdani-first-100-days/:year/:month/:day" element={<First100DayDetail />} />
              <Route path="/first100days" element={<Navigate to="/zohran-mamdani-first-100-days" replace />} />
              <Route path="/indicators" element={<PublicIndicators />} />
              <Route path="/actions" element={<Actions />} />
              <Route path="/zohran-mamdani-appointment-tracker" element={<AppointmentTracker />} />
              <Route path="/appointments" element={<Navigate to="/zohran-mamdani-appointment-tracker" replace />} />
              <Route path="/brand-assets" element={<BrandAssets />} />
              <Route path="/budget" element={<BudgetLanding />} />
              <Route path="/budget/FY2027" element={<BudgetFY2027 />} />
              <Route path="/build-your-budget" element={<BuildYourBudget />} />
              <Route path="/budget/shared/:shareId" element={<SharedBudget />} />
              <Route path="/budget/results" element={<BudgetResults />} />
              <Route path="/promises/:slug/ratify" element={<RatifyRedirect type="promise" />} />
              <Route path="/zohran-mamdani-first-100-days/:year/:month/:day/ratify" element={<RatifyRedirect type="first100day" />} />
            </Route>
            
            {/* CMS Routes — lazy-loaded and auth-gated */}
            <Route path="/rat-control/cms/admin" element={
              <Suspense fallback={<CMSLoadingFallback />}>
                <CMSLogin />
              </Suspense>
            } />
            <Route path="/rat-control/cms/*" element={
              <Suspense fallback={<CMSLoadingFallback />}>
                <CMSLayout />
              </Suspense>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={
                <Suspense fallback={<CMSLoadingFallback />}><Dashboard /></Suspense>
              } />
              <Route path="promises" element={
                <Suspense fallback={<CMSLoadingFallback />}><Promises /></Suspense>
              } />
              <Route path="promises/:id" element={
                <Suspense fallback={<CMSLoadingFallback />}><PromiseEdit /></Suspense>
              } />
              <Route path="indicators" element={
                <Suspense fallback={<CMSLoadingFallback />}><Indicators /></Suspense>
              } />
              <Route path="indicators/:id" element={
                <Suspense fallback={<CMSLoadingFallback />}><IndicatorEdit /></Suspense>
              } />
              <Route path="first100days" element={
                <Suspense fallback={<CMSLoadingFallback />}><First100DaysCMS /></Suspense>
              } />
              <Route path="first100days/:id" element={
                <Suspense fallback={<CMSLoadingFallback />}><First100DayEdit /></Suspense>
              } />
              <Route path="appointments" element={
                <Suspense fallback={<CMSLoadingFallback />}><AppointmentsCMS /></Suspense>
              } />
              <Route path="appointments/:id" element={
                <Suspense fallback={<CMSLoadingFallback />}><AppointmentEdit /></Suspense>
              } />
              <Route path="memberships" element={
                <Suspense fallback={<CMSLoadingFallback />}><Memberships /></Suspense>
              } />
              <Route path="budget-submissions" element={
                <Suspense fallback={<CMSLoadingFallback />}><BudgetSubmissions /></Suspense>
              } />
              <Route path="import" element={
                <Suspense fallback={<CMSLoadingFallback />}><Import /></Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<CMSLoadingFallback />}><Users /></Suspense>
              } />
              <Route path="change-password" element={
                <Suspense fallback={<CMSLoadingFallback />}><ChangePassword /></Suspense>
              } />
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
