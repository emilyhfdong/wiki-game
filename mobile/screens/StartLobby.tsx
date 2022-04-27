import React, { useContext, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import { useQuery } from "react-query"
import { BackendService } from "../backend"
import { BaseScreen } from "../components/BaseScreen"
import { Lobby } from "../components/Lobby"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { QueryKeys } from "../core/query/client"
import { useAppSelector } from "../core/redux/hooks"
import { theme } from "../theme"
import { generateRandomId, getRandomItemfromArray } from "../utils/helpers"
import { RH, RW } from "../utils/responsive"

export interface Connection {
  username: string
  connectionId: string
  points: number
}

export const StartLobby: React.FC = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const [groupId] = useState(generateRandomId())

  const { data } = useQuery(QueryKeys.ARTICLES, BackendService.getArticles)

  if (data) {
    return <Lobby articles={data} groupId={groupId} />
  }
  return (
    <BaseScreen
      backgroundColor={primary}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator />
    </BaseScreen>
  )
}
