import React, { useEffect, useRef, useState } from "react"
import { IArticlePair } from "./host"
import { Blah } from "./blah"
import { ClosedScreen } from "./closed"

export const Participant: React.FC = () => {
  const ws = useRef<null | WebSocket>(null)
  const [currentArticles, setCurrentArticles] = useState<IArticlePair | null>(
    null
  )
  const [groupNotFound, setGroupNotFound] = useState(false)
  const [groupDeleted, setGroupDeleted] = useState(false)

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
      }
    }

    ws.current.onopen = () => {
      console.log("connected")
      ws.current?.send(JSON.stringify({ action: "groupJoined", groupId }))
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
    />
  )
}
