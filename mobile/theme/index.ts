export const theme = {
  colors: {
    beige: "#FDF2E3",
    black: "#000000",
    pink: "#EAB39D",
    red: "#E62E3B",
    green: "#C5CAB3",
    darkGreen: "#135142",
    orange: "#FF8D50",
  },
  fontFamily: "BebasNeue_400Regular",
}

export interface ColorScheme {
  primary: string
  secondary: string
}

export const colorSchemes: ColorScheme[] = [
  // {
  //   primary: theme.colors.pink,
  //   secondary: theme.colors.red,
  // },
  {
    primary: theme.colors.red,
    secondary: theme.colors.pink,
  },
  {
    primary: theme.colors.black,
    secondary: theme.colors.beige,
  },
  // {
  //   primary: theme.colors.beige,
  //   secondary: theme.colors.black,
  // },
  {
    primary: theme.colors.darkGreen,
    secondary: theme.colors.green,
  },
  // {
  //   primary: theme.colors.green,
  //   secondary: theme.colors.darkGreen,
  // },
]
