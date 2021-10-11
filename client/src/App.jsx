import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Login } from "./pages/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { Dashboard } from "./pages/Dashboard";

import AudioPlayer from "./components/AudioPlayer";

const App = (props) => {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      text: {
        disabled: "#11cb5f"
      },
      primary: {
        main: '#60F8F6',
        text: {
          disabled: "#11cb5f"
        },
      },
      secondary: {
        main: '#11cb5f'
      }
    },
    overrides: {
      MuiTableCell: {
        head: {
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
        }
      }
    }
  });
//background: "linear-gradient(#0F1230, #150933)", 
  return (
    <div style={{ height: "100vh", background: "linear-gradient(#0F1230, #150933)" }} className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/player" component={AudioPlayer} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
