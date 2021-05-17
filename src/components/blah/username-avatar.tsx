import React, { RefObject, useRef, useState } from "react"
import { Box, Text } from "rebass"
import { IColorTheme, IConnection } from "../../types"
import { Input } from "@rebass/forms"

export const UsernameAvatar: React.FC<{
  connection: IConnection
  colorTheme: IColorTheme
  isSelf: boolean
  updateConnection: (connection: Partial<IConnection>) => void
  isHost: boolean
}> = ({ connection, colorTheme, isSelf, updateConnection, isHost }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fullNameRef = useRef<HTMLElement>(null)

  const isExpanded = isEditing || isHovering

  return (
    <Box
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        backgroundColor: isSelf ? colorTheme.secondary : colorTheme.primary,
        border: `1.5px solid ${colorTheme.secondary}`,
        height: 30,
        width: isExpanded ? (fullNameRef.current?.offsetWidth || 20) + 13 : 30,
        borderRadius: 15,
        marginRight: "5px",
        display: "flex",
        justifyContent: isExpanded ? "center" : "center",
        paddingLeft: isExpanded ? "2px" : 0,
        alignItems: "center",
        cursor: "default",
        transition:
          "width 200ms linear, background-color 400ms linear, border 400ms linear",
        overflow: "hidden",
      }}
    >
      {!isExpanded ? (
        <Text
          sx={{
            color: isSelf ? colorTheme.primary : colorTheme.secondary,
            fontSize: 11,
            fontWeight: 500,
            transition: "font-size 200ms linear, color 400ms linear",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {connection.username
            .split(" ")
            .map((word) => word[0].toUpperCase())
            .join("")}{" "}
        </Text>
      ) : (
        <FullAvatarContent
          isSelf={isSelf}
          connection={connection}
          colorTheme={colorTheme}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateConnection={updateConnection}
          isHost={isHost}
        />
      )}

      <FullAvatarContent
        key="layout"
        boxRef={fullNameRef}
        connection={connection}
        colorTheme={colorTheme}
        forLayout
        isSelf={isSelf}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        updateConnection={updateConnection}
        isHost={isHost}
      />
    </Box>
  )
}

interface IFullAvatarContentProps {
  boxRef?: RefObject<HTMLElement>
  connection: IConnection
  colorTheme: IColorTheme
  forLayout?: boolean
  isSelf: boolean
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  updateConnection: (connection: Partial<IConnection>) => void
  isHost: boolean
}

export const FullAvatarContent: React.FC<IFullAvatarContentProps> = ({
  boxRef,
  connection,
  colorTheme,
  forLayout,
  isSelf,
  isEditing,
  setIsEditing,
  updateConnection,
  isHost,
}) => {
  const [editingUsername, setEditingUsername] = useState("")

  const finishEditing = () => {
    if (editingUsername !== connection.username) {
      updateConnection({ username: editingUsername })
    }
    setEditingUsername("")
    setIsEditing(false)
  }

  return (
    <Box
      ref={boxRef}
      sx={{
        ...(forLayout && { opacity: 0, position: "absolute", zIndex: -1 }),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isEditing && !forLayout ? (
        <Input
          value={editingUsername}
          onChange={(e) => setEditingUsername(e.target.value.toUpperCase())}
          sx={{
            outline: "none",
            border: "none",
            fontSize: 9,
            fontWeight: 600,
            color: isSelf ? colorTheme.primary : colorTheme.secondary,
            textAlign: "center",
          }}
          onBlur={() => finishEditing()}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              finishEditing()
            }
          }}
          autoFocus
        />
      ) : (
        <>
          <Text
            sx={{
              color: isSelf ? colorTheme.primary : colorTheme.secondary,
              fontSize: 9,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {connection.username.toUpperCase()} - {connection.points}
          </Text>
          {isHost && (
            <>
              <AvatarButton
                onClick={() =>
                  updateConnection({ points: connection.points + 1 })
                }
                iconClassName="fas fa-plus"
                colorTheme={colorTheme}
                isSelf={isSelf}
              />
              <AvatarButton
                onClick={() =>
                  connection.points &&
                  updateConnection({ points: connection.points - 1 })
                }
                iconClassName="fas fa-minus"
                colorTheme={colorTheme}
                isSelf={isSelf}
              />
            </>
          )}
          {isSelf && (
            <AvatarButton
              onClick={() => {
                !forLayout && setIsEditing(true)
              }}
              iconClassName="fas fa-edit"
              colorTheme={colorTheme}
              isSelf={isSelf}
            />
          )}
        </>
      )}
    </Box>
  )
}

export const AvatarButton: React.FC<{
  iconClassName: string
  onClick: () => void
  colorTheme: IColorTheme
  isSelf: boolean
}> = ({ iconClassName, onClick, colorTheme, isSelf }) => (
  <Box
    onClick={onClick}
    sx={{
      height: 16,
      width: 16,
      borderRadius: 8,
      backgroundColor: isSelf ? colorTheme.primary : colorTheme.secondary,
      marginLeft: "3px",
      fontSize: "7px",
      color: isSelf ? colorTheme.secondary : colorTheme.primary,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      cursor: "pointer",
      ":hover": {
        opacity: 0.8,
      },
      ":active": {
        opacity: 0.6,
      },
    }}
  >
    <i className={iconClassName} />
  </Box>
)
