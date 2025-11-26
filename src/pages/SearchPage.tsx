import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { CategoryChip } from "@/components/CategoryChip";
import { useLanguage } from "@/contexts/LanguageContext"; // import your hook

const categoriesKeys = ["all", "food", "activities", "nightlife", "nature", "shopping"];

const mockResults = [
  {
    id: "1",
    title: "Nasi Lemak at Village Park",
    category: "Food",
    location: "Damansara Utama, Petaling Jaya",
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop",
    price: "8-15",
    duration: "30 min",
    rating: 4.8,
  },
  {
    id: "2",
    title: "KL Tower Observation Deck",
    category: "Activities",
    location: "Kuala Lumpur City Centre",
    image: "https://images.unsplash.com/photo-1508062878650-88b52897f298?w=800&auto=format&fit=crop",
    price: "52",
    duration: "2 hrs",
    rating: 4.6,
  },
  {
    id: "3",
    title: "Batu Caves Temple",
    category: "Nature",
    location: "Batu Caves, Selangor",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop",
    price: "Free",
    duration: "1-2 hrs",
    rating: 4.7,
  },
];

const SearchPage = () => {
  const { t } = useLanguage(); // use translation
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredResults = mockResults.filter((activity) => {
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || activity.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t("search.title")}</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-full bg-secondary border-transparent focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categoriesKeys.map((key) => (
                <CategoryChip
                  key={key}
                  label={t(`category.${key}`)}
                  active={selectedCategory === key}
                  onClick={() => setSelectedCategory(key)}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredResults.length} {t("search.resultsFor")} "{searchQuery}"
          </p>
        )}
        
        <div className="grid gap-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("search.noResults")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("search.tryAdjust")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
