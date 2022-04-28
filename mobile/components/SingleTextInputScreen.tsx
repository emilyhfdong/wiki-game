import React from "react"
import { View, TextInput, TouchableOpacity } from "react-native"
import { theme } from "../theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"
import { Header } from "./Header"

interface SingleTextInputScreenProps {
  value: string
  setValue: (value: string) => void
  title: string
  onEnter: () => void
  isLoading?: boolean
  hasBackButton?: boolean
}

export const SingleTextInputScreen: React.FC<SingleTextInputScreenProps> = ({
  value,
  setValue,
  title,
  isLoading,
  onEnter,
  hasBackButton = true,
}) => {
  return (
    <BaseScreen
      backgroundColor={theme.colors.red}
      style={hasBackButton ? { paddingVertical: 0 } : {}}
    >
      {hasBackButton && <Header />}
      <TitleText style={{ color: theme.colors.pink }}>{title}</TitleText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <TextInput
          style={{
            borderBottomColor: theme.colors.pink,
            borderBottomWidth: 3,
            fontSize: 70,
            fontFamily: theme.fontFamily,
            color: theme.colors.pink,
            flex: 1,
            marginRight: 5,
          }}
          autoFocus
          value={value}
          onChangeText={setValue}
          selectionColor={theme.colors.pink}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={{ opacity: isLoading ? 0.8 : 1 }}
          disabled={isLoading}
          onPress={onEnter}
        >
          <Ionicons
            color={theme.colors.pink}
            name="arrow-forward-circle-outline"
            size={50}
          />
        </TouchableOpacity>
      </View>
    </BaseScreen>
  )
}
