import React from "react"
import Navigation from "./navigation"
import { Provider } from "react-redux"
import { persistor, store } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue"
import { QueryClientProvider } from "react-query"
import { queryClient } from "./query/client"

export default function App() {
  const [fontsLoaded] = useFonts({ BebasNeue_400Regular })
  if (!fontsLoaded) {
    return null
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
