import faker from "faker"
import { IArticlePair } from "../types"

export const COLOR_THEMES = [
  { primary: "#FDF2E3", secondary: "#000000" },
  { primary: "#EAB39D", secondary: "#E62E3B" },
  { primary: "#C5CAB3", secondary: "#135142" },
]

export const getNextArticlePair = (
  articleImgs: { [key: string]: string },
  currentArticlesIndex: number,
  initialColorThemeIndex: number
): IArticlePair => {
  const nextColourIndex =
    (initialColorThemeIndex + currentArticlesIndex) % COLOR_THEMES.length

  const numberOfItems = Object.keys(articleImgs).length
  const startIndex = Math.floor(Math.random() * (numberOfItems - 1))
  const endIndex = Math.floor(Math.random() * (numberOfItems - 1))
  return {
    start: {
      img: Object.values(articleImgs)[startIndex] as string,
      name: Object.keys(articleImgs)[startIndex],
    },
    end: {
      img: Object.values(articleImgs)[endIndex] as string,
      name: Object.keys(articleImgs)[endIndex],
    },
    colorTheme: COLOR_THEMES[nextColourIndex],
  }
}
export const getRandomUsername = () =>
  // @ts-ignore
  faker.animal.type().split(" ").slice(-2).join(" ")
