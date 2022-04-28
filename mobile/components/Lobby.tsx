import { useNavigation } from "@react-navigation/native"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useDispatch } from "react-redux"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useAppSelector } from "../core/redux/hooks"
import { gameActions } from "../core/redux/slices/game"
import { theme } from "../theme"
import { getRandomItemfromArray } from "../utils/helpers"
import { RH, RW } from "../utils/responsive"
import { Header } from "./Header"
import { Run } from "./Run"

interface LobbyProps {
  // only admin will have articles
  articles: { img: string; name: string }[] | null
}

export const Lobby: React.FC<LobbyProps> = ({ articles }) => {
  const connections = useAppSelector((state) => state.game.connections)
  const errorMessage = useAppSelector((state) => state.game.errorMessage)
  const groupId = useAppSelector((state) => state.game.groupId)
  const name = useAppSelector((state) => state.user.name)
  const ws = useRef<null | WebSocket>(null)
  const { primary, secondary } = useContext(ColorSchemeContext)
  const { navigate, goBack } = useNavigation()
  const dispatch = useDispatch()
  useEffect(() => {
    ws.current = new WebSocket(
      "wss://g5feck705d.execute-api.us-east-1.amazonaws.com/dev"
    )
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      console.log("recieved message", data)
      switch (data.action) {
        case "connectionsUpdated": {
          dispatch(gameActions.setConnections(data.connections))
          break
        }
        case "connectionIdSet": {
          dispatch(gameActions.setConnectionId(data.connectionId))
          break
        }
        case "roundChanged": {
          dispatch(gameActions.setRound(data.round))
          if (!data.round) {
            navigate(articles ? "StartLobby" : "JoinLobby")
          } else if (data.round && !data.round.winner) {
            navigate("RoundRun", {
              sendMessage: (event: any) =>
                ws.current?.send(JSON.stringify(event)),
            })
          }
          break
        }
        case "groupNotFound": {
          navigate(articles ? "StartLobby" : "JoinLobby")
          dispatch(gameActions.setErrorMessage("groupNotFound"))
          break
        }
        case "groupDeleted": {
          navigate(articles ? "StartLobby" : "JoinLobby")
          dispatch(gameActions.setErrorMessage("groupDeleted"))
          break
        }
        default:
          console.log("recieved unknown event")
      }
    }

    ws.current.onopen = (event) => {
      console.log("connected")
      if (articles) {
        ws.current?.send(
          JSON.stringify({
            action: "groupCreated",
            username: name,
            groupId,
          })
        )
      } else {
        ws.current?.send(
          JSON.stringify({
            action: "groupJoined",
            groupId,
            username: name,
          })
        )
      }
    }

    ws.current.onclose = () => {
      console.log("disconnected")
      navigate("Home")
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      ws.current?.send(JSON.stringify({ action: "healthCheck" }))
    }, 45 * 1000)
    return () => clearInterval(interval)
  }, [ws.current])

  useEffect(() => {
    return () => ws.current?.close()
  }, [])

  const getText = () => {
    switch (errorMessage) {
      case "groupDeleted":
        return "Lobby ended"
      case "groupNotFound":
        return "404 Group not found"
      default:
        return groupId
    }
  }

  return (
    <BaseScreen
      backgroundColor={primary}
      style={{ paddingBottom: 0, paddingTop: 0 }}
    >
      <Header
        onBackPress={() => {
          if (connections.length > 1 && !errorMessage) {
            Alert.alert("Are you sure you want to leave?", "", [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", style: "destructive", onPress: goBack },
            ])
          } else {
            goBack()
          }
        }}
      />
      <TitleText style={{ color: secondary }}>{getText()}</TitleText>
      <View
        style={{
          flex: 1,
          ...(!connections.length && { justifyContent: "center" }),
        }}
      >
        {connections.length ? (
          connections.map((connection) => (
            <View
              key={connection.connectionId}
              style={{
                backgroundColor: `${secondary}30`,
                padding: RW(5),
                borderRadius: 10,
                justifyContent: "space-between",
                marginBottom: RH(1.5),
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: 20,
                  color: secondary,
                }}
              >
                {connection.username}
              </Text>
              <Text
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: 20,
                  color: secondary,
                }}
              >
                {connection.points}
              </Text>
            </View>
          ))
        ) : (
          <ActivityIndicator color={secondary} />
        )}
      </View>
      {articles && (
        <TouchableOpacity
          onPress={() =>
            ws.current?.send(
              JSON.stringify({
                action: "roundChanged",
                groupId,
                round: {
                  start: getRandomItemfromArray(articles),
                  end: getRandomItemfromArray(articles),
                },
              })
            )
          }
          disabled={connections.length < 2}
          activeOpacity={0.6}
          style={{
            backgroundColor: secondary,
            borderRadius: 10,
            padding: RW(5),
            alignItems: "center",
            opacity: connections.length < 2 ? 0.8 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily,
              color: primary,
              fontSize: 20,
            }}
          >
            Start round!
          </Text>
        </TouchableOpacity>
      )}
    </BaseScreen>
  )
}
