import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { theme } from "../theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useMutation } from "react-query"
import { BackendService } from "../backend"
import { useDispatch } from "react-redux"
import { userActions } from "../core/redux/slices/user"
import { RootStackScreenProps } from "../core/navigation/types"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"

export const SignupScreen: React.FC<RootStackScreenProps<"Signup">> = ({
  navigation,
}) => {
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const { mutate, isLoading } = useMutation(
    ({ name }: { name: string }) => BackendService.createUser(name),
    {
      onSuccess: (createdUser) => {
        dispatch(userActions.setUser(createdUser))
        navigation.navigate("Home")
      },
    }
  )
  return (
    <BaseScreen backgroundColor={theme.colors.red}>
      <TitleText style={{ color: theme.colors.pink }}>
        WHAT'S YOUR NAME?
      </TitleText>
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
          value={name}
          onChangeText={setName}
          selectionColor={theme.colors.pink}
        />
        <TouchableOpacity
          style={{ opacity: isLoading ? 0.8 : 1 }}
          disabled={isLoading}
          onPress={() => mutate({ name })}
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
