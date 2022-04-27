import { APIGatewayEvent } from "aws-lambda"

export const handler = async (event: APIGatewayEvent) => {
  const {
    requestContext: { routeKey },
  } = event
  console.log("healthCheck: recieved route key:", routeKey)

  return { statusCode: 200 }
}
