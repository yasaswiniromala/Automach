import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TablePagination, IconButton, Dialog, DialogActions, DialogContent, Select,MenuItem,
  DialogTitle, Button, TextField,useTheme,Chip,InputLabel, FormControl, OutlinedInput
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import dayjs from "dayjs"; 

const Sales = ({ userDetails }) => {
  const theme = useTheme();
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editSale, setEditSale] = useState(null);
  const [products, setProducts] = useState([]); 
  const [openAdd, setOpenAdd] = useState(false); // Separate state for Add dialog
  const [openEdit, setOpenEdit] = useState(false); // Separate state for Edit dialog
  const [formData, setFormData] = useState({
    customerName: '',
    orderDecision: '',
    productIds: [],
    quantities: [],
    discountPercent: '',
    orderStatus: '',
    orderDeliveryDate: ''
  });
  const [newSale, setNewSale] = useState({
    customerName: "",
    orderDecision: "",
    productIds: [],
    quantities: "",
    discountPercent: "",
    orderStatus: "",
    orderCreatedDate: "",
    createdUserId: "",
    orderDeliveryDate: "",
  });

  // Fetch sales data
  useEffect(() => {
    axios.get('http://localhost:8080/api/sales')
      .then(response => setSales(response.data))
      .catch(error => console.error('Error fetching sales:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  
  // Handle delete
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/sales/${id}`)
      .then(() => setSales(sales.filter(sale => sale.saleId !== id)))
      .catch(error => console.error('Error deleting sale:', error));
  };

  // Handle dialog open for editing
  const handleEdit = (sale) => {
    setEditSale(sale);
    setFormData({
      customerName: sale.customerName,
      orderDecision: sale.orderDecision,
      productIds: sale.products.map(prod => prod.prodId),
      // Ensure quantities is treated as an array
      quantities: Array.isArray(sale.quantities) ? sale.quantities : sale.quantities.split(',').map(Number),
      discountPercent: sale.discountPercent,
      orderStatus: sale.orderStatus,
      orderDeliveryDate: new Date(sale.orderDeliveryDate).toISOString().split('T')[0],
    });
    setOpenEdit(true);
  };

  // Handle save (PUT request)
  const handleSave = () => {
    const updatedSale = {
      ...formData,
      updatedUserId: userDetails.userId,
      updatedDate: new Date().toISOString(),
      quantities: Array.isArray(formData.quantities) ? formData.quantities : formData.quantities.split(',').map(Number), // Ensure quantities is an array before saving
    };

    axios.put(`http://localhost:8080/api/sales/${editSale.saleId}`, updatedSale)
      .then(response => {
        setSales(sales.map(sale => (sale.saleId === editSale.saleId ? response.data : sale)));
        setOpenEdit(false);
      })
      .catch(error => console.error('Error updating sale:', error));
  };

  // Handle form input changes for editing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'quantities'
        ? e.target.value.split(',').map(Number)  // Ensure quantities are split into an array
        : e.target.value
    });
  };

  // Table Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open dialog for adding new order
  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  // Handle form changes for new order
  const handleInputChange = (e) => {
    setNewSale({
      ...newSale,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to add new order
  const handleAddOrder = () => {
    const saleData = {
      customerName: newSale.customerName,
      orderDecision: newSale.orderDecision,
      productIds: newSale.productIds,  // Product IDs from the dropdown
      quantities: newSale.quantities.split(',').map(Number),
      discountPercent: newSale.discountPercent,
      orderStatus: newSale.orderStatus,
      orderCreatedDate: newSale.orderCreatedDate,
      createdUserId: Number(newSale.createdUserId),
      orderDeliveryDate: newSale.orderDeliveryDate,
    };
    

    axios.post("http://localhost:8080/api/sales", saleData)
      .then(() => {
        setSales([...sales, saleData]);
        // setSales([...sales, response.data]);  // Add new sale to the sales list
        handleCloseAdd(); // Close the add dialog
      })
      .catch((error) => {
        console.error("Error adding new order:", error);
      });
  };


  return (
    <Paper>
      <h1 sx={{ml:3}} >Sales Orders</h1>
      <Button variant="contained" sx={{ml:3}} color="primary" onClick={handleClickOpenAdd}>
        Add New Order
      </Button>
      
      {/* Dialog for adding new order */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Customer Name"
            name="customerName"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Decision"
            name="orderDecision"
            fullWidth
            onChange={handleInputChange}
          />
          {/* Dialog for adding new order */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Customer Name"
            name="customerName"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Decision"
            name="orderDecision"
            fullWidth
            onChange={handleInputChange}
          />
          {/* <TextField
            margin="dense"
            label="Product IDs (comma-separated)"
            name="productIds"
            fullWidth
            onChange={handleInputChange}
          /> */}

          {/* Multi-select for Product Names */}
<FormControl fullWidth>
  <InputLabel>Product Names</InputLabel>
  <Select
    multiple
    name="productIds"
    value={newSale.productIds}
    onChange={(e) => setNewSale({
      ...newSale,
      productIds: e.target.value
    })}
    input={<OutlinedInput label="Product Names" />}
    renderValue={(selected) => selected.map(id => {
      const product = products.find(p => p.prodId === id);
      return product ? product.prodName : id;
    }).join(', ')}
  >
    {products.map((product) => (
      <MenuItem key={product.prodId} value={product.prodId}>
        {product.prodName}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          <TextField
            margin="dense"
            label="Quantities (comma-separated)"
            name="quantities"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Discount Percent"
            name="discountPercent"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Status"
            name="orderStatus"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Created Date (YYYY-MM-DDTHH:MM:SS)"
            name="orderCreatedDate"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Created User ID"
            name="createdUserId"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Delivery Date (YYYY-MM-DDTHH:MM:SS)"
            name="orderDeliveryDate"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddOrder} color="primary">
            Add Order
          </Button>
        </DialogActions>
      </Dialog>
      
          <TextField
            margin="dense"
            label="Quantities (comma-separated)"
            name="quantities"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Discount Percent"
            name="discountPercent"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Status"
            name="orderStatus"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Created Date (YYYY-MM-DDTHH:MM:SS)"
            name="orderCreatedDate"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Created User ID"
            name="createdUserId"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Order Delivery Date (YYYY-MM-DDTHH:MM:SS)"
            name="orderDeliveryDate"
            fullWidth
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddOrder} color="primary">
            Add Order
          </Button>
        </DialogActions>
      </Dialog>
      
      <TableContainer>
        <Table sx={{ border: '1px solid grey',mt:3,ml:3}}>
          <TableHead   sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : theme.palette.background.default,
      fontWeight: 'bold',}}>
            <TableRow sx={{ bgcolor: theme.palette.background.main, fontWeight: 'bold'}}>
              <TableCell>Customer Name</TableCell>
              <TableCell>Order Decision</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantities</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Order Created Date</TableCell>
              <TableCell>Order Delivery Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale) => (
              <TableRow key={sale.saleId}>
                <TableCell>{sale.customerName}</TableCell>
                {/* <TableCell>{sale.orderDecision}</TableCell> */}
                <TableCell>
  <Chip
    label={sale.orderDecision}
    color={
      sale.orderDecision === 'confirmed'
        ? 'success'
        : sale.orderDecision === 'quoted'
        ? 'warning'
        : 'default'
    }
    variant="outlined"
  />
</TableCell>

                <TableCell>
                  {sale.products.map((product) => (
                    <div key={product.prodId}>{product.prodName}</div>
                  ))}
                </TableCell>
                <TableCell>{Array.isArray(sale.quantities) ? sale.quantities.join(', ') : sale.quantities}</TableCell>
                <TableCell>{sale.discountPercent}%</TableCell>
                <TableCell>{sale.totalPrice}</TableCell>
                <TableCell>{sale.finalPrice}</TableCell>
                {/* <TableCell>{sale.orderStatus}</TableCell> */}
                <TableCell>
                
  <Chip
    label={sale.orderStatus}
    color={
      sale.orderStatus === 'pending'
        ? 'warning'   // Use warning for pending
        : sale.orderStatus === 'shipped'
        ? 'success'   // Use success for shipped
        : sale.orderStatus === 'Delivered'
        ? 'error'     // Use error for delivered
        : 'default'   // Default color for other statuses
    }
    variant="outlined"
  />
</TableCell>


<TableCell>
                    {dayjs(sale.orderCreatedDate).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {dayjs(sale.orderDeliveryDate).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                <TableCell>{sale.createdBy.firstName}</TableCell>
                <TableCell>{new Date(sale.updatedDate).toLocaleString()}</TableCell>
                <TableCell>
                  {/* <IconButton onClick={() => handleEdit(sale)}>
                    <Edit />
                  </IconButton> */}
      <Button
  variant="outlined"
  color="primary"
  onClick={() => handleEdit(sale)}
  sx={{ mb: 2 }}  // Adds margin to the right
  startIcon={<Edit />}
>
  Edit
</Button>
                  
                  <Button 
    variant="outlined" 
    color="error" 
    onClick={() =>handleDelete(sale.saleId)}
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
        count={sales.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for editing sale */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Order Decision"
            name="orderDecision"
            value={formData.orderDecision}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Product IDs (comma-separated)"
            name="productIds"
            value={formData.productIds.join(',')}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Quantities (comma-separated)"
            name="quantities"
            value={formData.quantities.join(',')}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Discount Percent"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
            fullWidth
          />
          {/* <TextField
            margin="dense"
            label="Order Status"
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleChange}
            fullWidth
          
          /> */}
            <Select
            fullWidth
            value={formData.orderStatus}
            onChange={handleChange}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="shipped">shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Order Delivery Date"
            name="orderDeliveryDate"
            type="date"
            value={formData.orderDeliveryDate}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Sales;
