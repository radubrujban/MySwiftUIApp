import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GovernmentSecurityWarning from "@/components/government-security-warning";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Missions from "@/pages/missions";
import MissionDetails from "@/pages/mission-details";
import Settings from "@/pages/settings";
import ScanPage from "@/pages/scan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/missions" component={Missions} />
      <Route path="/mission/:id" component={MissionDetails} />

      <Route path="/scan" component={ScanPage} />
      <Route path="/settings" component={Settings} />
      <Route component={Dashboard} />
    </Switch>
  );
}

function App() {
  const [securityAccepted, setSecurityAccepted] = useState(false);

  useEffect(() => {
    // Check if user previously acknowledged
    const acknowledged = localStorage.getItem('government-security-acknowledged');
    if (acknowledged) {
      try {
        const data = JSON.parse(acknowledged);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        if (data.timestamp > thirtyDaysAgo) {
          setSecurityAccepted(true);
        }
      } catch (error) {
        console.error('Error parsing security acknowledgment:', error);
      }
    }
  }, []);

  const handleSecurityAccept = () => {
    setSecurityAccepted(true);
    
    // Save acknowledgment to remember for 30 days
    localStorage.setItem('government-security-acknowledged', JSON.stringify({
      timestamp: Date.now(),
      version: '1.0'
    }));
  };

  const handleSecurityDecline = () => {
    window.location.href = "https://www.defense.gov";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Toaster />
          {!securityAccepted ? (
            <GovernmentSecurityWarning onAccept={handleSecurityAccept} />
          ) : (
            <div className="dark min-h-screen bg-[var(--aviation-dark)] ios-safe-area">
              <Router />
            </div>
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
