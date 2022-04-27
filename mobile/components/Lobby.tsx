import React, { useContext, useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"
import { BaseScreen } from "../components/BaseScreen"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { useAppSelector } from "../core/redux/hooks"
import { theme } from "../theme"
import { getRandomItemfromArray } from "../utils/helpers"
import { RH, RW } from "../utils/responsive"

export interface Connection {
  username: string
  connectionId: string
  points: number
}

interface LobbyProps {
  groupId: string
  // only admin will have articles
  articles: { img: string; name: string }[] | null
}

export interface Run {
  start: { name: string; img: string }
  end: { name: string; img: string }
  colorTheme: { primary: string; secondary: string }
}

export const Lobby: React.FC<LobbyProps> = ({ groupId, articles }) => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [connectionId, setConnectionId] = useState("")
  const [currentRun, setCurrentRun] = useState<Run | null>(null)
  const [groupNotFound, setGroupNotFound] = useState(false)
  const [groupDeleted, setGroupDeleted] = useState(false)
  const name = useAppSelector((state) => state.user.name)
  const ws = useRef<null | WebSocket>(null)
  const { primary, secondary } = useContext(ColorSchemeContext)

  useEffect(() => {
    ws.current = new WebSocket(
      "wss://g5feck705d.execute-api.us-east-1.amazonaws.com/dev"
    )
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      console.log("recieved message", data)
      switch (data.action) {
        case "connectionsUpdated": {
          setConnections(data.connections)
          break
        }
        case "connectionIdSet": {
          setConnectionId(data.connectionId)
          break
        }
        case "articlesChanged": {
          setCurrentRun(data.articles)
          break
        }
        case "groupNotFound": {
          setGroupNotFound(true)
          break
        }
        case "groupDeleted": {
          setGroupDeleted(true)
          break
        }
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
            articles: {
              start: getRandomItemfromArray(articles),
              end: getRandomItemfromArray(articles),
              colorTheme: { primary, secondary },
            },
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

    ws.current.onclose = () => console.log("disconnected")
  }, [])

  return (
    <BaseScreen backgroundColor={primary}>
      <TitleText style={{ color: secondary, marginBottom: RH(3) }}>
        {groupId}
      </TitleText>

      {connections.map((connection) => (
        <View
          key={connection.connectionId}
          style={{
            backgroundColor: `${secondary}30`,
            padding: RW(5),
            borderRadius: 10,
            justifyContent: "center",
            marginBottom: RH(1.5),
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
        </View>
      ))}
    </BaseScreen>
  )
}
