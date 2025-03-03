/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Footer from "@/components/dashboard/Footer";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { ProtectedRoute } from "@/components/protected-route";
import { useUserStore } from "@/state/user.store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const {token, logout} = useUserStore();

  // Check token expiration and logout if expired
  const checkTokenExpiration = () => {
    if (!token) return;
    
    try {
      // Extract the payload from JWT token
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.exp) {
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        
        if (currentTime > expirationTime) {
          console.log('Token expired, logging out...');
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      logout();
    }
  };
  
  // Check token expiration on component mount
  useEffect(() => {
    checkTokenExpiration();
    
    // Set up interval to periodically check token expiration
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [token, logout]);


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
