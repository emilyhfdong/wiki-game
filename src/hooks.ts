import { useEffect } from "react"

let timer: number | ReturnType<typeof setTimeout>
let hasFiredOnScroll = false
let scrollingHasStarted = false
let shouldFireEvent = true
let startY = 0

const DELTA_Y_THRESHOLD_FOR_HARD_SCROLL = 40

type TDirection = "up" | "down"

interface IOnHardScrollPayload {
  onHardScroll: (direction: TDirection) => void
  getShouldFireEvent: (direction: TDirection) => boolean
}
export const getIsTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

const getPageY = (touchEvent: any) =>
  touchEvent.pageY || touchEvent.changedTouches?.[0].pageY

export const useOnHardScroll = ({
  onHardScroll,
  getShouldFireEvent,
}: IOnHardScrollPayload) => {
  const isTouchDevice = getIsTouchDevice()
  useEffect(() => {
    const handleTouchMove = (ev: any) => {
      const eventPageY = getPageY(ev)

      ev.preventDefault()
      const direction = startY - eventPageY > 0 ? "down" : "up"

      if (!startY) {
        startY = eventPageY
        return
      }
      if (!scrollingHasStarted && getShouldFireEvent) {
        shouldFireEvent = getShouldFireEvent(direction)
        scrollingHasStarted = true
      }
      const absoluteDeltaY = Math.abs(startY - eventPageY)

      clearTimeout(+timer)
      if (absoluteDeltaY > DELTA_Y_THRESHOLD_FOR_HARD_SCROLL) {
        if (!hasFiredOnScroll && shouldFireEvent) {
          onHardScroll(direction)
          hasFiredOnScroll = true
        }
      }
      timer = setTimeout(() => {
        hasFiredOnScroll = false
        scrollingHasStarted = false
        shouldFireEvent = true
        startY = 0
      }, 50)
    }
    const handleWheel = (ev: WheelEvent) => {
      const direction = ev.deltaY < 0 ? "up" : "down"
      if (!scrollingHasStarted && getShouldFireEvent) {
        shouldFireEvent = getShouldFireEvent(direction)
        scrollingHasStarted = true
      }

      const absoluteDeltaY = Math.abs(ev.deltaY)

      if (Math.abs(ev.deltaY) > 5) {
        clearTimeout(+timer)
      }
      if (absoluteDeltaY > DELTA_Y_THRESHOLD_FOR_HARD_SCROLL) {
        if (!hasFiredOnScroll && shouldFireEvent) {
          onHardScroll(direction)
          hasFiredOnScroll = true
        }
      }
      timer = setTimeout(() => {
        hasFiredOnScroll = false
        scrollingHasStarted = false
        shouldFireEvent = true
      }, 50)
    }

    if (isTouchDevice) {
      window.addEventListener("touchmove", handleTouchMove)
    } else {
      window.addEventListener("wheel", handleWheel)
    }
    return () => {
      if (isTouchDevice) {
        window.removeEventListener("touchmove", handleTouchMove)
      } else {
        window.removeEventListener("wheel", handleWheel)
      }
    }
  })
}
