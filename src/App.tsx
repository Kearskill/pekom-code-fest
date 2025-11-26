import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";
import { LanguageToggle } from "./components/languageToggle";
import { LanguageProvider } from "./contexts/LanguageContext";
import { OnboardingPage, UserPreferences } from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preferences = localStorage.getItem("userPreferences");
    if (preferences) {
      setShowOnboarding(false);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));

    const lang = preferences.userType === "local" ? "my" : "en";
    localStorage.setItem("language", lang);

    setShowOnboarding(false);
  };

  if (isLoading) return null;

  if (showOnboarding) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OnboardingPage onComplete={handleOnboardingComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageToggle />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            <BottomNav />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
