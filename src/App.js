import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Tooltip from '@mui/material/Tooltip';  // Import Tooltip

import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NewSignUp from './components/NewSignUp';
import NewLogin from './components/NewLogin';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import EditUserForm from './components/EditUserForm';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Stocks from './components/Stocks';
import Orders from './components/Orders';
import Supplier from './components/Supplier';
import RawMaterialManager from './redux/RawMaterialManager';
import { loadAuth, logout } from './redux/reducers/authSlice';
import Products from './components/Products';
import Layout from './components/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const App = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Theme toggle logic
  const [mode, setMode] = useState('light');
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar 
          position="static"
          sx={{ 
            backgroundColor: mode === 'light' ? '#1976d2' : '#333',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            marginBottom: '0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                color: '#fff',
                fontWeight: 'bold', 
                letterSpacing: '0.05em',
              }}
            >
              AutoMach
            </Typography>
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/" 
                sx={{ 
                  color: '#fff',
                  fontWeight: '500',
                  marginRight: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Home
              </Button>
              <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                <Button 
                  color="inherit" 
                  onClick={toggleTheme}
                  sx={{
                    color: '#fff',
                    fontWeight: '500',
                    marginLeft: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </Button>
              </Tooltip>
              {
                authState.isLoggedIn ? (
                  <Button 
                    color="inherit" 
                    onClick={() => dispatch(logout())}
                    sx={{
                      color: '#fff',
                      fontWeight: '500',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/login"
                      sx={{
                        color: '#fff',
                        fontWeight: '500',
                        marginRight: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/signup"
                      sx={{
                        color: '#fff',
                        fontWeight: '500',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )
              }
              
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          {/* Routes within the Layout require the user to be logged in */}
          <Route path="/" element={authState.isLoggedIn ? <Layout userDetails={authState.userDetails} /> : <Navigate to="/login" />}>
            <Route index element={<Home userDetails={authState.userDetails} />} />
            <Route path="profile" element={<UserProfile userDetails={authState.userDetails} />} />
            <Route path="edit-profile" element={<EditUserForm userDetails={authState.userDetails} />} />
            <Route path="stocks" element={<Stocks userDetails={authState.userDetails} />} />
            <Route path="orders" element={<Orders userDetails={authState.userDetails} />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="products" element={<Products />} />
            <Route path="testredux" element={<RawMaterialManager />} />
          </Route>

          {/* Login and Signup Routes */}
          <Route path="/login" element={<NewLogin />} />
          <Route path="/signup" element={<NewSignUp />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
