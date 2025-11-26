import { useRef, useState, useEffect } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Activity {
    id: string;
    title: string;
    category: string;
    location: string;
    image: string;
    price: string;
    duration: string;
    rating: number;
}

interface CategoryRowProps {
    title: string;
    activities: Activity[];
}

export const CategoryRow = ({ title, activities }: CategoryRowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const ITEM_WIDTH = 280 + 16; // width + gap (Tailwind gap-4 = 16px)

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll);
        return () => el.removeEventListener("scroll", checkScroll);
    }, []);

    const scrollByAmount = (amount: number) => {
        scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
    };

  if (activities.length === 0) return null;

    return (
        <div className="relative mb-8 group">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>

        {/* LEFT ARROW */}
        {canScrollLeft && (
            <button
            onClick={() => scrollByAmount(-ITEM_WIDTH)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md p-2 rounded-full shadow hover:bg-background"
            >
            <ChevronLeft size={24} />
            </button>
        )}

        {/* RIGHT ARROW */}
        {canScrollRight && (
            <button
            onClick={() => scrollByAmount(ITEM_WIDTH)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md p-2 rounded-full shadow hover:bg-background"
            >
            <ChevronRight size={24} />
            </button>
        )}

        {/* SCROLL AREA */}
        <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
            {activities.map((activity) => (
            <div key={activity.id} className="flex-none w-[280px] snap-start">
                <ActivityCard {...activity} />
            </div>
            ))}
        </div>
        </div>
    );
};
