import axios from "axios"

const API_BASE = "https://dluitzut3g.execute-api.us-east-1.amazonaws.com/dev/"

const createUser = async (name: string) => {
  const response = await axios.post<{ user: { id: string; name: string } }>(
    "users",
    { name },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - creating user")
  return response.data?.user
}

const getArticles = async () => {
  const response = await axios.get<{
    lastUpdated: string
    numberOfItems: number
    articleImgs: { [name: string]: string }
  }>("https://wiki-game-data.s3.amazonaws.com/articles.json")

  const articles = Object.keys(response.data.articleImgs).map(
    (articleName) => ({
      name: articleName,
      img: response.data.articleImgs[articleName],
    })
  )

  return articles
}

export const BackendService = {
  createUser,
  getArticles,
}
