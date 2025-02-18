"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/state/user.store";
import { AuthModal } from "@/components/auth-modal";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if we're on the login or register page
    const isAuthPage = pathname === "/" || pathname === "/register";
    
    // If not authenticated and not on an auth page, show modal
    if (!user || !token) {
      if (!isAuthPage) {
        setShowModal(true);
      }
    } else {
      setShowModal(false);
    }
  }, [user, token, pathname]);

  // If showing modal, render the current page with the modal overlay
  if (showModal) {
    return (
      <>
        {children}
        <AuthModal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            router.push("/");
          }} 
        />
      </>
    );
  }

  // If not showing modal, render the page normally
  return <>{children}</>;
} 