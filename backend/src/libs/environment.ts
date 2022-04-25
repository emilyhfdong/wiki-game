import * as env from "env-var"

export const config = {
  bucketName: env.get("BUCKET_NAME").required().asString(),
  articlesKey: env.get("ARTICLES_DATA_KEY").required().asString(),
  connectionsTableName: env.get("CONNECTIONS_TABLE_NAME").required().asString(),
  groupsTableName: env.get("GROUPS_TABLE_NAME").required().asString(),
  usersTableName: env.get("USERS_TABLE_NAME").required().asString(),
  wsUrl: env.get("WS_ENDPOINT").required().asString(),
}
