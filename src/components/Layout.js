import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SellSharpIcon from '@mui/icons-material/SellSharp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Layout = ({ userDetails }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          
          <ListItem button component={Link} to="/inventory">
            <ListItemIcon><InventoryOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem button component={Link} to="/sales">
            <ListItemIcon><SellSharpIcon /></ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItem>
          <ListItem button component={Link} to="/schedule">
            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
            <ListItemText primary="Schedule" />
          </ListItem>
          <ListItem button component={Link} to="/orders">
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button component={Link} to="/stocks">
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Stock" />
          </ListItem>
          <ListItem button component={Link} to="/supplier">
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            <ListItemText primary="Suppliers" />
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
          <ListItem button component={Link} to="/products">
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
