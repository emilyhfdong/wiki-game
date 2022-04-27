import React, { useContext } from "react"
import { BaseScreen } from "../components/BaseScreen"
import { ColorSchemeContext } from "../core/context/color-scheme"

interface ISpeedRunScreenProps {}

export const SpeedRunScreen: React.FC<ISpeedRunScreenProps> = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  return <BaseScreen backgroundColor={primary}></BaseScreen>
}
