import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Layout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="hidden md:flex md:w-56 flex-shrink-0">
        <Sidebar />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="p-4 border-b border-border flex items-center justify-between md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSheetOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Chat App</h1>
          <div></div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;