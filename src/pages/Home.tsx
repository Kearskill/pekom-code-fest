import { useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { CategoryChip } from "@/components/CategoryChip";
import { Sparkles } from "lucide-react";

const categories = ["All", "Food", "Activities", "Nightlife", "Nature", "Shopping"];

// Mock data - will be replaced with real data from backend
const mockActivities = [
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
  {
    id: "4",
    title: "Pavilion Shopping Centre",
    category: "Shopping",
    location: "Bukit Bintang, Kuala Lumpur",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop",
    price: "Varies",
    duration: "3+ hrs",
    rating: 4.5,
  },
  {
    id: "5",
    title: "Changkat Bukit Bintang",
    category: "Nightlife",
    location: "Bukit Bintang, Kuala Lumpur",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&auto=format&fit=crop",
    price: "50-200",
    duration: "3+ hrs",
    rating: 4.4,
  },
  {
    id: "6",
    title: "Dim Sum at Dolly Dim Sum",
    category: "Food",
    location: "Bangsar, Kuala Lumpur",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop",
    price: "20-40",
    duration: "1 hr",
    rating: 4.7,
  },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredActivities =
    selectedCategory === "All"
      ? mockActivities
      : mockActivities.filter((activity) => activity.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Discover KV</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Your personalized Klang Valley guide
          </p>
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedCategory === "All" ? "For You" : selectedCategory}
          </h2>
          <div className="grid gap-4">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
