import { Link, useLocation } from "react-router-dom";
import { FileText, Settings, Upload, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", icon: FileText, label: "Home" },
    { href: "/upload", icon: Upload, label: "Upload" },
    { href: "/status", icon: BarChart3, label: "Status" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          to={href}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            location.pathname === href
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;