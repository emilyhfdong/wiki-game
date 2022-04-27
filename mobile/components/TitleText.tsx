import React from "react"
import { Text, TextStyle } from "react-native"
import { theme } from "../theme"

interface TitleTextProps {
  style?: TextStyle
}

export const TitleText: React.FC<TitleTextProps> = ({ style, children }) => {
  return (
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 80,
        lineHeight: 80,
        color: theme.colors.pink,
        fontFamily: theme.fontFamily,
        opacity: 0.8,
        ...style,
      }}
    >
      {children}
    </Text>
  )
}
