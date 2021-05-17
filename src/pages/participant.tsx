import React, { useEffect, useRef, useState } from "react"

import { getRandomUsername } from "../utils"
import { IArticlePair, IConnection } from "../types"
import { Blah, ClosedScreen } from "../components"

export const Participant: React.FC = () => {
  const ws = useRef<null | WebSocket>(null)
  const [currentArticles, setCurrentArticles] = useState<IArticlePair | null>(
    null
  )
  const [groupNotFound, setGroupNotFound] = useState(false)
  const [groupDeleted, setGroupDeleted] = useState(false)
  const [connections, setConnections] = useState<IConnection[]>([])
  const [connectionId, setConnectionId] = useState("")

  const groupId = window.location.pathname.slice(1)

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WS_URL || "")
    ws.current.onmessage = (message) => {
      console.log("message", message)
      const data = JSON.parse(message.data)
      switch (data.action) {
        case "articlesChanged": {
          setCurrentArticles(data.articles)
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
        case "connectionsUpdated": {
          setConnections(data.connections)
          break
        }
        case "connectionIdSet": {
          setConnectionId(data.connectionId)
          break
        }
      }
    }

    ws.current.onopen = () => {
      console.log("connected")
      ws.current?.send(
        JSON.stringify({
          action: "groupJoined",
          groupId,
          username: getRandomUsername(),
        })
      )
    }
  }, [groupId])

  if (groupNotFound) {
    return <ClosedScreen type="notFound" />
  }
  if (groupDeleted) {
    return <ClosedScreen type="deleted" />
  }

  return (
    <Blah
      currentArticles={currentArticles}
      colorTheme={currentArticles?.colorTheme}
      connections={connections}
      connectionId={connectionId}
      setConnections={(updatedConnections) => {
        setConnections(updatedConnections)
        ws.current?.send(
          JSON.stringify({
            action: "connectionsUpdated",
            groupId,
            connections: updatedConnections,
          })
        )
      }}
      isHost={false}
    />
  )
}
