export interface IArticle {
  img: string
  name: string
}

export interface IArticlePair {
  start: IArticle
  end: IArticle
  colorTheme: { primary: string; secondary: string }
}

export interface IConnection {
  username: string
  connectionId: string
  points: number
}

export interface IColorTheme {
  primary: string
  secondary: string
}
