import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination } from '@mui/material';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const response = await axios.get('http://localhost:8080/api/suppliers');
    setSuppliers(response.data);
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
    await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
    fetchSuppliers();
  };

  const handleOpen = (supplier) => {
    setSelectedSupplier(supplier ? supplier : { name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper style={{ padding: '16px' }}>
      <Button variant="contained" color="primary" 
      onClick={() => handleOpen(null)}
      style={{ marginLeft: '16px', marginBottom:'16px' }}
        >Add Supplier</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{`${supplier.addressLine1}, ${supplier.addressLine2}, ${supplier.city}, ${supplier.state}, ${supplier.postalCode}`}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary"
                   onClick={() => handleOpen(supplier)}
                    style={{ marginRight: '8px' }}
                    >Edit</Button>
                  <Button variant="contained" color="primary" onClick={() => handleDelete(supplier.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={suppliers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedSupplier?.id ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleAddOrEdit} color="primary">{selectedSupplier?.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Supplier;
