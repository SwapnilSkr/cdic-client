import type { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Footer from "@/components/dashboard/Footer";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header>
            <MobileMenu />
          </Header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
