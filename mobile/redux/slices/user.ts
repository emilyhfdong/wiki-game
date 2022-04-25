import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IUser {
  id: string
  name: string
}

const initialState: IUser = {
  id: "",
  name: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<IUser>) => action.payload,
  },
})

export const userActions = userSlice.actions
