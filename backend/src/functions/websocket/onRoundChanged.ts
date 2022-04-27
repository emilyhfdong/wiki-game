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
  console.log("onRoundChanged: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)
  console.log("body", event.body)

  const { groupId, round } = JSON.parse(event.body)

  const group = await dynamodb
    .update({
      TableName: config.groupsTableName,
      Key: { groupId },
      UpdateExpression: "set articles = :x",
      ExpressionAttributeValues: {
        ":x": round,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise()

  await Promise.all(
    group.Attributes.connections.map(({ connectionId }) =>
      sendMessage(connectionId, {
        action: "roundChanged",
        groupId,
        round,
      })
    )
  )

  return { statusCode: 200 }
}
