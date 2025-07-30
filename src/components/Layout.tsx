import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react"; // Removed Sun, Moon
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// Removed useTheme import as it's no longer needed here

const Layout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Removed theme and setTheme from useTheme
  // Removed toggleTheme function

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sheet for smaller screens */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar for mobile to open sidebar */}
        <header className="p-4 border-b border-border flex items-center justify-between md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Chat App</h1>
          {/* Placeholder for balance, theme toggle removed */}
          <div></div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;