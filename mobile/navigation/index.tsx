import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as React from "react"
import { useAppSelector } from "../redux/hooks"
import { HomeScreen } from "../screens/Home"
import { SignupScreen } from "../screens/Signup"

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

export const RootNavigator: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  return (
    <Stack.Navigator initialRouteName={userId ? "Home" : "Signup"}>
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
