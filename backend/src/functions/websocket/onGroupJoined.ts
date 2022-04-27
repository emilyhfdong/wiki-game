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
  console.log("onConnected: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)

  const { groupId, username } = JSON.parse(event.body)

  const group = await dynamodb
    .get({ TableName: config.groupsTableName, Key: { groupId } })
    .promise()

  if (!group.Item) {
    await sendMessage(connectionId, { action: "groupNotFound" })
    return { statusCode: 200 }
  }
  const newConnections = [
    ...group.Item.connections,
    { connectionId, username, points: 0 },
  ] as any

  await Promise.all([
    ...newConnections.map(({ connectionId }) =>
      sendMessage(connectionId, {
        action: "connectionsUpdated",
        connections: newConnections,
      })
    ),
    ...(group.Item.articles
      ? [
          sendMessage(connectionId, {
            action: "roundChanged",
            groupId,
            round: group.Item.articles,
          }),
        ]
      : []),
    sendMessage(connectionId, { action: "connectionIdSet", connectionId }),
    dynamodb
      .update({
        TableName: config.groupsTableName,
        Key: { groupId },
        UpdateExpression: "set connections = :connections",
        ExpressionAttributeValues: {
          ":connections": newConnections,
        },
      })
      .promise(),
    dynamodb
      .update({
        TableName: config.connectionsTableName,
        Key: { connectionId },
        UpdateExpression: "set groupId = :groupId",
        ExpressionAttributeValues: {
          ":groupId": groupId,
        },
      })
      .promise(),
  ])

  return { statusCode: 200 }
}
