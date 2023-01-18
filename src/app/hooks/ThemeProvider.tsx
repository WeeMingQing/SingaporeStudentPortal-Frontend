import {createContext, ReactNode, useContext, useState} from "react"
const DarkThemeContext = createContext({} as DarkThemeContext)

type ThemeProviderProps = {
    children: ReactNode
}

type DarkThemeContext = {
    toggleDarkTheme: () => void
    themeColour: string
    textColour: string
}

export function useDarkTheme() {
    return useContext(DarkThemeContext)
}

//useContext to toggle on and off darkmode
export function ThemeProvider({children} : ThemeProviderProps) {
    const [darkThemeToggle, setDarkThemeToggle] = useState<boolean>(false)
    const toggleDarkTheme = () => setDarkThemeToggle(prevDarkThemeToggle => !prevDarkThemeToggle)
    const textColour = (darkThemeToggle) ? "black" : "white"
    const themeColour = (darkThemeToggle) ? "white" : "black"

    return (
        <DarkThemeContext.Provider value={{toggleDarkTheme, themeColour, textColour}}>
            {children}
        </DarkThemeContext.Provider>
    )
}
