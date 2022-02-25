import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda"
import * as AWS from "aws-sdk"
import { config } from "@libs/environment"

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = async (
  event: APIGatewayEvent,
  _context: APIGatewayEventRequestContext
) => {
  const {
    requestContext: { routeKey, connectionId },
  } = event
  console.log("onConnect: recieved route key:", routeKey)
  console.log("connectionId:", connectionId)

  await dynamodb
    .put({
      TableName: config.connectionsTableName,
      Item: {
        connectionId,
      },
    })
    .promise()
  return { statusCode: 200 }
}
