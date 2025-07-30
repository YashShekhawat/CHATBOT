import { NavLink } from "react-router-dom";
import { BotMessageSquare, MessageSquare, Upload, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "./made-with-dyad";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Button } from "@/components/ui/button"; // Import Button

export const Sidebar = () => {
  const { role, logout } = useAuth(); // Get role and logout from context

  const navItems = [
    { href: "/", icon: MessageSquare, label: "Chat" },
    { href: "/upload", icon: Upload, label: "Upload Knowledge" },
  ];

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span>Chatbot AI</span>
        </a>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-muted/50 hover:text-primary",
                    isActive && "bg-muted font-semibold text-primary"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t p-4 space-y-4">
        {role && (
          <div className="text-sm text-muted-foreground text-center">
            Logged in as: <span className="font-semibold capitalize">{role}</span>
          </div>
        )}
        <Button onClick={logout} className="w-full" variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
        <MadeWithDyad />
      </div>
    </div>
  );
};