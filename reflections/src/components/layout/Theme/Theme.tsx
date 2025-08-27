import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme,
    toggleTheme: () => void,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [theme, setTheme] = useState<Theme>("light");


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;

        if (savedTheme) {
            setTheme(savedTheme);
            // if the savedTheme was dark (previously chosen),
            // then we add .dark (class) so our page follows dark theme.
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        } else {
            // if there is no saved theme we find the user's prefrence,
            // .matches returns True or False, so here we check if the user
            // prefers dark theme if so then we will add the dark class from 
            // variables.css to the classlist making our app's theme dark
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

            if (prefersDark) {
                setTheme("dark");
                document.documentElement.classList.add("dark");
            }
        }

    }, []);

    const toggleTheme = () => {
        // checking if the current theme is light if so then we change it to dark (toggling)
        const newTheme: Theme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>

            {children}
            
        </ThemeContext.Provider>
    );
}

// exporting our context so that we can toogle theme from anywhere inside the ThemeProvider (any children)
export const useTheme = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) throw new Error("useTheme must be used within ThemeProvider");
    return themeContext;
}