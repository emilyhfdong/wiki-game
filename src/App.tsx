import React from "react"
import { Host, Participant } from "./pages"

export const App: React.FC = () => {
  return window.location.pathname.slice(1) ? <Participant /> : <Host />
}
