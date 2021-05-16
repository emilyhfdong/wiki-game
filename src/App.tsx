import React from "react"
import { Host } from "./components/host"
import { Participant } from "./components/participant"

export const App: React.FC = () => {
  return window.location.pathname.slice(1) ? <Participant /> : <Host />
}
