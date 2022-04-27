import { Dimensions } from "react-native"

export const RH = (percent: number) =>
  Dimensions.get("screen").height * (percent / 100)

export const RW = (percent: number) =>
  Dimensions.get("screen").width * (percent / 100)
