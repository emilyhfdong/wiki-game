import { useNavigation } from "@react-navigation/native"
import React, { useContext } from "react"
import { Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { useDispatch } from "react-redux"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useAppSelector } from "../core/redux/hooks"
import { gameActions } from "../core/redux/slices/game"
import { theme } from "../theme"
import { RH, RW } from "../utils/responsive"

export const HomeScreen: React.FC = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const name = useAppSelector((state) => state.user.name)
  const { navigate } = useNavigation()
  const dispatch = useDispatch()

  return (
    <BaseScreen backgroundColor={primary}>
      <TitleText style={{ color: secondary }}>
        WELCOME,{"\n"}
        {name}
      </TitleText>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton
          text="Start a lobby"
          onPress={() => {
            dispatch(gameActions.reset({ isAdmin: true }))
            navigate("StartLobby")
          }}
        />
        <HomeButton
          text="Join a lobby"
          onPress={() => {
            dispatch(gameActions.reset({ isAdmin: false }))
            navigate("JoinLobby")
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: RH(2),
          justifyContent: "space-between",
        }}
      >
        <HomeButton
          style={{ width: "100%" }}
          onPress={() => navigate("SpeedRun")}
          text="Practice"
        />
        {/* <HomeButton text="" /> */}
      </View>
    </BaseScreen>
  )
}

interface HomeButtonProps {
  text: string
  onPress?: () => void
  style?: ViewStyle
}

export const HomeButton: React.FC<HomeButtonProps> = ({
  text,
  onPress,
  style,
}) => {
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
        ...style,
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
