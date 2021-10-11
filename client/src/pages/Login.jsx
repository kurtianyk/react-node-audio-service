import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Container, Card, CardContent, TextField } from '@material-ui/core';

import api from '../services/api'
import AuthService from "../services/auth"
import { saveUserData } from '../services/persistStorage';
import { Header } from "../components/Header"

const jwt = new AuthService()

const useStyles = makeStyles({
  wrapper: {
    height: "calc(100% - 5rem - 5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  root: {
    minWidth: "30vw",
    backgroundColor: "#0F1224"
  },
  card: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "4px",
    border: "1px solid #60F8F6",
    borderRadius: "0.5rem",
    boxShadow: `0 0 0.3rem #9bf9f9`,
  },
  imgContainer: {
    display: "flex",
    justifyContent: "center"
  },
  btn: {
    background: "linear-gradient(90deg, #60F8F6 0%, #9bf9f9 100%)",
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    //width: 200,
    height: 45,
    color: "#150933",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 16,
  },
  text_btn: {
    borderRadius: 8,
    color: "#fff",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    textTransform: "capitalize"
  },
  input: {
    margin: 10,
  },
  title: {
    color: "#9bf9f9",
    margin: 20,
    fontFamily: "'Montserrat', sans-serif",
    textShadow: "0 0 8px #60F8F6",
    fontSize: "xx-large",
    textTransform: "uppercase"
  },
  disabled: {
    background: "grey"
  }
});

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fullnameIsValid (name) {
  return /^[a-zA-Z ]+$/.test(name)
}

export const Login = ({ history }) => {
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
  const [fullnameErrorMessage, setFullnameErrorMessage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const [isSignIn, setIsSignIn] = useState(true);

  const classes = useStyles();

  useEffect(()=> {
    if (jwt.loggedIn()) {
      history.push("/dashboard");
    }
  }, []);

  const toggleSignIn = () => {
    onClear();
    setIsSignIn(!isSignIn);
  }

  const onEmailChange = (e) => {
    if (emailIsValid(e.target.value)) {
      setEmail(e.target.value)
      setEmailErrorMessage(null)
    } else {
      setEmailErrorMessage("Invalid email address")
    }
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
    setPasswordErrorMessage(null)
  }

  const onFullNameChange = (e) => {
    if (fullnameIsValid(e.target.value)) {
      setFullname(e.target.value)
      setFullnameErrorMessage(null)
    } else {
      setFullnameErrorMessage("Invalid full name")
    }
  }

  const onClear = () => {
    setFullnameErrorMessage(null);
    setPasswordErrorMessage(null);
    setEmailErrorMessage(null);
  }

  const keyPress = (e) => {
    if(e.keyCode === 13 || e.key === "Enter"){
      setPassword(e.target.value)
      setPasswordErrorMessage(null)
      _signIn()
    }
  }

  const _signIn = async () => {
    try {
      const response = await api.signInUser(email, password)
      if (response.ok && response.status === 200) {
        console.log(response.data?.token, 'response.data?.token')
        saveUserData(response.data?.name);
        await jwt.setToken(response.data?.token)
        history.push("/dashboard")
      } else {
        const err = response?.data?.message || "Invalid login, please try again"

        setEmailErrorMessage(err)
        setPasswordErrorMessage(err)
      }
    } catch(e) {
      console.error(e);
    }
  };

  const _signUp = async () => {
    try {
      const response = await api.signUpUser(fullname, email, password)
      if (response.ok && response.status === 200) {
        console.log(response.data?.token, 'response.data?.token');
        saveUserData(response.data?.name);
        await jwt.setToken(response.data?.token);
        history.push("/dashboard")
      } else {
        const err = response?.data?.message || "Invalid login, please try again";
        setEmailErrorMessage(err);
        setPasswordErrorMessage(err);
        setFullnameErrorMessage(err);
      }
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <>
      <Header />
      <Container className={classes.wrapper} maxWidth="sm">
        <Card className={classes.root}>
          <CardContent className={classes.card}>
            <Typography className={classes.title} align="center" variant="h4">
              Audio Player
            </Typography>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {!isSignIn && <TextField required error={fullnameErrorMessage} helperText={fullnameErrorMessage} onChange={onFullNameChange} className={classes.input} id="outlined-basic" type="text" label="Full Name" variant="outlined" />}
              <TextField required error={emailErrorMessage} helperText={emailErrorMessage} onChange={onEmailChange} className={classes.input} id="outlined-basic" type="email" label="Email Address" variant="outlined" />
              <TextField required error={passwordErrorMessage} onKeyPress={keyPress} helperText={passwordErrorMessage} onChange={onPasswordChange} className={classes.input} label="Password" type="password" autoComplete="current-password" variant="outlined" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column" }}>
              <Button 
                disabled={!email || !password || (!isSignIn && !fullname)}
                variant="contained"
                className={classes.btn}
                classes={{
                  disabled: classes.disabled
                }} 
                onClick={isSignIn ? _signIn : _signUp}
                color="primary"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </Button>
              
              <Button 
                variant="text"
                className={classes.text_btn}
                onClick={toggleSignIn}
              >
                {isSignIn ? "Create an account" : "Already have an account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
      </>
  );
}
