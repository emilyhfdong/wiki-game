import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  onConnect: {
    handler: `src/functions/websocket/onConnect.handler`,
    events: [
      {
        websocket: {
          route: "$connect",
        },
      },
    ],
  },
  onGroupCreated: {
    handler: `src/functions/websocket/onGroupCreated.handler`,
    events: [
      {
        websocket: {
          route: "groupCreated",
        },
      },
    ],
  },
  onDisconnect: {
    handler: `src/functions/websocket/onDisconnect.handler`,
    events: [
      {
        websocket: {
          route: "$disconnect",
        },
      },
    ],
  },
  onRoundChanged: {
    handler: `src/functions/websocket/onRoundChanged.handler`,
    events: [
      {
        websocket: {
          route: "roundChanged",
        },
      },
    ],
  },
  onGroupJoined: {
    handler: `src/functions/websocket/onGroupJoined.handler`,
    events: [
      {
        websocket: {
          route: "groupJoined",
        },
      },
    ],
  },
  onConnectionsUpdated: {
    handler: `src/functions/websocket/onConnectionsUpdated.handler`,
    events: [
      {
        websocket: {
          route: "connectionsUpdated",
        },
      },
    ],
  },
  healthCheck: {
    handler: `src/functions/websocket/healthCheck.handler`,
    events: [
      {
        websocket: {
          route: "healthCheck",
        },
      },
    ],
  },
  getArticles: {
    handler: `src/functions/getArticles.handler`,
    events: [
      {
        schedule: {
          rate: "rate(5 minutes)",
          enabled: false,
        },
      },
    ],
  },
  createUser: {
    handler: `src/functions/createUser.handler`,
    events: [
      {
        http: { method: "POST", path: "/users" },
      },
    ],
  },
  createRun: {
    handler: `src/functions/createRun.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/runs" },
      },
    ],
  },
}
