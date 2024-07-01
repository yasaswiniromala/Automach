import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SellSharpIcon from '@mui/icons-material/SellSharp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const drawerWidth = 240;

const listItems = [
  { text: 'Invoices', icon: <InventoryOutlinedIcon /> },
  { text: 'Sales', icon: <SellSharpIcon /> },
  { text: 'Calendar', icon: <CalendarTodayIcon /> },
  { text: 'Procurement', icon: <ShoppingCartIcon /> },
];

const inventoryItems = [
  { text: 'Products', icon: <InventoryIcon /> },
  { text: 'Warehouse', icon: <WarehouseIcon /> },
];

const features = [
  { title: "Production Cycle Planning" },
  { title: "People Management and Scheduling" },
  { title: "Shift Schedule Tracking" },
  { title: "Stock and Sales Forecasting" },
  { title: "Inventory Tracking" },
  { title: "Price History Tracking" },
  { title: "Order Delivery Tracking" },
  { title: "Invoicing and Client Communication" },
  { title: "Access Control for Sales Portal" },
  { title: "Material Management" },
  { title: "Quality Assurance Tracking" },
];

function HomePage() {
  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to AutoMach
        </Typography>
        <Typography variant="h6" component="p" color="textSecondary">
          AutoMach is a process management tool for streamlining day-to-day activities in a process-oriented manufacturing hub.
          It tunes your process by digitizing data and enhancing production cycles using smart prediction systems that can provide insights across multiple departments.
          Expand your horizons to increase margins in the process pipeline and deliver high-quality products.
        </Typography>
      </Box>
      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

function ClippedDrawer() {
  const navigate = useNavigate(); // Move useNavigate inside the component

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            AutoMach
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button
              color="inherit"
              onClick={handleLogin}
              sx={{ padding: '10px 20px', m: 1, fontSize: '13px' }}
              className="register-button"
            >
              Login
            </Button>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h6" align="center" mt={2}>
            Dashboard
          </Typography>
          <List>
            {listItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Typography variant="h6" align="center" mt={2}>
            Inventory
          </Typography>
          <List>
            {inventoryItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
       
      </Box>
    </Box>
  );
}

export default ClippedDrawer