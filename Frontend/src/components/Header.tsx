import { Search, ShoppingCart, Upload, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  cartItemCount?: number;
  onSearchChange?: (value: string) => void;
}

export const Header = ({ cartItemCount = 0, onSearchChange }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-smooth hover:scale-105"
          >
            <div className="p-2 rounded-lg gradient-primary shadow-medical">
              <Pill className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediCare</h1>
              <p className="text-xs text-muted-foreground">Your Trusted Pharmacy</p>
            </div>
          </Link>

          {/* Search Bar - Only show on home page */}
          {location.pathname === "/" && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for medicines..."
                  className="pl-10 h-12 bg-card border-primary/20 focus:border-primary shadow-card transition-smooth"
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link to="/prescription">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Prescription</span>
              </Button>
            </Link>

            <Link to="/checkout">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse-medical"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};