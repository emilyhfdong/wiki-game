type UserId = string

export interface UserMetaDataItem {
  pk: UserId
  sk: "metadata"
  name: string
}
