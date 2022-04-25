import { config } from "@libs/environment"
import * as AWS from "aws-sdk"
import { UserMetaDataItem } from "./types"

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getUser = async (id: string) => {
  const pk: UserMetaDataItem["pk"] = id
  const sk: UserMetaDataItem["sk"] = "metadata"
  const response = await dynamodb
    .get({
      TableName: config.usersTableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise()

  if (response.Item) {
    return response.Item as UserMetaDataItem
  }
  return null
}

const putUser = async (
  id: string,
  userFields: Omit<UserMetaDataItem, "sk" | "pk">
) => {
  const item: UserMetaDataItem = {
    pk: id,
    sk: "metadata",
    ...userFields,
  }

  await dynamodb
    .put({
      TableName: config.usersTableName,
      Item: item,
    })
    .promise()

  return item
}

export const database = {
  getUser,
  putUser,
}
