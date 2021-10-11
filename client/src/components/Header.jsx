import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AuthService from "../services/auth"

const jwt = new AuthService()

const useStyles = makeStyles({
  header: {
    display: "flex",
    background: "#0F1224",
    justifyContent: "space-between",
    borderBottom: "2px solid #60F8F6",
    boxShadow: `0 0 0.5rem #9bf9f9`
  },
  userAction: {
    display: "flex",
    justifyContent: "space-between",
  },
  user: {
    color: "#fff",
    margin: "0.2rem 1rem 0 1.25rem",
    fontSize: "0.9rem",
    fontFamily: "'Montserrat', sans-serif",
    textShadow: "0 0 8px #60F8F6",
    textTransform: "uppercase",
  },
  btn: {
    background: "linear-gradient(90deg, #60F8F6 0%, #9bf9f9 100%)",
    color: "#150933",
    marginTop: "1px"
  }
})

export const Header = ({ history }) => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      console.log(loggedInUser, 'loggedInUser')
      setUser(loggedInUser);
    }
  }, []);

  const singOut = () => {
    jwt.logout()
    history.push("/")
  }

  const classes = useStyles();

  return (
        <AppBar color="white" position="static">
          <Toolbar className={classes.header}>
            <img style={{ height: "2rem" }} src="favicon.png" />
              {(jwt.loggedIn())
                ? (<div className={classes.userAction}><span className={classes.user}>{user}</span><Button size="small" variant="contained" className={classes.btn} onClick={singOut} color="primary">Sign Out</Button></div>)
                : null
              }
          </Toolbar>
        </AppBar>
  );
}
