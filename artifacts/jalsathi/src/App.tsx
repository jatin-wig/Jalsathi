import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/ui/Toast";
import { IssueProvider } from "./context/IssueContext";

// Components
import Header from "./components/layout/Header";

// Pages
import ReportPage from "./pages/ReportPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/not-found";

import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={ReportPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <IssueProvider>
        <ToastProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ToastProvider>
      </IssueProvider>
    </LanguageProvider>
  </QueryClientProvider>
);
}

export default App;
