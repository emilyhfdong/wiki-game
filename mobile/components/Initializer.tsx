import React, { useEffect } from "react"
import { BackendService } from "../backend"
import { queryClient, QueryKeys } from "../core/query/client"

export const Initializer: React.FC = ({ children }) => {
  useEffect(() => {
    queryClient.prefetchQuery(QueryKeys.ARTICLES, BackendService.getArticles)
  }, [])
  return <>{children}</>
}
