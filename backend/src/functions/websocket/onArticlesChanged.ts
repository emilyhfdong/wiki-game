import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda"
import * as AWS from "aws-sdk"
import { config } from "@libs/environment"
import { sendMessage } from "@functions/utils"

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = async (
  event: APIGatewayEvent,
  _context: APIGatewayEventRequestContext
) => {
  const {
    requestContext: { routeKey, connectionId },
  } = event
  console.log("onArticlesChanged: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)
  console.log("body", event.body)

  const { groupId, articles } = JSON.parse(event.body)

  const group = await dynamodb
    .update({
      TableName: config.groupsTableName,
      Key: { groupId },
      UpdateExpression: "set articles = :x",
      ExpressionAttributeValues: {
        ":x": articles,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise()

  await Promise.all(
    group.Attributes.connections.map(({ connectionId }) =>
      sendMessage(connectionId, {
        action: "articlesChanged",
        groupId,
        articles,
      })
    )
  )

  return { statusCode: 200 }
}
