import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NewSignUp from './components/NewSignUp';
import NewLogin from './components/NewLogin';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Stocks from './components/Stocks';
import Orders from './components/Orders';
import Supplier from './components/Supplier';
import RawMaterialManager from './redux/RawMaterialManager';
import { loadAuth, logout } from './redux/reducers/authSlice';

const App = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

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
            {
              authState.isLoggedIn ? <>
                <Button color="inherit" onClick={() => dispatch(logout())} >Logout</Button>
              </>
                : <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                </>
            }
            <Button color="inherit" component={Link} to="/stocks">Stocks</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={authState.isLoggedIn ? <Home userDetails={authState.userDetails} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<NewLogin />} />
        <Route path="/profile" element={<UserProfile userDetails={authState.userDetails} />} />
        <Route path="/stocks" element={<Stocks userDetails={authState.userDetails} />} />
        <Route path="/orders" element={<Orders userDetails={authState.userDetails} />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/signup" element={<NewSignUp />} />
        <Route path="/testredux" element={<RawMaterialManager />} />
      </Routes>
    </Router>
  );
};

export default App;
