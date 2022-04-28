import React, { useContext, useEffect, useRef } from "react"
import { Animated, ScrollView, Text, View } from "react-native"
import { BaseScreen } from "../components/BaseScreen"
import { Header } from "../components/Header"
import { Run } from "../components/Run"
import { TitleText } from "../components/TitleText"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { RootStackScreenProps } from "../core/navigation/types"
import { useAppSelector } from "../core/redux/hooks"
import { theme } from "../theme"
import { getReadableTextFromName } from "../utils/helpers"
import { RH } from "../utils/responsive"

export const RoundRun: React.FC<RootStackScreenProps<"RoundRun">> = ({
  route: {
    params: { sendMessage },
  },
}) => {
  const round = useAppSelector((state) => state.game.round)
  const groupId = useAppSelector((state) => state.game.groupId)
  const connectionId = useAppSelector((state) => state.game.connectionId)
  const connections = useAppSelector((state) => state.game.connections)
  const isAdmin = useAppSelector((state) => state.game.isAdmin)
  const { primary } = useContext(ColorSchemeContext)

  if (!round) {
    return null
  }
  return (
    <>
      <Run
        start={round.start.name}
        end={round.end.name}
        onCompleted={({ path }) => {
          sendMessage({
            action: "roundChanged",
            groupId,
            round: { ...round, winner: { path, connectionId } },
          })
          sendMessage({
            action: "connectionsUpdated",
            groupId,
            connections: connections.map((connection) =>
              connection.connectionId === connectionId
                ? { ...connection, points: connection.points + 1 }
                : connection
            ),
          })
        }}
        hasBackButton={isAdmin}
        onBackPress={() =>
          sendMessage({ action: "roundChanged", groupId, round: null })
        }
      />
      {round.winner && (
        <WinSummary
          onBackPress={() =>
            sendMessage({ action: "roundChanged", groupId, round: null })
          }
          path={round.winner.path}
          winnerName={
            round.winner.connectionId === connectionId
              ? "YOU"
              : connections.find(
                  (connection) =>
                    connection.connectionId === round.winner?.connectionId
                )?.username || ""
          }
          hasBackButton={isAdmin}
        />
      )}
    </>
  )
}

interface WinSummaryProps {
  onBackPress: () => void
  winnerName: string
  hasBackButton?: boolean
  path: string[]
}

export const WinSummary: React.FC<WinSummaryProps> = ({
  onBackPress,
  winnerName,
  hasBackButton,
  path,
}) => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, useNativeDriver: true }).start()
  }, [])

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: fadeAnim,
      }}
    >
      <BaseScreen
        style={{ paddingBottom: 0, paddingTop: 0, alignItems: "center" }}
        backgroundColor={primary}
      >
        <Header hasBackButton={hasBackButton} onBackPress={onBackPress} />
        <TitleText
          style={{ color: secondary, marginBottom: RH(2), textAlign: "center" }}
        >
          {winnerName.toUpperCase() === "YOU"
            ? "YOU WIN!"
            : winnerName + " WON"}
        </TitleText>
        <ScrollView style={{ width: "100%" }}>
          {path.map((article, idx) => (
            <Text
              style={{
                fontFamily: theme.fontFamily,
                fontSize: 20,
                marginBottom: RH(2),
                textAlign: "center",
                color: secondary,
              }}
              key={idx}
            >
              {getReadableTextFromName(article)}
            </Text>
          ))}
        </ScrollView>
      </BaseScreen>
    </Animated.View>
  )
}
