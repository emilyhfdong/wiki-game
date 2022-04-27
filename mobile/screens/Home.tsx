import React, { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { BaseScreen } from "../components/BaseScreen"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useAppSelector } from "../core/redux/hooks"
import { theme } from "../theme"
import { RH, RW } from "../utils/responsive"

export const HomeScreen: React.FC = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const name = useAppSelector((state) => state.user.name)

  return (
    <BaseScreen backgroundColor={primary}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 80,
          lineHeight: 80,
          color: secondary,
          fontFamily: theme.fontFamily,
          opacity: 0.8,
        }}
      >
        WELCOME, {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton text="Speed run" />
        <HomeButton text="Race run" />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton text="Start a lobby" />
        <HomeButton text="Join a lobby" />
      </View>
    </BaseScreen>
  )
}

interface HomeButtonProps {
  text: string
  onPress?: () => void
}

export const HomeButton: React.FC<HomeButtonProps> = ({ text, onPress }) => {
  const { secondary } = useContext(ColorSchemeContext)
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        backgroundColor: `${secondary}30`,
        height: RW(43),
        width: RW(43),
        borderRadius: RW(5),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ color: secondary, fontFamily: theme.fontFamily, fontSize: 20 }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}
