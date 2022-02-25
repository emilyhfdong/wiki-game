import "source-map-support/register"
import axios from "axios"
import { GetTopicResponse } from "./types"
import { S3 } from "aws-sdk"
import { config } from "@libs/environment"

const s3 = new S3()

interface ArticlesDataJSON {
  lastUpdated: string
  numberOfItems: number
  articleImgs: {
    [key: string]: string
  }
}

const getArticlesData = async (): Promise<ArticlesDataJSON | null> => {
  try {
    const s3Response = await s3
      .getObject({ Bucket: config.bucketName, Key: config.articlesKey })
      .promise()
    return s3Response.Body
      ? JSON.parse(s3Response.Body.toString("utf-8"))
      : null
  } catch (e) {
    if (e.code === "NoSuchKey") {
      return null
    }
    throw e
  }
}

export const handler = async () => {
  console.log("Getting challenge from thewikigame.com")
  const response = await axios.get<GetTopicResponse>(
    "https://api.thewikigame.com/api/v1/group/public/public/"
  )
  const { goal_article, start_article } = response.data.challenge
  console.log("Getting previous articles")
  const data = await getArticlesData()
  if (data?.articleImgs[start_article.link]) {
    console.log(`Article already stored for:`, start_article.link)
  }
  if (data?.articleImgs[goal_article.link]) {
    console.log(`Article already stored for:`, goal_article.link)
  }
  const newArticles = {
    ...data?.articleImgs,
    [start_article.link]: start_article.main_image_source,
    [goal_article.link]: goal_article.main_image_source,
  }
  const newNumberOfArticles = Object.keys(newArticles).length
  if (newNumberOfArticles === data.numberOfItems) {
    console.log("No new articles")
    return
  }
  console.log(
    "Updating list of article with",
    start_article.link,
    "and",
    goal_article.link
  )
  const newContent: ArticlesDataJSON = {
    lastUpdated: new Date().toString(),
    numberOfItems: newNumberOfArticles,
    articleImgs: newArticles,
  }
  await s3
    .putObject({
      Bucket: config.bucketName,
      Key: config.articlesKey,
      Body: JSON.stringify(newContent),
      ACL: "public-read",
      ContentType: "application/json",
    })
    .promise()
  console.log("Done updating data")
  return
}
