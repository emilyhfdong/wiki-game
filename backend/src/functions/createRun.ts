import { database } from "@libs/database"
import { createResponse } from "@libs/apiGateway"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Article } from "@libs/database/types"

interface CreateRunRequestBody {
  start: Article
  end: Article
  duration: number // in seconds
  path: string[]
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId
  console.log("recieved body", event.body)
  const { duration, end, path, start }: CreateRunRequestBody = JSON.parse(
    event.body
  )

  // TODO - validate body fields with middleware
  if (!userId) {
    return createResponse({
      body: { message: "Missing `userId` path param" },
      statusCode: 400,
    })
  }

  const run = await database.createRun(userId, { duration, path, start, end })

  console.log("created run", run)

  return createResponse({
    body: {
      run: {
        id: run.sk,
        duration: run.duration,
        path: run.path,
        start: run.start,
        end: run.end,
      },
    },
  })
}
