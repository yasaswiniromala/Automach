import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SellSharpIcon from '@mui/icons-material/SellSharp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import Container from '@mui/material/Container';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, IconButton, Grid, Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 240;

const Home = ({ userDetails }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ prodName: '', rawMaterials: [{ materialId: '', rawMaterialQuantity: '' }] });
  const [materialOptions, setMaterialOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/rawmaterials')
      .then(response => {
        setMaterialOptions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the raw materials!', error);
        setError('Error fetching raw materials');
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
        setError('Error fetching products');
        setLoading(false);
      });
  }, []);

  const fetchRawMaterials = async (prodId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${prodId}/materials`);
      setRawMaterials(response.data);
      setSelectedProduct(prodId);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
      setRawMaterials([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProduct({ prodName: '', rawMaterials: [{ materialId: '', rawMaterialQuantity: '' }] });
  };

  const handleAddRawMaterial = () => {
    setNewProduct({ ...newProduct, rawMaterials: [...newProduct.rawMaterials, { materialId: '', rawMaterialQuantity: '' }] });
  };

  const handleRemoveRawMaterial = (index) => {
    const newRawMaterials = newProduct.rawMaterials.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, rawMaterials: newRawMaterials });
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRawMaterials = [...newProduct.rawMaterials];
    newRawMaterials[index][name] = value;
    setNewProduct({ ...newProduct, rawMaterials: newRawMaterials });
  };

  const handleAddProduct = () => {
    const rawMaterialQuantities = {};
    newProduct.rawMaterials.forEach((material) => {
      const rawMaterialId = material.materialId;
      if (rawMaterialId) {
        rawMaterialQuantities[rawMaterialId] = material.rawMaterialQuantity;
      }
    });

    const payload = {
      product: {
        prodName: newProduct.prodName,
      },
      rawMaterialQuantities: rawMaterialQuantities
    };

    axios.post('http://localhost:8080/api/products', payload)
      .then(response => {
        setProducts([...products, response.data]);
        handleClose();
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  const filteredProducts = products.filter(product =>
    product.prodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Box sx={{ overflow: 'auto' }}>
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
            <ListItem button component={Link} to="/stock">
              <ListItemIcon><InventoryIcon /></ListItemIcon>
              <ListItemText primary="Stock" />
            </ListItem>
            <ListItem button component={Link} to="/warehouse">
              <ListItemIcon><WarehouseIcon /></ListItemIcon>
              <ListItemText primary="Warehouse" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h5" component="h3" gutterBottom>
            Welcome {userDetails.firstName} {userDetails.lastName}
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            {userDetails.position}
          </Typography>
          <Box mt={5} textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              AutoMach
            </Typography>
            <Typography variant="h6" component="p" color="textSecondary">
              AutoMach is a process management tool for streamlining day-to-day activities in a process-oriented manufacturing hub.
              It tunes your process by digitizing data and enhancing production cycles using smart prediction systems that can provide insights across multiple departments.
              Expand your horizons to increase margins in the process pipeline and deliver high-quality products.
            </Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Products
            </Typography>
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<AddIcon />}>
              Add Product
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                    <TableRow key={product.prodId}>
                      <TableCell>{product.prodId}</TableCell>
                      <TableCell>{product.prodName}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => fetchRawMaterials(product.prodId)}>
                          View Raw Materials
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          {selectedProduct && (
            <Box mt={4}>
              <Typography variant="h4" component="h2" gutterBottom>
                Raw Materials for Product ID: {selectedProduct}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Raw Material Name</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rawMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.rawMaterial.materialName}</TableCell>
                        <TableCell>{material.rawMaterialQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new product, please enter the product name and configure the raw materials.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            value={newProduct.prodName}
            onChange={(e) => setNewProduct({ ...newProduct, prodName: e.target.value })}
          />
          <Grid container spacing={2}>
            {newProduct.rawMaterials.map((material, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={materialOptions}
                    getOptionLabel={(option) => option.materialName}
                    value={materialOptions.find(option => option.id === material.materialId) || null}
                    onChange={(event, newValue) => {
                      const newRawMaterials = [...newProduct.rawMaterials];
                      newRawMaterials[index].materialId = newValue ? newValue.id : '';
                      setNewProduct({ ...newProduct, rawMaterials: newRawMaterials });
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Raw Material" variant="outlined" />}
                  />
                </Grid>
                <Grid item xs={11}>
                  <TextField
                    margin="dense"
                    label="Quantity"
                    name="rawMaterialQuantity"
                    type="number"
                    value={material.rawMaterialQuantity}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => handleRemoveRawMaterial(index)}>
                    <CancelPresentationIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Button onClick={handleAddRawMaterial} color="primary">
            Add Raw Material
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
