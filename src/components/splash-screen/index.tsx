import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../ui";



interface SplashScreenProps {
  logo?: string;
  title?: string;
  show?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  logo = "/logo.svg",
  title = "SyncTax.",
  show = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true),300); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#faffff] z-50`}
    >
      <LoadingSpinner />
      <div className="flex text-4xl font-semibold text-[#00786F] mb-6 overflow-hidden">
        {title.split("").map((char, index) => {
          const delay = index * 100; 
          return (
            <span
              key={index}
              className={`inline-block transform transition-all duration-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};
