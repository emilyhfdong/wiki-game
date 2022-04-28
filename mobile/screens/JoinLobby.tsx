import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Lobby } from "../components/Lobby"
import { SingleTextInputScreen } from "../components/SingleTextInputScreen"
import { useAppSelector } from "../core/redux/hooks"
import { gameActions } from "../core/redux/slices/game"

export const JoinLobby: React.FC = () => {
  const [localGroupId, setLocalGroupId] = useState("")
  const groupId = useAppSelector((state) => state.game.groupId)
  const dispatch = useDispatch()
  if (!groupId) {
    return (
      <SingleTextInputScreen
        value={localGroupId}
        setValue={setLocalGroupId}
        title="ENTER CODE"
        onEnter={() =>
          dispatch(gameActions.setGroupId(localGroupId.toUpperCase()))
        }
      />
    )
  }

  return <Lobby articles={null} />
}
