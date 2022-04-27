import React, { useContext, useEffect, useState } from "react"
import { DateTime } from "luxon"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text } from "react-native"
import { RH, RW } from "../utils/responsive"
import { BackButton } from "./BackButton"
import {
  getArticleUrl,
  getArticleNameFromUrl,
  getReadableTextFromName,
} from "../utils/helpers"
import { theme } from "../theme"
import { TimeElapsed } from "./TimeElapsed"
import WebView from "react-native-webview"

interface RunProps {
  start: string
  end: string
  onCompleted: (data: { path: string[]; totalSeconds: number }) => void
  startTime?: DateTime
}

export const Run: React.FC<RunProps> = ({
  start,
  end,
  startTime,
  onCompleted,
}) => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const [path, setPath] = useState<string[]>([])
  const [endTime, setEndTime] = useState<DateTime>()

  useEffect(() => {
    setPath([])
  }, [start])

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: primary,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingVertical: RH(2),
          paddingHorizontal: RW(2),
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: RW(75),
          }}
        >
          <BackButton />
          <Text
            style={{
              fontSize: 20,
              color: secondary,
              fontFamily: theme.fontFamily,
            }}
          >
            {getReadableTextFromName(start)} {">"}{" "}
            {getReadableTextFromName(end)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TimeElapsed startTime={startTime} endTime={endTime} />
          <View
            style={{
              marginLeft: RW(3),
              backgroundColor: secondary,
              height: RH(3),
              width: RH(3),
              borderRadius: RH(1.5),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 15,
                color: primary,
                fontFamily: theme.fontFamily,
                paddingTop: 2,
              }}
            >
              {path.length ? path.length - 1 : 0}
            </Text>
          </View>
        </View>
      </View>
      <WebView
        onLoadEnd={(event) => {
          if (event.nativeEvent.url) {
            const articleName = getArticleNameFromUrl(event.nativeEvent.url)
            setPath([...path, articleName])
            if (articleName === end) {
              const now = DateTime.now()
              setEndTime(now)
              onCompleted({
                path,
                totalSeconds: startTime ? now.diff(startTime).seconds : 0,
              })
            }
          }
        }}
        source={{ uri: getArticleUrl(start) }}
      />
    </SafeAreaView>
  )
}
