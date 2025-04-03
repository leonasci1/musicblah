
import { Home, User, Music, Search, MenuSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: Search, label: "Buscar", href: "/search" },
    { icon: Music, label: "Criar", href: "/create" },
    { icon: User, label: "Perfil", href: "/profile" },
    { icon: MenuSquare, label: "Menu", href: "/menu" },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              location.pathname === item.href 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
