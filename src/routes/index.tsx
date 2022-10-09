import { View, Text } from 'react-native'
import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import LoggedInRoutes from './loggedin.routes'
import NotLoggedInRoutes from './notloggedin.routes'

export default function Routes() {
  const {user} = useAuthContext();

  return (
    <>
      {user ? <LoggedInRoutes /> : <NotLoggedInRoutes />}
    </>
  )
}