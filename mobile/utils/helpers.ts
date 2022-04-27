export const getRandomItemfromArray = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)]

const WIKI_BASE_URL = "https://en.m.wikipedia.org/wiki/"
export const getArticleUrl = (name: string) => `${WIKI_BASE_URL}${name}`
export const getArticleNameFromUrl = (url: string) =>
  url.split(WIKI_BASE_URL)[1]
export const getReadableTextFromName = (name: string) =>
  name.replaceAll("_", " ")
export const generateRandomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  return new Array(5)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("")
}
