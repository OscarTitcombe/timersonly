"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <body
      className="font-sans min-h-screen"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {children}
    </body>
  );
}

