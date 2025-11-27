import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles } from "lucide-react";

interface OnboardingPageProps {
    onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
    name: string;
    userType: "local" | "tourist";
    dietary: "halal" | "no-preference";
    transport: "public-transport" | "taxi" | "own-vehicle";
    accessibility: "wheelchair-friendly" | "no-preference";
}

export const OnboardingPage = ({ onComplete }: OnboardingPageProps) => {
    const [name, setName] = useState("");
    const [userType, setUserType] = useState<"local" | "tourist">("local");
    const [dietary, setDietary] = useState<"halal" | "no-preference">("no-preference");
    const [transport, setTransport] = useState<"public-transport" | "taxi" | "own-vehicle">("own-vehicle");
    const [accessibility, setAccessibility] = useState<"wheelchair-friendly" | "no-preference">("no-preference");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        onComplete({
        name: name.trim(),
        userType,
        dietary,
        transport,
        accessibility,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Welcome to Discover KV</h1>
            </div>
            <p className="text-muted-foreground">
                Let's personalize your experience
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border shadow-lg">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">What's your name?</Label>
                <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
                />
            </div>

            {/* Local / Tourist */}
            <div className="space-y-3">
                <Label>Are you a local or tourist?</Label>
                <RadioGroup value={userType} onValueChange={(value) => setUserType(value as "local" | "tourist")}>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local" className="flex-1 cursor-pointer font-normal">
                    Local
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="tourist" id="tourist" />
                    <Label htmlFor="tourist" className="flex-1 cursor-pointer font-normal">
                    Tourist
                    </Label>
                </div>
                </RadioGroup>
            </div>

            {/* Dietary Requirements */}
            <div className="space-y-3">
                <Label>Dietary requirements</Label>
                <RadioGroup value={dietary} onValueChange={(value) => setDietary(value as "halal" | "no-preference")}>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="halal" id="halal" />
                    <Label htmlFor="halal" className="flex-1 cursor-pointer font-normal">
                    Halal
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="no-preference" id="no-preference" />
                    <Label htmlFor="no-preference" className="flex-1 cursor-pointer font-normal">
                    No preference
                    </Label>
                </div>
                </RadioGroup>
            </div>

            {/* Mode of Transport */}
            <div className="space-y-3">
                <Label>Mode of transport</Label>
                <RadioGroup value={transport} onValueChange={(value) => setTransport(value as "public-transport" | "taxi" | "own-vehicle")}>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="public-transport" id="public-transport" />
                    <Label htmlFor="public-transport" className="flex-1 cursor-pointer font-normal">
                    Public transport
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="taxi" id="taxi" />
                    <Label htmlFor="taxi" className="flex-1 cursor-pointer font-normal">
                    Taxi
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="own-vehicle" id="own-vehicle" />
                    <Label htmlFor="own-vehicle" className="flex-1 cursor-pointer font-normal">
                    Own vehicle
                    </Label>
                </div>
                </RadioGroup>
            </div>

            {/* Accessibility */}
            <div className="space-y-3">
                <Label>Accessibility</Label>
                <RadioGroup value={accessibility} onValueChange={(value) => setAccessibility(value as "wheelchair-friendly" | "no-preference")}>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="wheelchair-friendly" id="wheelchair-friendly" />
                    <Label htmlFor="wheelchair-friendly" className="flex-1 cursor-pointer font-normal">
                    Wheelchair-friendly
                    </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="no-preference" id="accessibility-no-preference" />
                    <Label htmlFor="accessibility-no-preference" className="flex-1 cursor-pointer font-normal">
                    No preference
                    </Label>
                </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!name.trim()}>
                Get Started
            </Button>
            </form>
        </div>
        </div>
    );
};
