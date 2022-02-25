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
  console.log("onDisconnect: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)

  const connection = await dynamodb
    .get({
      TableName: config.connectionsTableName,
      Key: { connectionId },
    })
    .promise()

  const groupId = connection.Item.groupId

  if (!groupId) {
    await dynamodb
      .delete({
        TableName: config.connectionsTableName,
        Key: { connectionId },
      })
      .promise()
    return { statusCode: 200 }
  }

  const group = await dynamodb
    .get({ TableName: config.groupsTableName, Key: { groupId } })
    .promise()

  if (!group.Item) {
    await dynamodb
      .delete({
        TableName: config.connectionsTableName,
        Key: { connectionId },
      })
      .promise()
    return { statusCode: 200 }
  }

  const isHost = group.Item.connections[0].connectionId === connectionId

  if (isHost) {
    await Promise.all([
      ...group.Item.connections.map(({ connectionId }) =>
        sendMessage(connectionId, { action: "groupDeleted" })
      ),
      dynamodb
        .delete({
          TableName: config.groupsTableName,
          Key: { groupId },
        })
        .promise(),
      dynamodb
        .delete({
          TableName: config.connectionsTableName,
          Key: { connectionId },
        })
        .promise(),
    ])
  } else {
    const newConnections = group.Item.connections.filter(
      (c) => c.connectionId !== connectionId
    )
    console.log("hii new connections", newConnections)
    await Promise.all([
      ...group.Item.connections.map(({ connectionId }) =>
        sendMessage(connectionId, {
          action: "connectionsUpdated",
          connections: newConnections,
        })
      ),
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
        .delete({
          TableName: config.connectionsTableName,
          Key: { connectionId },
        })
        .promise(),
    ])
  }

  return { statusCode: 200 }
}
