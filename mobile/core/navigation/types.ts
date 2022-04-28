import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RunProps } from "../../components/Run"
import { DateTime } from "luxon"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined
  Signup: undefined
  SpeedRun: undefined
  StartLobby: undefined
  JoinLobby: undefined
  RoundRun: { sendMessage: (event: any) => void }
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>
