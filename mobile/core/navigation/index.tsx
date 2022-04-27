import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as React from "react"
import { HomeScreen } from "../../screens/Home"
import { SignupScreen } from "../../screens/Signup"
import { getRandomColorScheme } from "../../theme"
import { ColorSchemeContext } from "../context/color-scheme"
import { useAppSelector } from "../redux/hooks"

export default function Navigation() {
  const [colorScheme, setColorScheme] = React.useState(getRandomColorScheme())

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      <NavigationContainer
        onStateChange={() => setColorScheme(getRandomColorScheme())}
      >
        <RootNavigator />
      </NavigationContainer>
    </ColorSchemeContext.Provider>
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
