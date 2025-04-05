
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col dark theme bg-black">
      <Navbar />
      <div className="flex flex-1 text text-white">
        <Sidebar />
        <main className="flex-1 pb-16 md:pb-0">
          <div className="container px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
