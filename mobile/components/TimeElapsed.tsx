import React, { useContext, useEffect, useState } from "react"
import { DateTime, Duration } from "luxon"
import { Text } from "react-native"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { theme } from "../theme"

interface TimeElapsedProps {
  startTime: DateTime | undefined
  endTime: DateTime | undefined
}

export const TimeElapsed: React.FC<TimeElapsedProps> = ({
  startTime,
  endTime,
}) => {
  const [timeElapsed, setTimeElapsed] = useState("")
  const { secondary } = useContext(ColorSchemeContext)
  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const end = endTime || DateTime.now()
        setTimeElapsed(end.diff(startTime).toFormat("m:ss"))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime])
  return (
    <Text
      style={{ fontSize: 15, color: secondary, fontFamily: theme.fontFamily }}
    >
      {timeElapsed}
    </Text>
  )
}
