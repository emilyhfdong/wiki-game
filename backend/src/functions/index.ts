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
  onArticlesChanged: {
    handler: `src/functions/websocket/onArticlesChanged.handler`,
    events: [
      {
        websocket: {
          route: "articlesChanged",
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
}
