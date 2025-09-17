import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";
import { AppStoreProvider } from "@/store/appStore";
import Dashboard from "@/pages/Dashboard";
import Simulator from "@/pages/Simulator";
import Placeholder from "@/pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppStoreProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulate" element={<Simulator />} />
              <Route path="/requests" element={<Placeholder title="Solicitudes de Ruleteo" />} />
              <Route path="/expenses" element={<Placeholder title="Gastos y Finanzas" />} />
              <Route path="/notifications" element={<Placeholder title="Notificaciones / Agenda" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
