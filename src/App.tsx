import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
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
  </QueryClientProvider>
);

export default App;
