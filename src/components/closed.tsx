import React from "react"
import { Box, Text } from "rebass"
import { COLOR_THEMES } from "./host"

export const ClosedScreen: React.SFC<{
  type: "notFound" | "deleted" | "loading"
}> = ({ type }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "fixed",
        backgroundColor: COLOR_THEMES[0].secondary,
        padding: 20,
        flexDirection: "column",
      }}
    >
      <Text
        sx={{
          color: COLOR_THEMES[0].primary,
          fontFamily: "Bebas Neue",
          fontSize: 70,
          transition: "background-color 400ms linear",
          transform: "scale(1, 1.2)",
        }}
      >
        {type === "notFound"
          ? "404 LOBBY NOT FOUND"
          : type === "loading"
          ? "LOADING"
          : "LOBBY ENDED"}
      </Text>
      <Text
        sx={{
          color: COLOR_THEMES[0].primary,
          width: "100%",
          fontFamily: "Open Sans",
          fontSize: 12,
          cursor: "pointer",
          paddingY: 10,
        }}
        onClick={() => (window.location.href = window.location.origin)}
      >
        click here to start new game
      </Text>
    </Box>
  )
}
