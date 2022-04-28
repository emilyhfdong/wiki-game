import React, { useContext } from "react"
import { View, Text, ViewStyle } from "react-native"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { theme } from "../theme"
import { RH, RW } from "../utils/responsive"
import { BackButton } from "./BackButton"

interface HeaderProps {
  title?: string
  hasBackButton?: boolean
  rightComponent?: React.ReactElement
  style?: ViewStyle
  onBackPress?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  rightComponent,
  hasBackButton = true,
  style,
  onBackPress,
}) => {
  const { secondary } = useContext(ColorSchemeContext)
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: RH(2),
        justifyContent: "space-between",
        alignItems: "center",
        width: RW(100),
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: RW(75),
        }}
      >
        {hasBackButton && <BackButton onBackPress={onBackPress} />}
        <Text
          style={{
            fontSize: 20,
            color: secondary,
            fontFamily: theme.fontFamily,
          }}
        >
          {title}
        </Text>
      </View>
      {rightComponent}
    </View>
  )
}
