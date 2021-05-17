import React, { useEffect, useRef, useState } from "react"
import faker from "faker"
import { COLOR_THEMES, getNextArticlePair, getRandomUsername } from "../utils"
import { IArticlePair, IConnection } from "../types"
import { ArticlesScreen } from "../components"

export const Host: React.FC = () => {
  const ws = useRef<null | WebSocket>(null)
  const [groupId] = useState(faker.finance.bic())
  const [allArticles, setAllArticles] = useState<{
    [key: string]: string
  } | null>(null)
  const [isConnected, setIsConnecting] = useState(false)

  const [articlesHistory, setArticlesHistory] = useState<IArticlePair[]>([])
  const [currentArticlesIndex, setCurrentArticlesIndex] = useState(0)
  const [connectionId, setConnectionId] = useState("")

  const [colorThemeIndex] = useState(
    Math.floor(Math.random() * COLOR_THEMES.length)
  )
  const [connections, setConnections] = useState<IConnection[]>([])

  const currentArticles = articlesHistory[currentArticlesIndex]

  useEffect(() => {
    const initializeGroup = async () => {
      const { articleImgs } = await (
        await fetch("https://wiki-game-data.s3.amazonaws.com/articles.json")
      ).json()
      setAllArticles(articleImgs)
      const initialArticles = getNextArticlePair(
        articleImgs,
        currentArticlesIndex,
        colorThemeIndex
      )

      setArticlesHistory([initialArticles])

      ws.current = new WebSocket(process.env.REACT_APP_WS_URL || "")
      ws.current.onmessage = (message) => {
        const data = JSON.parse(message.data)
        switch (data.action) {
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

      ws.current.onopen = (event) => {
        console.log("connected")
        setIsConnecting(true)

        ws.current?.send(
          JSON.stringify({
            action: "groupCreated",
            username: getRandomUsername(),
            groupId,
            articles: initialArticles,
          })
        )
      }
    }
    initializeGroup()

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (currentArticles && isConnected) {
      ws.current?.send(
        JSON.stringify({
          action: "articlesChanged",
          groupId,
          articles: currentArticles,
        })
      )
    }
  }, [currentArticles, isConnected, groupId])

  return (
    <ArticlesScreen
      shareLink={groupId ? window.location.href + groupId : ""}
      currentArticles={currentArticles}
      goBackArticle={() => {
        if (currentArticlesIndex) {
          setCurrentArticlesIndex(currentArticlesIndex - 1)
        }
      }}
      nextArticle={() => {
        if (allArticles) {
          if (!articlesHistory[currentArticlesIndex + 1]) {
            setArticlesHistory([
              ...articlesHistory,
              getNextArticlePair(
                allArticles,
                currentArticlesIndex + 1,
                colorThemeIndex
              ),
            ])
          }
          setCurrentArticlesIndex(currentArticlesIndex + 1)
        }
      }}
      colorTheme={currentArticles?.colorTheme || COLOR_THEMES[colorThemeIndex]}
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
      isHost
    />
  )
}
