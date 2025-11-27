import { CategoryRow } from "@/components/CategoryRow";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockActivities } from "@/data/mockActivities";
import { getQuickRecommendations } from "@/api/recommendation";
import { useEffect, useState } from "react";

export type Activity = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  price: string;
  duration?: string;
  rating?: number;
};

const Home = () => {
  const { t } = useLanguage();
   const [forYouActivities, setForYouActivities] = useState([]);

    useEffect(() => {
    getQuickRecommendations()
      .then((data) => {
        // Backend returns raw PlaceResponse dicts
        console.log("Fetched recommendations:", data);
        // Map API response to ActivityCard props
        const mappedActivities = data.recommendations.map((item: any, index: number): Activity => ({
          id: item.name + "-" + index,
          title: item.name,
          category: item.type || "Unknown",
          location: item.address || "Unknown location",
          image: item.image_url || "",
          price: item.price_range || "N/A",
          duration: item.opening_hours || undefined,
          rating: item.rating || undefined,
        })) as Activity[];

        setForYouActivities(mappedActivities);
      })
      .catch((err) => console.error("Failed to load recommendations:", err));

  }, []);

  // Group activities by category
  const foodActivities = mockActivities.filter((a) => a.category === "Food");
  const activitiesCategory = mockActivities.filter((a) => a.category === "Activities");
  const nightlifeActivities = mockActivities.filter((a) => a.category === "Nightlife");
  const natureActivities = mockActivities.filter((a) => a.category === "Nature");
  const shoppingActivities = mockActivities.filter((a) => a.category === "Shopping");

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{t("header.title")}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("header.subtitle")}
          </p>
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <CategoryRow title={t("common.forYou")} activities={forYouActivities} />
        <CategoryRow title={t("category.food")} activities={foodActivities} />
        <CategoryRow title={t("category.activities")} activities={activitiesCategory} />
        <CategoryRow title={t("category.nightlife")} activities={nightlifeActivities} />
        <CategoryRow title={t("category.nature")} activities={natureActivities} />
        <CategoryRow title={t("category.shopping")} activities={shoppingActivities} />
      </div>
    </div>
  );
};

export default Home;
