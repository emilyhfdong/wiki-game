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
  console.log("onConnectionsUpdated: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)

  const { groupId, connections } = JSON.parse(event.body)

  await Promise.all([
    ...connections.map(({ connectionId }) =>
      sendMessage(connectionId, {
        action: "connectionsUpdated",
        connections,
      })
    ),
    dynamodb
      .update({
        TableName: config.groupsTableName,
        Key: { groupId },
        UpdateExpression: "set connections = :connections",
        ExpressionAttributeValues: {
          ":connections": connections,
        },
      })
      .promise(),
  ])

  return { statusCode: 200 }
}
