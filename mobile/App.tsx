import React from "react"
import Navigation from "./core/navigation"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue"
import { QueryClientProvider } from "react-query"
import { queryClient } from "./core/query/client"
import { persistor, store } from "./core/redux/store"
import { LogBox } from "react-native"
import { StatusBar } from "expo-status-bar"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
])
export default function App() {
  const [fontsLoaded] = useFonts({ BebasNeue_400Regular })
  if (!fontsLoaded) {
    return null
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
