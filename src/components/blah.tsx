import React from "react"
import { IArticlePair, COLOR_THEMES } from "./host"
import { Box, Text, Link } from "rebass"
import { useOnHardScroll } from "../hooks"

interface IBlahProps {
  currentArticles: IArticlePair | null
  nextArticle?: () => void
  goBackArticle?: () => void
  shareLink?: string
  colorTheme?: { primary: string; secondary: string }
}

export const Article: React.FC<{
  name?: string
  img?: string
  inverted?: boolean
  colorTheme: { primary: string; secondary: string }
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
      <Text
        sx={{
          color: inverted ? colorTheme.secondary : colorTheme.primary,
          textAlign: inverted ? "right" : "left",
          width: "100%",
          fontFamily: "Bebas Neue",
          fontSize: [50, 50, 60, 70],
          transition: "background-color 400ms linear",
          transform: "scale(1, 1.2)",
        }}
      >
        {name?.replaceAll("_", " ").toUpperCase()}
      </Text>
    </Box>
  )
}

export const Blah: React.FC<IBlahProps> = ({
  shareLink,
  currentArticles,
  nextArticle,
  colorTheme = COLOR_THEMES[0],
  goBackArticle,
}) => {
  useOnHardScroll({
    onHardScroll: (direction) => {
      if (direction === "down" && nextArticle) {
        nextArticle()
      }
      if (direction === "up" && goBackArticle) {
        goBackArticle()
      }
    },
    getShouldFireEvent: () => Boolean(nextArticle && nextArticle),
  })
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "fixed",
        flexDirection: ["column", "row"],
      }}
    >
      <Article colorTheme={colorTheme} {...currentArticles?.start} />
      <Article colorTheme={colorTheme} inverted {...currentArticles?.end} />
      {nextArticle && shareLink && (
        <Text
          sx={{
            color: colorTheme.primary,
            width: "100%",
            fontFamily: "Open Sans",
            fontSize: 10,
            position: "absolute",
            bottom: 20,
            left: 20,
          }}
        >
          ↓ scroll for next topic <br />
          share link:{" "}
          <Link
            sx={{ color: colorTheme.primary }}
            href={shareLink}
            target="_blank"
          >
            {shareLink}
          </Link>
        </Text>
      )}
    </Box>
  )
}
