import { NavLink } from "react-router-dom";
import { MessageSquare, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const navItems = [
    { href: "/", icon: MessageSquare, label: "Chat" },
    { href: "/upload", icon: Upload, label: "Upload Knowledge" },
  ];

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <h1 className="text-lg font-semibold">Chatbot AI</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};