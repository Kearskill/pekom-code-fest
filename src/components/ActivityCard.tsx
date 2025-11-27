import { MapPin, DollarSign, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  price: string;
  duration?: string;
  rating?: number;
}

const categoryColors: Record<string, string> = {
  food: "bg-category-food/10 text-category-food border-category-food/20",
  activities: "bg-category-activities/10 text-category-activities border-category-activities/20",
  nightlife: "bg-category-nightlife/10 text-category-nightlife border-category-nightlife/20",
  nature: "bg-category-nature/10 text-category-nature border-category-nature/20",
  shopping: "bg-category-shopping/10 text-category-shopping border-category-shopping/20",
};

export const ActivityCard = ({
  id,
  title,
  category,
  location,
  image,
  price,
  duration,
  rating,
}: ActivityCardProps) => {
  const navigate = useNavigate();

  const openDetail = () => {
    navigate(`/activity/${id}`, {
      state: { id, title, category, location, image, price, duration, rating },
    });
  };

  return (
    <div
      onClick={openDetail}
      className="bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-[shadow] duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className={`absolute top-3 left-3 ${
            categoryColors[category?.toLowerCase() || ""] || "bg-primary/10 text-primary border-primary/20"
          }`}
        >
          {category || "Unknown"}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm font-medium text-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{price}</span>
            </div>
            {duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{duration}</span>
              </div>
            )}
          </div>
          {rating && (
            <div className="flex items-center text-sm font-medium text-foreground">
              <span className="text-accent mr-1">★</span>
              <span>{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
