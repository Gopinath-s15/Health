import { useEffect, useState } from "react";
import { AppLogo } from "./AppLogo";

export const AppSplash = ({ onComplete }: { onComplete: () => void }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFading(true), 2000); // Display for 2s
    const hideTimer = setTimeout(onComplete, 2500); // 500ms fade transition
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
        <AppLogo className="w-24 h-24 mb-6" />
        <h1 className="text-3xl font-display font-bold text-foreground">HealthTwin</h1>
        <p className="text-muted-foreground mt-2 tracking-widest text-sm uppercase">AI-Powered Care</p>
      </div>
    </div>
  );
};
