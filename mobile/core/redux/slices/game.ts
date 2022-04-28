import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Round {
  start: { name: string; img: string }
  end: { name: string; img: string }
  colorTheme: { primary: string; secondary: string }
  winner?: {
    connectionId: string
    path: string[]
  }
}
export interface Connection {
  username: string
  connectionId: string
  points: number
}

type GameErrorMessage = "groupNotFound" | "groupDeleted" | null

interface Game {
  connectionId: string
  connections: Connection[]
  round: Round | null
  errorMessage: GameErrorMessage
  groupId: string
  isAdmin: boolean
}

const initialState: Game = {
  connectionId: "",
  connections: [],
  round: null,
  errorMessage: null,
  groupId: "",
  isAdmin: false,
}

export const gameSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setConnectionId: (state, action: PayloadAction<string>) => ({
      ...state,
      connectionId: action.payload,
    }),
    setGroupId: (state, action: PayloadAction<string>) => ({
      ...state,
      groupId: action.payload,
    }),
    setConnections: (state, action: PayloadAction<Connection[]>) => ({
      ...state,
      connections: action.payload,
    }),
    setRound: (state, action: PayloadAction<Round | null>) => ({
      ...state,
      round: action.payload,
    }),
    setErrorMessage: (state, action: PayloadAction<GameErrorMessage>) => ({
      ...state,
      errorMessage: action.payload,
    }),
    reset: (_state, action: PayloadAction<{ isAdmin: boolean }>) => ({
      ...initialState,
      isAdmin: action.payload.isAdmin,
    }),
  },
})

export const gameActions = gameSlice.actions
