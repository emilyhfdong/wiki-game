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
  console.log("onGroupCreated: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)

  const { username, groupId, articles } = JSON.parse(event.body)

  const connections = [{ connectionId, username, points: 0 }]

  await Promise.all([
    dynamodb
      .put({
        TableName: config.groupsTableName,
        Item: {
          groupId,
          connections,
          articles,
        },
      })
      .promise(),
    dynamodb
      .put({
        TableName: config.connectionsTableName,
        Item: {
          connectionId,
          groupId,
        },
      })
      .promise(),
    sendMessage(connectionId, { action: "connectionsUpdated", connections }),
    sendMessage(connectionId, { action: "connectionIdSet", connectionId }),
  ])

  return { statusCode: 200 }
}
