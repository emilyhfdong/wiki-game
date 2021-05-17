import React from "react"
import { COLOR_THEMES } from "../../utils"
import { Box, Text, Link } from "rebass"
import { useOnHardScroll } from "../../hooks"
import { IArticlePair, IColorTheme, IConnection } from "../../types"
import { Article } from "./article"
import { UsernameAvatar } from "./username-avatar"

interface IArticlesScreenProps {
  currentArticles: IArticlePair | null
  nextArticle?: () => void
  goBackArticle?: () => void
  shareLink?: string
  colorTheme?: IColorTheme
  connections: IConnection[]
  setConnections: (connections: IConnection[]) => void
  connectionId: string
  isHost: boolean
}

export const ArticlesScreen: React.FC<IArticlesScreenProps> = ({
  shareLink,
  currentArticles,
  nextArticle,
  colorTheme = COLOR_THEMES[0],
  goBackArticle,
  connections,
  connectionId,
  setConnections,
  isHost,
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
        height: "100%",
        width: "100vw",
        display: "flex",
        position: "fixed",
        flexDirection: ["column", "row"],
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: ["52%", 20],
          right: 20,
          display: "flex",
        }}
      >
        {connections
          .sort((a, b) => b.points - a.points)
          .map((connection) => (
            <UsernameAvatar
              key={connection.connectionId}
              connection={connection}
              colorTheme={colorTheme}
              isSelf={connection.connectionId === connectionId}
              updateConnection={(updatedConnection) =>
                setConnections(
                  connections.map((c) => ({
                    ...c,
                    ...(c.connectionId === connection.connectionId &&
                      updatedConnection),
                  }))
                )
              }
              isHost={isHost}
            />
          ))}
      </Box>
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
            bottom: ["52%", 20],
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
