"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { Switch } from "@referrer/ui";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const switchTheme = (theme) => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    // <TooltipDemo text={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
    <Switch aria-label="theme-switcher" onClick={() => switchTheme(theme)} id="dark-mode" />
    // </TooltipDemo>
  );
};
