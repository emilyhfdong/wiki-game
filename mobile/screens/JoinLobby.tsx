import React, { useState } from "react"
import { Lobby } from "../components/Lobby"
import { SingleTextInputScreen } from "../components/SingleTextInputScreen"

export const JoinLobby: React.FC = () => {
  const [groupId, setGroupId] = useState("")
  const [finalGroupId, setFinalGroupId] = useState("")

  if (!finalGroupId) {
    return (
      <SingleTextInputScreen
        value={groupId}
        setValue={setGroupId}
        title="ENTER CODE"
        onEnter={() => setFinalGroupId(groupId.toUpperCase())}
      />
    )
  }

  return <Lobby groupId={finalGroupId} articles={null} />
}
