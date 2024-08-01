import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NewSignUp from './components/NewSignUp';
import NewLogin from './components/NewLogin';
import Home from './components/Home';
import UserProfile from './components/UserProfile'
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            AutoMach
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home userDetails={userDetails} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<NewLogin setIsLoggedIn={setIsLoggedIn} setUserDetails={setUserDetails} />} />
        <Route path="/profile" element={<UserProfile userDetails={userDetails} />} />
        <Route path="/signup" element={<NewSignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
