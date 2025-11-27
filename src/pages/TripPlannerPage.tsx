import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, MapPin, Utensils } from "lucide-react";

interface TripParams {
  start_time: string;
  dietary: string;
  transport: string;
  accessibility: string;
}

interface ItineraryItem {
  time: string;
  place: string;
  type: string;
  reasoning: string;
  image_url: string;
  address: string;
  opening_hours: string;
  price_range: string;
  halal_status: string;
  description: string;
  accessibility_info: string;
  how_to_get_there: string;
}

interface ItineraryResponse {
  itinerary: ItineraryItem[];
  summary: string;
  transport_notes: string;
}

const TripPlannerPage = () => {
  const { t } = useLanguage();
  const [params, setParams] = useState<TripParams>({
    start_time: "09:00",
    dietary: "No preference",
    transport: "Public transport",
    accessibility: "No preference",
  });
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call - replace with actual API call later
    setTimeout(() => {
      setItinerary({
        itinerary: [
          {
            time: "09:00",
            place: "Nasi Lemak Wanjo",
            type: "Breakfast",
            reasoning: "Popular local breakfast spot with halal options",
            image_url: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800",
            address: "Kampung Baru, Kuala Lumpur",
            opening_hours: "6:00 AM - 12:00 PM",
            price_range: "RM 5-15",
            halal_status: "Halal",
            description: "Authentic Malaysian breakfast experience",
            accessibility_info: "Street-level access",
            how_to_get_there: "LRT to Kampung Baru station, 5 min walk",
          },
          {
            time: "11:00",
            place: "Batu Caves",
            type: "Cultural Site",
            reasoning: "Iconic landmark with cultural significance",
            image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
            address: "Gombak, Selangor",
            opening_hours: "6:00 AM - 9:00 PM",
            price_range: "Free entry",
            halal_status: "N/A",
            description: "Famous limestone hill with colorful stairs and Hindu temple",
            accessibility_info: "272 steps to main cave - not wheelchair accessible",
            how_to_get_there: "KTM Komuter to Batu Caves station",
          },
        ],
        summary: "A perfect day exploring KL's culture and cuisine with convenient public transport connections.",
        transport_notes: "Use Touch 'n Go card for seamless travel on LRT and KTM lines.",
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{t("tripPlanner.title")}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("tripPlanner.subtitle")}
          </p>
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Parameters Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("tripPlanner.preferences")}</CardTitle>
            <CardDescription>{t("tripPlanner.preferencesDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">{t("tripPlanner.startTime")}</Label>
              <Input
                id="start-time"
                type="time"
                value={params.start_time}
                onChange={(e) => setParams({ ...params, start_time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary">{t("tripPlanner.dietary")}</Label>
              <Select value={params.dietary} onValueChange={(value) => setParams({ ...params, dietary: value })}>
                <SelectTrigger id="dietary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No preference">{t("tripPlanner.noPreference")}</SelectItem>
                  <SelectItem value="Halal">{t("tripPlanner.halal")}</SelectItem>
                  <SelectItem value="Vegetarian">{t("tripPlanner.vegetarian")}</SelectItem>
                  <SelectItem value="Vegan">{t("tripPlanner.vegan")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transport">{t("tripPlanner.transport")}</Label>
              <Select value={params.transport} onValueChange={(value) => setParams({ ...params, transport: value })}>
                <SelectTrigger id="transport">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public transport">{t("tripPlanner.publicTransport")}</SelectItem>
                  <SelectItem value="Taxi/Grab">{t("tripPlanner.taxi")}</SelectItem>
                  <SelectItem value="Own vehicle">{t("tripPlanner.ownVehicle")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessibility">{t("tripPlanner.accessibility")}</Label>
              <Select value={params.accessibility} onValueChange={(value) => setParams({ ...params, accessibility: value })}>
                <SelectTrigger id="accessibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No preference">{t("tripPlanner.noPreference")}</SelectItem>
                  <SelectItem value="Wheelchair accessible">{t("tripPlanner.wheelchairAccessible")}</SelectItem>
                  <SelectItem value="Elevator access">{t("tripPlanner.elevatorAccess")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? t("tripPlanner.generating") : t("tripPlanner.generatePlan")}
            </Button>
          </CardContent>
        </Card>

        {/* Itinerary Display */}
        {itinerary && (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">{t("tripPlanner.summary")}</h3>
              <p className="text-sm text-muted-foreground">{itinerary.summary}</p>
              {itinerary.transport_notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">{t("tripPlanner.transportNotes")}: </span>
                  {itinerary.transport_notes}
                </p>
              )}
            </div>

            {itinerary.itinerary.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{item.time}</span>
                        <span className="text-xs text-muted-foreground">• {item.type}</span>
                      </div>
                      <CardTitle className="text-lg">{item.place}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.place}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item.address}</span>
                    </div>
                    {item.how_to_get_there && (
                      <div className="bg-secondary/50 rounded p-2">
                        <span className="font-medium text-foreground">{t("tripPlanner.howToGetThere")}: </span>
                        <span className="text-muted-foreground">{item.how_to_get_there}</span>
                      </div>
                    )}
                    {item.price_range && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{t("tripPlanner.priceRange")}:</span>
                        <span className="text-muted-foreground">{item.price_range}</span>
                      </div>
                    )}
                    {item.halal_status && (
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.halal_status}</span>
                      </div>
                    )}
                    {item.opening_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.opening_hours}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerPage;
