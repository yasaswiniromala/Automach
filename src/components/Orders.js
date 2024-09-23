import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, Autocomplete, Select, MenuItem, IconButton,Checkbox, FormControlLabel
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRawMaterials } from '../redux/reducers/rawMaterialSlice';
import { Edit, Delete } from '@mui/icons-material'; // Icons for edit and delete
import axios from 'axios';



const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // New state for filtered orders
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // New state to manage edit mode
  const [suppliers, setSuppliers] = useState([]);

  // New states for filters
  const [statusFilter, setStatusFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');

  const [newOrder, setNewOrder] = useState({
    orderId: '', // Added orderId to the state
    supplierName: '',
    status: 'Pending',
    trackingInfo: '',
    notes: '',
    rawMaterialId: '',
    rawMaterialQuantity: 0,
    createdBy: '', // New field
    updatedBy: '', // New field
    createdDate: '', // New field
    updatedDate: '' // New field
  });

  const dispatch = useDispatch();
  const rawMaterials = useSelector((state) => state.rawMaterials.rawMaterials);

  // state to track which columns are visible
  const [visibleColumns, setVisibleColumns] = useState({
    supplierName: true,
    status: true,
    trackingInfo: true,
    notes: true,
    rawMaterialName: true,
    rawMaterialQuantity: true,
    createdBy: true,
    createdDate: true,
    updatedBy: true,
    updatedDate: true,
  });

  useEffect(() => {
    fetchOrders();
    dispatch(fetchRawMaterials());
    fetchSuppliers();
  }, [dispatch]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders');
      setOrders(response.data);
      setFilteredOrders(response.data); // Set filtered orders to fetched orders initially
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false); // Reset edit mode when closing dialog
    setNewOrder({
      orderId: '', // Reset orderId
      supplierName: '',
      status: 'Pending',
      trackingInfo: '',
      notes: '',
      rawMaterialId: '',
      rawMaterialQuantity: 0,
      createdBy: '', // Reset field
      updatedBy: '', // Reset field
      createdDate: '', // Reset field
      updatedDate: '' // Reset field
    });
  };

  const handleAddOrder = async () => {
    try {
      if (!newOrder.rawMaterialId) {
        alert('Please select a raw material.');
        return;
      }

      const currentDate = new Date().toISOString();

      const orderData = {
        supplierName: newOrder.supplierName,
        status: newOrder.status,
        trackingInfo: newOrder.trackingInfo,
        notes: newOrder.notes,
        rawMaterial: { id: newOrder.rawMaterialId },
        rawMaterialQuantity: newOrder.rawMaterialQuantity,
        createdBy: newOrder.createdBy,
        updatedBy: newOrder.updatedBy,
        createdDate: editMode ? newOrder.createdDate : currentDate, // Keep original created date
        updatedDate: currentDate // Set updated date to current time
      };

      const response = editMode
        ? await axios.put(`http://localhost:8080/api/orders/${newOrder.orderId}`, orderData)
        : await axios.post('http://localhost:8080/api/orders', orderData);

      if (editMode) {
        setOrders(orders.map((order) => (order.orderId === response.data.orderId ? response.data : order)));
      } else {
        setOrders([...orders, response.data]);
      }

      filterOrders(statusFilter, materialFilter); // Filter orders after adding/updating
      handleClose();
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} order:`, error);
      alert(`Failed to ${editMode ? 'update' : 'add'} order. Please try again.`);
    }
  };

  const handleEditOrder = (order) => {
    setEditMode(true);
    setNewOrder({
      orderId: order.orderId,
      supplierName: order.supplierName,
      status: order.status,
      trackingInfo: order.trackingInfo,
      notes: order.notes,
      rawMaterialId: order.rawMaterialId,
      rawMaterialQuantity: order.rawMaterialQuantity,
      createdBy: order.createdBy, // Preserve createdBy
      updatedBy: '', // Reset updatedBy for new entry
      createdDate: order.createdDate, // Preserve createdDate
      updatedDate: '' // Reset updatedDate for new entry
    });
    setOpen(true);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`);
      setOrders(orders.filter((order) => order.orderId !== orderId));
      filterOrders(statusFilter, materialFilter); // Filter orders after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  const filterOrders = (status, material) => {
    let filtered = orders;
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (material) {
      filtered = filtered.filter((order) => order.rawMaterialName === material);
    }
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    filterOrders(statusFilter, materialFilter);
  }, [statusFilter, materialFilter, orders]);

  const handleColumnVisibilityChange = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Supplier Orders
      </Typography>
      
      {/* Filter Inputs */}
      <Box display="flex" gap={2} mb={3}>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">All Statuses</MenuItem>
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
            setMaterialFilter(newValue ? newValue.materialName : ''); // Update filter as well
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Raw Material" variant="outlined" />
          )}
          fullWidth
        />
      </Box>

      {/* Column Visibility Control */}
      <Box display="flex" gap={2} mb={2}>
        {Object.keys(visibleColumns).map((column) => (
          <FormControlLabel
            key={column}
            control={
              <Checkbox
                checked={visibleColumns[column]}
                onChange={() => handleColumnVisibilityChange(column)}
              />
            }
            label={column.charAt(0).toUpperCase() + column.slice(1)} // Capitalize first letter of column names
          />
        ))}
      </Box>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Order
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3, border: '1px solid grey' }}>
        <Table sx={{ border: '1px solid grey' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              {visibleColumns.supplierName && <TableCell>Supplier Name</TableCell>}
              {visibleColumns.status && <TableCell>Status</TableCell>}
              {visibleColumns.trackingInfo && <TableCell>Tracking Info</TableCell>}
              {visibleColumns.notes && <TableCell>Notes</TableCell>}
              {visibleColumns.rawMaterialName && <TableCell>Raw Material</TableCell>}
              {visibleColumns.rawMaterialQuantity && <TableCell>Quantity</TableCell>}
              {visibleColumns.createdBy && <TableCell>Created By</TableCell>}
              {visibleColumns.createdDate && <TableCell>Created Date</TableCell>}
              {visibleColumns.updatedBy && <TableCell>Updated By</TableCell>}
              {visibleColumns.updatedDate && <TableCell>Updated Date</TableCell>}
              <TableCell>Actions</TableCell> {/* Actions column always visible */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId}>
                {visibleColumns.supplierName && <TableCell>{order.supplierName}</TableCell>}
                {visibleColumns.status && <TableCell>{order.status}</TableCell>}
                {visibleColumns.trackingInfo && <TableCell>{order.trackingInfo}</TableCell>}
                {visibleColumns.notes && <TableCell>{order.notes}</TableCell>}
                {visibleColumns.rawMaterialName && <TableCell>{order.rawMaterialName}</TableCell>}
                {visibleColumns.rawMaterialQuantity && <TableCell>{order.rawMaterialQuantity}</TableCell>}
                {visibleColumns.createdBy && <TableCell>{order.createdBy}</TableCell>}
                {visibleColumns.createdDate && <TableCell>{order.createdDate}</TableCell>}
                {visibleColumns.updatedBy && <TableCell>{order.updatedBy}</TableCell>}
                {visibleColumns.updatedDate && <TableCell>{order.updatedDate}</TableCell>}
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOrder(order)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteOrder(order.orderId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Order' : 'Add New Order'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Supplier Name"
            fullWidth
            variant="outlined"
            value={newOrder.supplierName}
            onChange={(e) => setNewOrder({ ...newOrder, supplierName: e.target.value })}
          />
          <Select
            fullWidth
            value={newOrder.status}
            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
          <TextField
            margin="normal"
            label="Tracking Info"
            fullWidth
            variant="outlined"
            value={newOrder.trackingInfo}
            onChange={(e) => setNewOrder({ ...newOrder, trackingInfo: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Notes"
            fullWidth
            variant="outlined"
            value={newOrder.notes}
            onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
          />
          <Autocomplete
            options={rawMaterials}
            getOptionLabel={(option) => option.materialName}
            value={rawMaterials.find(material => material.id === newOrder.rawMaterialId) || null}
            onChange={(event, newValue) => {
              setNewOrder({ ...newOrder, rawMaterialId: newValue ? newValue.id : '' });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Raw Material" variant="outlined" />
            )}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            margin="normal"
            label="Raw Material Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={newOrder.rawMaterialQuantity}
            onChange={(e) => setNewOrder({ ...newOrder, rawMaterialQuantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddOrder} color="primary">
            {editMode ? 'Update Order' : 'Add Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
  
};

export default Orders;
