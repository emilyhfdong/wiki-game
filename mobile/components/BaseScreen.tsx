import React, { useContext } from "react"
import { SafeAreaView, StyleProp, View, ViewStyle } from "react-native"
import { RH, RW } from "../utils/responsive"

interface BaseScreenProps {
  backgroundColor: string
  style?: ViewStyle
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  backgroundColor,
  style,
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
          ...style,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  )
}
