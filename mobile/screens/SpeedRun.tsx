import React, { useContext, useState } from "react"
import { useQuery } from "react-query"
import { BackendService } from "../backend"
import { ColorSchemeContext } from "../core/context/color-scheme"
import { QueryKeys } from "../core/query/client"
import { getRandomItemfromArray } from "../utils/helpers"
import { DateTime } from "luxon"
import { Run } from "../components/Run"

export const SpeedRunScreen: React.FC = () => {
  const { primary, secondary } = useContext(ColorSchemeContext)
  const [articles, setArticles] = useState({ start: "", end: "" })
  const [startTime, setStartTime] = useState<DateTime>()
  useQuery(QueryKeys.ARTICLES, BackendService.getArticles, {
    onSuccess: (data) => {
      setStartTime(DateTime.now())
      setArticles({
        start: getRandomItemfromArray(data).name,
        end: getRandomItemfromArray(data).name,
      })
    },
  })

  return (
    <Run
      startTime={startTime}
      start={articles.start}
      end={articles.end}
      onCompleted={(data) => console.log(data)}
    />
  )
}
