import { Classes } from "@blueprintjs/core";
import React from "react";

import { getItem, setItem } from "../../../utils/storage";

interface IThemeContextValue {
    theme: string;
    setTheme: (theme: string) => void;
}

interface IThemeProviderProps {
    value?: IThemeContextValue;
    children: React.ReactNode;
}

export const ThemeContext = React.createContext<IThemeContextValue | undefined>(undefined);

function ThemeProvider(props: IThemeProviderProps) {
    const [theme, setTheme] = React.useState(getItem("theme") || Classes.DARK);

    const value = React.useMemo(() => {
        return { theme, setTheme };
    }, [theme]);

    // Change theme in localStorage whenever user changes on UI
    React.useEffect(() => {
        setItem("theme", theme);
    }, [theme]);

    return <ThemeContext.Provider value={value} {...props} />;
}

function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    const { theme, setTheme } = context;

    return {
        theme,
        setTheme,
    };
}

export { ThemeProvider, useTheme };
