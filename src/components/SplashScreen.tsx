import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AppLogo } from "./AppLogo";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    // Try playing heartbeat sound
    try {
      const audio = new Audio("/heartbeat.mp3");
      audio.volume = 1.0;
      audio.playbackRate = 1.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => console.log("Audio file missing or blocked by browser"));
      }

      const fadeTimer = setTimeout(() => setIsFading(true), 2500);
      const timer = setTimeout(() => onFinish(), 3000); // reduced to 3 seconds for better UX

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(timer);
        audio.pause();
      };
    } catch (e) {
      console.error(e);
      onFinish();
    }
  }, [started, onFinish]);

  if (!started) {
    return (
      <div className="w-full h-screen gradient-primary flex flex-col items-center justify-center fixed inset-0 z-[99999] overflow-hidden">
        {/* ICU Background */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('/icu-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

        {/* Glow behind the button and logo */}
        <div className="absolute w-96 h-96 bg-white blur-3xl opacity-20 rounded-full"></div>

        {/* Animated ECG Logo */}
        <AppLogo className="w-32 h-32 mb-10 logo-float relative z-10" />

        <motion.button
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          onClick={() => {
            console.log("Initialize clicked");
            setStarted(true);
          }}
          className="relative z-[100000] px-8 py-4 bg-white/95 text-teal-800 border-[3px] border-white ring-4 ring-white/30 rounded-full font-display font-extrabold tracking-widest uppercase shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:bg-white hover:scale-110 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 cursor-pointer backdrop-blur-md"
        >
          Initialize HealthTwin AI
        </motion.button>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-screen gradient-primary flex items-center justify-center fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-500 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* ICU Background */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-[url('/icu-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

      {/* Glow Effect */}
      <div className="absolute w-96 h-96 bg-white blur-3xl opacity-20 rounded-full"></div>

      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center z-10"
      >
        {/* Logo Image */}
        <AppLogo className="w-48 h-48 logo-float" />

        {/* App Name */}
        <h1 className="text-white text-3xl mt-6 font-bold tracking-wide font-display drop-shadow-lg">
          HealthTwin AI
        </h1>

        <p className="text-white/80 text-sm mt-2 tracking-widest uppercase font-medium">
          Intelligent Healthcare Companion
        </p>
      </motion.div>
    </div>
  );
}
