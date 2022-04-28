import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
}

const initialState: User = {
  id: "",
  name: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<User>) => action.payload,
  },
})

export const userActions = userSlice.actions
