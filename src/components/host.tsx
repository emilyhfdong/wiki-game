import React, { useEffect, useRef, useState } from "react"
import { Blah } from "./blah"

export interface IArticle {
  img: string
  name: string
}

export interface IArticlePair {
  start: IArticle
  end: IArticle
  colorTheme: { primary: string; secondary: string }
}

export const COLOR_THEMES = [
  { primary: "#FDF2E3", secondary: "#000000" },
  { primary: "#EAB39D", secondary: "#E62E3B" },
  { primary: "#C5CAB3", secondary: "#135142" },
]

const getNextArticlePair = (
  articleImgs: { [key: string]: string },
  currentArticlesIndex: number,
  initialColorThemeIndex: number
): IArticlePair => {
  const nextColourIndex =
    (initialColorThemeIndex + currentArticlesIndex) % COLOR_THEMES.length

  const numberOfItems = Object.keys(articleImgs).length
  const startIndex = Math.floor(Math.random() * (numberOfItems - 1))
  const endIndex = Math.floor(Math.random() * (numberOfItems - 1))
  return {
    start: {
      img: Object.values(articleImgs)[startIndex] as string,
      name: Object.keys(articleImgs)[startIndex],
    },
    end: {
      img: Object.values(articleImgs)[endIndex] as string,
      name: Object.keys(articleImgs)[endIndex],
    },
    colorTheme: COLOR_THEMES[nextColourIndex],
  }
}

export const Host: React.FC = () => {
  const ws = useRef<null | WebSocket>(null)
  const [groupId, setGroupId] = useState("")
  const [allArticles, setAllArticles] = useState<{
    [key: string]: string
  } | null>(null)
  const [articlesHistory, setArticlesHistory] = useState<IArticlePair[]>([])
  const [currentArticlesIndex, setCurrentArticlesIndex] = useState(0)

  const [colorThemeIndex] = useState(
    Math.floor(Math.random() * COLOR_THEMES.length)
  )

  const currentArticles = articlesHistory[currentArticlesIndex]

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WS_URL || "")
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data)
      switch (data.action) {
        case "idsAssigned": {
          setGroupId(data.groupId)
          break
        }
      }
    }

    ws.current.onopen = (event) => {
      console.log("connected")
      ws.current?.send(JSON.stringify({ action: "connected" }))
    }

    fetch("https://wiki-game-data.s3.amazonaws.com/articles.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const { articleImgs } = jsonData
        setAllArticles(articleImgs)

        setArticlesHistory([
          getNextArticlePair(
            articleImgs,
            currentArticlesIndex,
            colorThemeIndex
          ),
        ])
      })
  }, [colorThemeIndex, currentArticlesIndex])

  useEffect(() => {
    if (currentArticles && groupId) {
      ws.current?.send(
        JSON.stringify({
          action: "articlesChanged",
          groupId,
          articles: currentArticles,
        })
      )
    }
  }, [currentArticles, groupId])

  return (
    <Blah
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
    />
  )
}
