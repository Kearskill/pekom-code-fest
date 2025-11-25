import { Home, Search, User } from "lucide-react";
import { NavLink } from "./NavLink";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-sm mx-auto px-4">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center flex-1 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>
        
        <NavLink
          to="/search"
          className="flex flex-col items-center justify-center flex-1 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Search</span>
        </NavLink>
        
        <NavLink
          to="/profile"
          className="flex flex-col items-center justify-center flex-1 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
