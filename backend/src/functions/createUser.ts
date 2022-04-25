import { database } from "@libs/database"
import { createResponse } from "@libs/apiGateway"
import { APIGatewayProxyHandler } from "aws-lambda"
import { nanoid } from "nanoid"

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body)
  console.log("recieved body", event.body)

  if (!body.name) {
    return createResponse({
      body: { message: "Missing `name` field" },
      statusCode: 400,
    })
  }

  const user = await database.putUser(nanoid(), { name: body.name })

  console.log("created user", user)

  return createResponse({
    body: {
      user: {
        id: user.pk,
        name: user.name,
      },
    },
  })
}
