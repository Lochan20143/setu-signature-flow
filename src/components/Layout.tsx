import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                Setu Document Signing
              </h1>
            </div>
            <Navigation />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;