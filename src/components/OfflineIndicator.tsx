import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showReconnect, setShowReconnect] = useState(false);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setShowReconnect(true);
      setTimeout(() => setShowReconnect(false), 3000);
    };
    const goOffline = () => {
      setOnline(false);
      setShowReconnect(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online && !showReconnect) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2 text-center text-xs font-semibold ${
          online
            ? "bg-success text-success-foreground"
            : "bg-destructive text-destructive-foreground"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          {online ? (
            <>
              <Wifi className="h-3.5 w-3.5" /> Back online — syncing data…
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" /> You're offline — data saved locally
            </>
          )}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
