import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ClientHunter from "@/pages/ClientHunter";
import ProposalWriter from "@/pages/ProposalWriter";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import { useEffect } from "react";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client-hunter" component={ClientHunter} />
      <Route path="/proposal-writer" component={ProposalWriter} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 pt-16">
              <Router />
            </main>
            <FloatingWhatsApp />
            <ScrollToTop />
          </div>
        </WouterRouter>
        <Toaster theme="dark" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;