"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
          <DialogContent className="sm:max-w-[425px] border-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  <XCircle className="h-16 w-16 text-destructive" />
                </motion.div>
                <DialogTitle className="text-2xl font-semibold">Access Denied</DialogTitle>
                <DialogDescription className="text-center text-base">
                  Please log in to access this page. If you don&apos;t have an account, you can create one.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-8 flex flex-col space-y-3">
                <Button 
                  onClick={handleLogin}
                  className="w-full"
                  variant="default"
                >
                  Log in
                </Button>
                <Button 
                  onClick={() => router.push("/register")}
                  className="w-full"
                  variant="outline"
                >
                  Create account
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 