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

export const BackendService = {
  createUser,
}
