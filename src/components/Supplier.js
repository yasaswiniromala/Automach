import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  IconButton,Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, Autocomplete } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert'; // Import the icon
import { Edit, Delete } from '@mui/icons-material';



const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // For sorting


  useEffect(() => {
    fetchSuppliers();
    fetchOrders(); // Fetch all orders when the component loads
  }, []);

  const fetchSuppliers = async () => {
    const response = await axios.get('http://localhost:8080/api/suppliers');
    setSuppliers(response.data);
    setFilteredSuppliers(response.data); // Initialize filtered suppliers
  };

  const fetchOrders = async () => {
    const response = await axios.get('http://localhost:8080/api/orders');
    setOrders(response.data);
  };

  const handleAddOrEdit = async () => {
    if (selectedSupplier.id) {
      await axios.put(`http://localhost:8080/api/suppliers/${selectedSupplier.id}`, selectedSupplier);
    } else {
      await axios.post('http://localhost:8080/api/suppliers', selectedSupplier);
    }
    setOpen(false);
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    const openOrders = orders.filter(order =>
      order.supplierName === suppliers.find(supplier => supplier.id === id).name &&
      (order.status === 'Pending' || order.status === 'Shipped')
    );

    if (openOrders.length > 0) {
      setConfirmDelete(true);
      setSelectedSupplier(suppliers.find(supplier => supplier.id === id));
    } else {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      fetchSuppliers();
    }
  };

  const confirmDeleteSupplier = async () => {
    if (selectedSupplier) {
      await axios.delete(`http://localhost:8080/api/suppliers/${selectedSupplier.id}`);
      setConfirmDelete(false);
      setSelectedSupplier(null);
      fetchSuppliers();
    }
  };

  const handleOpen = (supplier) => {
    setSelectedSupplier(supplier ? supplier : { name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmDelete(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortByName = () => {
    const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
      // Remove leading/trailing spaces and ensure case-insensitive comparison
      const nameA = a.name.trim().toLowerCase();
      const nameB = b.name.trim().toLowerCase();

      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredSuppliers(sortedSuppliers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };



  // Search function
  const handleSearchChange = (event, value) => {
    setSearchValue(value);
    const filtered = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };


  return (
    <Paper style={{ padding: '16px' }}>
      <Button variant="contained" color="primary"
        onClick={() => handleOpen(null)}
        style={{ marginLeft: '16px', marginBottom: '16px' }}
      >Add New Supplier</Button>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
  {/* Search by Supplier Name */}
  <Autocomplete
    options={suppliers.map((supplier) => supplier.name)}
    value={searchValue}
    onInputChange={handleSearchChange}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Search Supplier"
        margin="normal"
        style={{ width: '300px' ,border: '1px solid #ccc'}} // Increase the width of the search box
      />
    )}
  />

  {/* Sort by Name Button */}
  <Button
    variant="outlined"
    onClick={handleSortByName}
    style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}
  >
    Sort by Name <SwapVertIcon style={{ marginLeft: '8px' }} />
  </Button>
</div>



      <TableContainer component={Paper}>
        <Table style={{ border: '1px solid black' }}>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              {/* <TableCell style={{ color: 'black' }}>Name</TableCell> */}
              <TableCell style={{ color: 'black' }}>
  <Button
    variant="contanied"
    onClick={handleSortByName}
 
    endIcon={<SwapVertIcon />} // Adds the sorting icon at the end of the text
  >
    Name
  </Button>
</TableCell>

              <TableCell style={{ color: 'black' }}>Email</TableCell>
              <TableCell style={{ color: 'black' }}>Phone</TableCell>
              <TableCell style={{ color: 'black' }}>Address</TableCell>
              <TableCell style={{ color: 'black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
              <TableRow key={supplier.id} style={{ borderBottom: '1px solid lightblack' }}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{`${supplier.addressLine1}, ${supplier.addressLine2}, ${supplier.city}, ${supplier.state}, ${supplier.postalCode}`}</TableCell>
                <TableCell>
  <Button 
    variant="outlined" 
    color="primary" 
    onClick={() => handleOpen(supplier)} 
    style={{ marginRight: '8px' }} 
    startIcon={<Edit />} // Adds the Edit icon inside the button
  >
    Edit
  </Button>
  
  <Button 
    variant="outlined" 
    color="error" 
    onClick={() => handleDelete(supplier.id)} 
    startIcon={<Delete />} // Adds the Delete icon inside the button
  >
    Delete
  </Button>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredSuppliers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

<Dialog
  open={open}
  onClose={handleClose}
  PaperProps={{
    sx: {
      padding: '16px', // Adds padding inside the dialog box
      borderRadius: '8px', // Rounds the corners
      border: '1px solid #ccc', // Adds a subtle border
      backgroundColor: '#f9f9f9', // Light background color
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' // Adds a shadow for depth
    }
  }}
>
  <DialogTitle>
    <span style={{ color: '#3f51b5', fontWeight: 'bold' }}>
      {selectedSupplier?.id ? 'Edit Supplier' : 'Add Supplier'}
    </span>
  </DialogTitle>
  <DialogContent>
    {/* All the TextField components */}
    <TextField margin="dense" label="Name" fullWidth value={selectedSupplier?.name} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, name: e.target.value })} />
    <TextField margin="dense" label="Email" fullWidth value={selectedSupplier?.email} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, email: e.target.value })} />
    <TextField margin="dense" label="Phone" fullWidth value={selectedSupplier?.phone} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })} />
    <TextField margin="dense" label="Address Line 1" fullWidth value={selectedSupplier?.addressLine1} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, addressLine1: e.target.value })} />
    <TextField margin="dense" label="Address Line 2" fullWidth value={selectedSupplier?.addressLine2} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, addressLine2: e.target.value })} />
    <TextField margin="dense" label="City" fullWidth value={selectedSupplier?.city} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, city: e.target.value })} />
    <TextField margin="dense" label="State" fullWidth value={selectedSupplier?.state} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, state: e.target.value })} />
    <TextField margin="dense" label="Postal Code" fullWidth value={selectedSupplier?.postalCode} onChange={(e) => setSelectedSupplier({ ...selectedSupplier, postalCode: e.target.value })} />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} sx={{ color: '#f44336' }}>Cancel</Button> {/* Red color for cancel button */}
    <Button onClick={handleAddOrEdit} sx={{ backgroundColor: '#3f51b5', color: '#fff', ':hover': { backgroundColor: '#303f9f' } }}>
      {selectedSupplier?.id ? 'Update' : 'Add'}
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={confirmDelete}
  onClose={handleClose}
  PaperProps={{
    sx: {
      padding: '16px', // Adds padding inside the dialog box
      borderRadius: '8px', // Rounds the corners
      border: '1px solid #ccc', // Adds a subtle border
      backgroundColor: '#ffebee', // Light red background for delete confirmation
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' // Adds a shadow for depth
    }
  }}
>
  <DialogTitle>
    <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>Confirm Delete</span>
  </DialogTitle>
  <DialogContent>
    There are open orders associated with this supplier. Are you sure you want to delete?
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} sx={{ color: '#757575' }}>Cancel</Button> {/* Gray color for cancel button */}
    <Button onClick={confirmDeleteSupplier} sx={{ backgroundColor: '#d32f2f', color: '#fff', ':hover': { backgroundColor: '#b71c1c' } }}>
      Delete Anyway
    </Button>
  </DialogActions>
</Dialog>

    </Paper>
  );
};

export default Supplier;
