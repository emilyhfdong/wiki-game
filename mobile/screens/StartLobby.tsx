import React, { useContext, useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { useQuery } from "react-query"
import { useDispatch } from "react-redux"
import { BackendService } from "../backend"
import { BaseScreen } from "../components/BaseScreen"
import { Lobby } from "../components/Lobby"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { QueryKeys } from "../core/query/client"
import { useAppSelector } from "../core/redux/hooks"
import { gameActions } from "../core/redux/slices/game"
import { generateRandomId } from "../utils/helpers"

export interface Connection {
  username: string
  connectionId: string
  points: number
}

export const StartLobby: React.FC = () => {
  const { primary } = useContext(ColorSchemeContext)
  const groupId = useAppSelector((state) => state.game.groupId)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(gameActions.setGroupId(generateRandomId()))
  }, [])

  const { data } = useQuery(QueryKeys.ARTICLES, BackendService.getArticles)

  if (data && groupId) {
    return <Lobby articles={data} />
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
