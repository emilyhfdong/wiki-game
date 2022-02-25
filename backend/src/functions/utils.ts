import { config } from "@libs/environment"
import * as AWS from "aws-sdk"

const apig = new AWS.ApiGatewayManagementApi({
  endpoint: config.wsUrl,
})

export const sendMessage = async (connectionId: string, body: any) => {
  try {
    await apig
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(body),
      })
      .promise()
  } catch (err) {
    // Ignore if connection no longer exists
    if (err.statusCode !== 400 && err.statusCode !== 410) {
      throw err
    }
  }
}
