import React, { useState } from "react"
import { useMutation } from "react-query"
import { BackendService } from "../backend"
import { useDispatch } from "react-redux"
import { userActions } from "../core/redux/slices/user"
import { SingleTextInputScreen } from "../components/SingleTextInputScreen"
import { useNavigation } from "@react-navigation/native"

export const SignupScreen: React.FC = () => {
  const { navigate } = useNavigation()
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const { mutate, isLoading } = useMutation(
    ({ name }: { name: string }) => BackendService.createUser(name),
    {
      onSuccess: (createdUser) => {
        dispatch(userActions.setUser(createdUser))
        navigate("Home")
      },
    }
  )
  return (
    <SingleTextInputScreen
      hasBackButton={false}
      value={name}
      setValue={setName}
      isLoading={isLoading}
      onEnter={() => mutate({ name })}
      title="WHAT'S YOUR NAME?"
    />
  )
}
