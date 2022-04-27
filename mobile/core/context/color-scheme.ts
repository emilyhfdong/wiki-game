import { createContext } from "react"
import { ColorScheme } from "../../theme"

export const ColorSchemeContext = createContext<ColorScheme>({
  primary: "",
  secondary: "",
})
