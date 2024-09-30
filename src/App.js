import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NewSignUp from './components/NewSignUp';
import NewLogin from './components/NewLogin';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import EditUserForm from './components/EditUserForm';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Stocks from './components/Stocks';
import Orders from './components/Orders';
import Supplier from './components/Supplier';
import Sales from './components/Sales';
import RawMaterialManager from './redux/RawMaterialManager';
import { loadAuth, logout } from './redux/reducers/authSlice';
import Products from './components/Products';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NewHome from './components/NewHome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  // Import AccountCircleIcon
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Tooltip from '@mui/material/Tooltip';  // Import Tooltip
import { styled } from '@mui/material/styles';

const App = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      position: 'absolute',
      top: '64px',  // Adjust based on the height of your AppBar
      right: '16px', // Adjust as needed to position towards the right
      margin: 0,
      width: '300px',  // Adjust width as needed
      borderRadius: '8px',
      boxShadow: theme.shadows[5],
    },
  }));

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

  // Dialog open state
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

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
              <Tooltip title="View Profile">
                <IconButton 
                  color="inherit" 
                  onClick={handleClickOpen}
                  sx={{
                    color: '#fff',
                    fontWeight: '500',
                    marginLeft: '8px',
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              {authState.isLoggedIn ? (
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
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          {/* Routes within the Layout require the user to be logged in */}
          <Route path="/" element={authState.isLoggedIn ? <Layout userDetails={authState.userDetails} /> : <Navigate to="/login" />} >
            <Route index element={<NewHome userDetails={authState.userDetails} />} />
            <Route path="profile" element={<UserProfile userDetails={authState.userDetails} />} />
            <Route path="edit-profile" element={<EditUserForm userDetails={authState.userDetails} />} />
            <Route path="stocks" element={<Stocks userDetails={authState.userDetails} />} />
            <Route path="orders" element={<Orders userDetails={authState.userDetails} />} />
            <Route path="sales" element={<Sales userDetails={authState.userDetails} />} />
            <Route path="supplier" element={<Supplier />} />
           
            <Route path="chatbot" element={<Chatbot userDetails={authState.userDetails} />} />
            <Route path="products" element={<Products />} />
            <Route path="testredux" element={<RawMaterialManager />} />
          </Route>

          {/* Login and Signup Routes */}
          <Route path="/login" element={<NewLogin />} />
          <Route path="/signup" element={<NewSignUp />} />
         

        </Routes>

        {/* User Profile Dialog */}
       
        <CustomDialog open={openDialog} onClose={handleClose}>
          <UserProfile userDetails={authState.userDetails} />
        </CustomDialog>
        
      </Router>
    </ThemeProvider>
  );
};

export default App;
