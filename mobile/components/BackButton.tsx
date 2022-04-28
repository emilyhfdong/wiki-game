import React, { useContext } from "react"
import { TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useNavigation } from "@react-navigation/native"

interface BackButtonProps {
  onBackPress?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({ onBackPress }) => {
  const { secondary } = useContext(ColorSchemeContext)
  const { goBack } = useNavigation()
  return (
    <TouchableOpacity onPress={onBackPress || goBack}>
      <Ionicons color={`${secondary}90`} name="chevron-back" size={30} />
    </TouchableOpacity>
  )
}
