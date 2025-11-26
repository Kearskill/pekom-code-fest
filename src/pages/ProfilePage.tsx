import { MapPin, Heart, Clock, Settings, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/languageToggle";
import { useState } from "react";

const ProfilePage = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSettingsOpen(false)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <SheetTitle>Settings</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <LanguageToggle />
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">John Doe</h2>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Petaling Jaya</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">24</div>
              <div className="text-xs text-muted-foreground">Visited</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">12</div>
              <div className="text-xs text-muted-foreground">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">8</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Your Preferences</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Favorite Categories</div>
                    <div className="text-xs text-muted-foreground">Food, Nature, Activities</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Preferred Time</div>
                    <div className="text-xs text-muted-foreground">Weekends, Evenings</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Budget Range</div>
                    <div className="text-xs text-muted-foreground">RM 20-100 per activity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Recent Activity</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=100&auto=format&fit=crop"
                    alt="Activity"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">Village Park Nasi Lemak</div>
                    <div className="text-xs text-muted-foreground">Visited 2 days ago</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=100&auto=format&fit=crop"
                    alt="Activity"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">Batu Caves</div>
                    <div className="text-xs text-muted-foreground">Visited 1 week ago</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1508062878650-88b52897f298?w=100&auto=format&fit=crop"
                    alt="Activity"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">KL Tower</div>
                    <div className="text-xs text-muted-foreground">Visited 2 weeks ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
