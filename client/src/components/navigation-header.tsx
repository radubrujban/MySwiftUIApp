import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Home, Plane, Camera, BarChart3, Settings, Shield, Menu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavigationHeaderProps {
  onNewMission: () => void;
}

export default function NavigationHeader({ onNewMission }: NavigationHeaderProps) {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-[var(--aviation-blue)] border-b border-gray-700 sticky top-0 z-50">
      <div className="aviation-container py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-white" />
            <div>
              <h1 className="text-lg font-bold text-white">FCC Flight Tracker</h1>
              <p className="text-blue-200 text-xs">For Official Use Only</p>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowMenu(!showMenu)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 touch-target"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              onClick={onNewMission}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white touch-target"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="mt-3 py-3 border-t border-blue-600">
            <nav className="space-y-2">
              <MobileNavButton 
                href="/" 
                icon={Home} 
                label="Dashboard" 
                isActive={location === "/"} 
                onClick={() => setShowMenu(false)}
              />
              <MobileNavButton 
                href="/settings" 
                icon={Settings} 
                label="Settings" 
                isActive={location === "/settings"} 
                onClick={() => setShowMenu(false)}
              />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

interface MobileNavButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function MobileNavButton({ href, icon: Icon, label, isActive, onClick }: MobileNavButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        onClick={onClick}
        className={`w-full justify-start text-white hover:bg-blue-700 touch-target ${
          isActive ? 'bg-blue-700' : ''
        } flex items-center space-x-3 py-3`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-base">{label}</span>
      </Button>
    </Link>
  );
}
