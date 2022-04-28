import React, { useContext, useEffect, useState } from "react"
import { DateTime } from "luxon"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text } from "react-native"
import { RH, RW } from "../utils/responsive"
import {
  getArticleUrl,
  getArticleNameFromUrl,
  getReadableTextFromName,
} from "../utils/helpers"
import { theme } from "../theme"
import { TimeElapsed } from "./TimeElapsed"
import WebView from "react-native-webview"
import { Header } from "./Header"

export interface RunProps {
  start: string
  end: string
  onCompleted: (data: { path: string[]; totalSeconds: number }) => void
  startTime?: DateTime
  hasBackButton?: boolean
  onBackPress?: () => void
}

export const Run: React.FC<RunProps> = ({
  start,
  end,
  startTime,
  onCompleted,
  hasBackButton = true,
  onBackPress,
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
      <Header
        style={{ paddingHorizontal: RW(2) }}
        hasBackButton={hasBackButton}
        onBackPress={onBackPress}
        title={`${getReadableTextFromName(start)} > ${getReadableTextFromName(
          end
        )}`}
        rightComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {startTime && (
              <TimeElapsed startTime={startTime} endTime={endTime} />
            )}
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
                {path.length - 1}
              </Text>
            </View>
          </View>
        }
      />
      <WebView
        onLoadEnd={(event) => {
          //@ts-expect-error
          const isRedirect = Boolean(event.nativeEvent.navigationType)
          const articleName = getArticleNameFromUrl(event.nativeEvent.url)
          const newPath = [...path, ...(isRedirect ? [] : [articleName])]
          setPath(newPath)
          if (articleName === end) {
            const now = DateTime.now()
            setEndTime(now)
            onCompleted({
              path: newPath,
              totalSeconds: startTime ? now.diff(startTime).seconds : 0,
            })
          }
        }}
        source={{ uri: getArticleUrl(start) }}
      />
    </SafeAreaView>
  )
}
