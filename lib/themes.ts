export type ThemeId = "peach" | "mint" | "lavender" | "sky" | "sand" | "dark" | "white";

export type Theme = {
  id: ThemeId;
  name: string;
  bg: string;  // background colour
  cardBg: string;
  text: string;
  accent: string;
};

export const themes: Theme[] = [
  {
    id: "peach",
    name: "Peach",
    bg: "#FCE4D6",
    cardBg: "#F4C6AF",
    text: "#4B2C2C",
    accent: "#D15B3F",
  },
  {
    id: "mint",
    name: "Mint",
    bg: "#E0F7EF",
    cardBg: "#C4EBDD",
    text: "#16332A",
    accent: "#1E7A57",
  },
  {
    id: "lavender",
    name: "Lavender",
    bg: "#EEE7FF",
    cardBg: "#D7CCFF",
    text: "#2F2144",
    accent: "#5A3FF0",
  },
  {
    id: "sky",
    name: "Sky",
    bg: "#E4F3FF",
    cardBg: "#C8E4FF",
    text: "#123047",
    accent: "#186FBF",
  },
  {
    id: "sand",
    name: "Sand",
    bg: "#F5EBDD",
    cardBg: "#E4D3BE",
    text: "#3B3022",
    accent: "#B57A3F",
  },
  {
    id: "dark",
    name: "Dark",
    bg: "#1A1A1A",
    cardBg: "#2D2D2D",
    text: "#E5E5E5",
    accent: "#6366F1",
  },
  {
    id: "white",
    name: "White",
    bg: "#FFFFFF",
    cardBg: "#F5F5F5",
    text: "#1A1A1A",
    accent: "#3B82F6",
  },
];

export const defaultThemeId: ThemeId = "peach";

export function getTheme(id: ThemeId | string | null | undefined): Theme {
  const found = themes.find((t) => t.id === id);
  return found ?? themes[0];
}

