import React, { useContext } from "react"
import { SafeAreaView, View } from "react-native"
import { RH, RW } from "../utils/responsive"

interface BaseScreenProps {
  backgroundColor: string
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  backgroundColor,
}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: RW(5),
          paddingVertical: RH(5),
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  )
}
