type UserId = string

export interface UserMetaDataItem {
  pk: UserId
  sk: "metadata"
  name: string
}

export interface Article {
  img: string
  name: string
}

type StartArticleName = string
type EndArticleName = string

export interface UserRunItem {
  pk: UserId
  sk: `run#${StartArticleName}#${EndArticleName}`
  start: Article
  end: Article
  path: string[]
  duration: number
}
