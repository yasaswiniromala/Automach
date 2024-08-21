import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete, Select, MenuItem
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRawMaterials } from '../redux/reducers/rawMaterialSlice';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    supplierName: '',
    status: 'Pending', // Default status is 'Pending'
    trackingInfo: '',
    notes: '',
    rawMaterialId: '',
    rawMaterialQuantity: 0,
  });

  const dispatch = useDispatch();
  const rawMaterials = useSelector((state) => state.rawMaterials.rawMaterials);

  useEffect(() => {
    fetchOrders();
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewOrder({
      supplierName: '',
      status: 'Pending',
      trackingInfo: '',
      notes: '',
      rawMaterialId: '',
      rawMaterialQuantity: 0,
    });
  };

  const handleAddOrder = async () => {
    try {
      if (!newOrder.rawMaterialId) {
        alert('Please select a raw material.');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/orders', {
        supplierName: newOrder.supplierName,
        status: newOrder.status,
        trackingInfo: newOrder.trackingInfo,
        notes: newOrder.notes,
        rawMaterial: { id: newOrder.rawMaterialId },
        rawMaterialQuantity: newOrder.rawMaterialQuantity,
      });

      setOrders([...orders, response.data]);
      handleClose();
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order. Please try again.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Supplier Orders
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Order
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tracking Info</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Raw Material Name</TableCell>
              <TableCell>Raw Material Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.trackingInfo}</TableCell>
                <TableCell>{order.notes}</TableCell>
                <TableCell>{order.rawMaterial.materialName}</TableCell>
                <TableCell>{order.rawMaterialQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Supplier Name"
            fullWidth
            variant="standard"
            value={newOrder.supplierName}
            onChange={(e) => setNewOrder({ ...newOrder, supplierName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tracking Info"
            fullWidth
            variant="standard"
            value={newOrder.trackingInfo}
            onChange={(e) => setNewOrder({ ...newOrder, trackingInfo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            variant="standard"
            value={newOrder.notes}
            onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
          />
          <Select 
            label="Order Status"
            fullWidth
            variant="standard"
            value={newOrder.status}
            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
            style={{ marginBottom: '20px' }}
          >Order Status
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
          <Autocomplete
            options={rawMaterials}
            getOptionLabel={(option) => option.materialName}
            value={rawMaterials.find(material => material.id === newOrder.rawMaterialId) || null}
            onChange={(event, newValue) => {
              setNewOrder({ ...newOrder, rawMaterialId: newValue ? newValue.id : '' });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search Raw Materials" variant="standard" />
            )}
          />
          <TextField
            margin="dense"
            label="Raw Material Quantity"
            fullWidth
            variant="standard"
            type="number"
            value={newOrder.rawMaterialQuantity}
            onChange={(e) => setNewOrder({ ...newOrder, rawMaterialQuantity: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddOrder} color="primary">Add Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
