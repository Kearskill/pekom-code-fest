import { useState } from "react";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ActivityCard } from "@/components/ActivityCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { mockActivities } from "@/data/mockActivities";

const categoriesKeys = ["food", "activities", "nightlife", "nature", "shopping"];

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [halal, setHalal] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };


  const filteredResults = mockActivities.filter((activity) => {
    const matchSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(activity.category.toLowerCase());

    const matchHalal = halal === null || activity.halal === halal;

    const price = Number(activity.price.replace(/[^0-9]/g, ""));
    const matchPrice = price >= priceRange[0] && price <= priceRange[1];

    return matchSearch && matchCategory && matchHalal && matchPrice;
  });

  const applyPriceInput = () => {
    const min = Number(priceMin);
    const max = Number(priceMax);
    if (min <= max) setPriceRange([min, max]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">{t("search.title")}</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-full bg-secondary border-transparent"
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

          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"></div>

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setFilterOpen(false)}>
                    <ArrowLeft />
                  </Button>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Categories</h3>

                    <div className="flex flex-wrap gap-2">
                      {categoriesKeys.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition
                            ${selectedCategories.includes(cat)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"}`}
                        >
                          {t(`category.${cat}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Halal</h3>
                    <div className="flex gap-3">
                      <Button
                        variant={halal === true ? "default" : "outline"}
                        onClick={() => setHalal(true)}
                      >
                        Halal
                      </Button>
                      <Button
                        variant={halal === false ? "default" : "outline"}
                        onClick={() => setHalal(false)}
                      >
                        Non-Halal
                      </Button>
                      <Button
                        variant={halal === null ? "default" : "outline"}
                        onClick={() => setHalal(null)}
                      >
                        Any
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Price Range (RM)</h3>

                    <Slider
                      value={priceRange}
                      onValueChange={(val) => setPriceRange(val)}
                      min={0}
                      max={300}
                      step={1}
                    />

                    <div className="flex gap-4 mt-4">
                      <Input
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                      />
                      <Button onClick={applyPriceInput}>Apply</Button>
                    </div>
                  </div>

                  <Button className="w-full py-3 text-lg" onClick={() => setFilterOpen(false)}>
                    Save Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="grid gap-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((activity) => <ActivityCard key={activity.id} {...activity} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}
