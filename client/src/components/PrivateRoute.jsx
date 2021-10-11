import React from "react"
import { Route, Redirect } from "react-router-dom"

import AuthService from "../services/auth"

const jwt = new AuthService()

export const PrivateRoute = ({ component: Conmponent, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (jwt.loggedIn())
        ? <Conmponent {...props} />
        : <Redirect to={{ pathname: "/" }} />
    }
  />
)
