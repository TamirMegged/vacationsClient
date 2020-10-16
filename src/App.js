import React, { useState } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Reports from './components/Reports';
import Vacations from './components/Vacations';
import Profile from './components/Profile';
import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import PublicHomePage from './components/PublicHomePage';
import WishList from './components/WishList';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0f2566'
    },
    secondary: {
      main: "#33ab97"
    }
  }
});

function App() {
  const user = useSelector(state => state.user);
  const [searchMode, setSearchMode] = useState(false);

  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Navigation setSearchMode={setSearchMode} />
        <Route exact path="/">
          <Redirect to="/vacations" />
        </Route>
        <Route path="/vacations">
          {user.isLogin ? (<Vacations isSearchMode={searchMode} />) : (<PublicHomePage />)}
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile">
          {user.isLogin ? <Profile /> : <Redirect to="/vacations" />}
        </Route>
        <Route path="/wishlist" component={WishList} />
        <Route path="/reports">
          {user.role === "admin" ? <Reports /> : <Redirect to="/vacations" />}
        </Route>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
