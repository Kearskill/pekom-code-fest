import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockActivities } from "@/data/mockActivities";
import { CategoryRow } from "@/components/CategoryRow";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ActivityDetail() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const { t } = useLanguage();
    const youMayAlsoLike = mockActivities
    .filter((a) => a.id !== id)  
    .slice(0, 3);                 

    const activity = state || {};

    return (
        <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border p-4 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-accent/20">
            <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold">{activity.title || "Activity"}</h1>
        </header>

        {/* Image */}
        <div className="h-64 w-full overflow-hidden">
            <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
            />
        </div>

        {/* Content */}
        <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
            {/* Title + Category */}
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{activity.title}</h2>
            {activity.category && (
                <Badge className="text-sm capitalize">{activity.category}</Badge>
            )}
            </div>

            {/* Location */}
            <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {activity.location}
            </div>

            {/* Price + Duration */}
            <div className="flex items-center gap-6 text-sm mt-2">
            <div className="flex items-center font-medium text-foreground">
                <DollarSign className="h-4 w-4" />
                {activity.price}
            </div>

            {activity.duration && (
                <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {activity.duration}
                </div>
            )}
            </div>

            {/* Rating */}
            {activity.rating && (
            <div className="flex items-center gap-1 text-lg font-medium text-foreground pt-2">
                <span className="text-yellow-500">★</span>
                {activity.rating}
            </div>
            )}

            {/* Description */}
            <section>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
                This is a placeholder description. Add real content from your backend later.
            </p>
            </section>

            {/* (Optional) Map Placeholder */}
            <section className="pt-4">
            <CategoryRow title={t("common.youMayAlsoLike")} activities={youMayAlsoLike} />
            </section>
        </div>
        </div>
    );
}