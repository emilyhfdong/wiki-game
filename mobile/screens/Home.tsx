import { useNavigation } from "@react-navigation/native"
import React, { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useAppSelector } from "../core/redux/hooks"
import { theme } from "../theme"
import { RH, RW } from "../utils/responsive"

export const HomeScreen: React.FC = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const name = useAppSelector((state) => state.user.name)
  const { navigate } = useNavigation()

  return (
    <BaseScreen backgroundColor={primary}>
      <TitleText style={{ color: secondary }}>WELCOME, {name}</TitleText>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton onPress={() => navigate("SpeedRun")} text="Speed run" />
        <HomeButton text="Race run" />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton
          text="Start a lobby"
          onPress={() => navigate("StartLobby")}
        />
        <HomeButton text="Join a lobby" onPress={() => navigate("JoinLobby")} />
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
