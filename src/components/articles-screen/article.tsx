import React from "react"
import { Box, Link } from "rebass"
import { IColorTheme } from "../../types"

export const Article: React.FC<{
  name?: string
  img?: string
  inverted?: boolean
  colorTheme: IColorTheme
}> = ({ name, inverted, colorTheme }) => {
  return (
    <Box
      sx={{
        height: ["50%", "100%"],
        width: ["100%", "50%"],
        backgroundColor: inverted ? colorTheme.primary : colorTheme.secondary,
        display: "flex",
        padding: 20,
        flexDirection: "column",
        justifyContent: inverted ? "flex-end" : "flex-start",
        transition: "background-color 400ms linear",
      }}
    >
      <Link
        href={
          name
            ? `https://en.wikipedia.org/wiki/${name.replaceAll(" ", "_")}`
            : undefined
        }
        target="_blank"
        sx={{
          color: inverted ? colorTheme.secondary : colorTheme.primary,
          textAlign: inverted ? "right" : "left",
          width: "100%",
          fontFamily: "Bebas Neue",
          fontSize: [50, 50, 60, 70],
          transition: "background-color 400ms linear",
          transform: "scale(1, 1.2)",
          textDecoration: "none",
        }}
      >
        {name?.replaceAll("_", " ").toUpperCase()}
      </Link>
    </Box>
  )
}
