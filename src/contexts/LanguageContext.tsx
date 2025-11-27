import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '@/pages/OnboardingPage';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', my: 'Utama' },
  'nav.search': { en: 'Search', my: 'Cari' },
  'nav.favorites': { en: 'Favorites', my: 'Kegemaran' },
  'nav.profile': { en: 'Profile', my: 'Profil' },
  
  'header.title': { en: 'Discover KV', my: 'Terokai Lembah Klang' },
  'header.subtitle': { en: 'Your personalized Klang Valley guide', my: 'Panduan peribadi Lembah Klang anda' },
  'header.forYou': { en: 'For You', my: 'Untuk Anda' },
  'common.all': { en: 'All', my: 'Semua' },
  
  // Categories
  'category.all': { en: 'All', my: 'Semua' },
  'category.food': { en: 'Food', my: 'Makanan' },
  'category.activities': { en: 'Activities', my: 'Aktiviti' },
  'category.nightlife': { en: 'Nightlife', my: 'Kehidupan Malam' },
  'category.nature': { en: 'Nature', my: 'Alam Semula Jadi' },
  'category.shopping': { en: 'Shopping', my: 'Membeli-belah' },
  
  // Sample content
  'content.title.1': { en: 'Petronas Twin Towers', my: 'Menara Berkembar Petronas' },
  'content.location.1': { en: 'Kuala Lumpur', my: 'Kuala Lumpur' },
  'content.title.2': { en: 'Penang Street Food Tour', my: 'Lawatan Makanan Jalanan Penang' },
  'content.location.2': { en: 'George Town, Penang', my: 'George Town, Pulau Pinang' },
  'content.title.3': { en: 'Langkawi Sky Bridge', my: 'Jambatan Langit Langkawi' },
  'content.location.3': { en: 'Langkawi', my: 'Langkawi' },
  'content.title.4': { en: 'Cameron Highlands Tea Plantation', my: 'Ladang Teh Cameron Highlands' },
  'content.location.4': { en: 'Cameron Highlands, Pahang', my: 'Cameron Highlands, Pahang' },
  'content.title.5': { en: 'Jonker Street Night Market', my: 'Pasar Malam Jonker Street' },
  'content.location.5': { en: 'Melaka', my: 'Melaka' },
  'content.title.6': { en: 'Batu Caves', my: 'Gua Batu' },
  'content.location.6': { en: 'Selangor', my: 'Selangor' },
  
  // Common
  'common.from': { en: 'From', my: 'Dari' },
  'common.duration': { en: 'Duration', my: 'Tempoh' },
  'common.hours': { en: 'hours', my: 'jam' },
  'common.rating': { en: 'Rating', my: 'Penilaian' },
  'common.forYou': { en: 'For You', my: 'Untuk Anda' },

  // Profile Page
  'profile.title': { en: 'Profile', my: 'Profil' },
  'profile.visited': { en: 'Visited', my: 'Telah Dikunjungi' },
  'profile.favorites': { en: 'Favorites', my: 'Kegemaran' },
  'profile.reviews': { en: 'Reviews', my: 'Ulasan' },
  'profile.preferences': { en: 'Your Preferences', my: 'Keutamaan Anda' },
  'profile.favoriteCategories': { en: 'Favorite Categories', my: 'Kategori Kegemaran' },
  'profile.preferredTime': { en: 'Preferred Time', my: 'Masa Pilihan' },
  'profile.budgetRange': { en: 'Budget Range', my: 'Julat Bajet' },
  'profile.recentActivity': { en: 'Recent Activity', my: 'Aktiviti Terkini' },

  // Search Page
  'search.title': { en: 'Search', my: 'Cari' },
  'search.placeholder': { en: 'Search places, food, activities...', my: 'Cari tempat, makanan, aktiviti...' },
  'search.resultsFor': { en: 'results for', my: 'hasil untuk' },
  'search.noResults': { en: 'No results found', my: 'Tiada hasil ditemui' },
  'search.tryAdjust': { en: 'Try adjusting your search or filters', my: 'Cuba ubah carian atau penapis anda' },

  'bottomNav.home': { en: 'Home', my: 'Utama' },
  'bottomNav.search': { en: 'Search', my: 'Cari' },
  'bottomNav.tripPlanner': { en: 'Plan', my: 'Rancang' },
  'bottomNav.profile': { en: 'Profile', my: 'Profil' },

  // Trip Planner
  'tripPlanner.title': { en: 'Trip Planner', my: 'Perancang Perjalanan' },
  'tripPlanner.subtitle': { en: 'Create your perfect day in KV', my: 'Cipta hari sempurna anda di Lembah Klang' },
  'tripPlanner.preferences': { en: 'Your Preferences', my: 'Keutamaan Anda' },
  'tripPlanner.preferencesDesc': { en: 'Tell us your preferences and we\'ll create a personalized itinerary', my: 'Beritahu kami keutamaan anda dan kami akan cipta jadual perjalanan yang diperibadikan' },
  'tripPlanner.startTime': { en: 'Start Time', my: 'Masa Mula' },
  'tripPlanner.dietary': { en: 'Dietary Requirements', my: 'Keperluan Diet' },
  'tripPlanner.transport': { en: 'Mode of Transport', my: 'Mod Pengangkutan' },
  'tripPlanner.accessibility': { en: 'Accessibility Needs', my: 'Keperluan Akses' },
  'tripPlanner.noPreference': { en: 'No preference', my: 'Tiada keutamaan' },
  'tripPlanner.halal': { en: 'Halal', my: 'Halal' },
  'tripPlanner.vegetarian': { en: 'Vegetarian', my: 'Vegetarian' },
  'tripPlanner.vegan': { en: 'Vegan', my: 'Vegan' },
  'tripPlanner.publicTransport': { en: 'Public transport', my: 'Pengangkutan awam' },
  'tripPlanner.taxi': { en: 'Taxi/Grab', my: 'Teksi/Grab' },
  'tripPlanner.ownVehicle': { en: 'Own vehicle', my: 'Kenderaan sendiri' },
  'tripPlanner.wheelchairAccessible': { en: 'Wheelchair accessible', my: 'Boleh diakses kerusi roda' },
  'tripPlanner.elevatorAccess': { en: 'Elevator access', my: 'Akses lif' },
  'tripPlanner.generatePlan': { en: 'Generate My Plan', my: 'Jana Rancangan Saya' },
  'tripPlanner.generating': { en: 'Generating...', my: 'Menjana...' },
  'tripPlanner.summary': { en: 'Summary', my: 'Ringkasan' },
  'tripPlanner.transportNotes': { en: 'Transport Notes', my: 'Nota Pengangkutan' },
  'tripPlanner.howToGetThere': { en: 'How to get there', my: 'Cara ke sana' },
  'tripPlanner.priceRange': { en: 'Price Range', my: 'Julat Harga' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if user has manually set a language preference
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'my') {
      return stored;
    }
    
    // Otherwise, use user preference from onboarding (local = 'my', tourist = 'en')
    const preferencesStr = localStorage.getItem('userPreferences');
    if (preferencesStr) {
      const preferences: UserPreferences = JSON.parse(preferencesStr);
      return preferences.userType === 'local' ? 'my' : 'en';
    }
    
    // Default to English
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'my' : 'en');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
