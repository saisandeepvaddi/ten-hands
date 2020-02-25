import { Classes } from "@blueprintjs/core";
import React from "react";

import { getItem, setItem } from "../../../utils/storage";
import { useMountedState } from "../hooks";

interface IThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
}

interface IThemeProviderProps {
  value?: IThemeContextValue;
  children: React.ReactNode;
}

export const ThemeContext = React.createContext<IThemeContextValue | undefined>(
  undefined
);

function ThemeProvider(props: IThemeProviderProps) {
  const isMounted = useMountedState();
  const [theme, setTheme] = React.useState(getItem("theme") || Classes.DARK);

  const value = React.useMemo(() => {
    return { theme, setTheme };
  }, [theme, setTheme]);

  // Change theme in localStorage whenever user changes on UI
  React.useEffect(() => {
    if (isMounted()) {
      setItem("theme", theme);
    }
  }, [theme, isMounted]);

  return <ThemeContext.Provider value={value} {...props} />;
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export { ThemeProvider, useTheme };
