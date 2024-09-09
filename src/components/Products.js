import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, IconButton, Grid, Autocomplete, Chip, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newProduct, setNewProduct] = useState({
    prodName: '',
    category: null,
    tags: [],
    rawMaterials: [{ materialId: '', rawMaterialQuantity: '' }]
  });
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

  useEffect(() => {
    axios.get('http://localhost:8080/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });

    axios.get('http://localhost:8080/api/tags')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tags!', error);
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
    setNewProduct({
      prodName: '',
      category: null,
      tags: [],
      rawMaterials: [{ materialId: '', rawMaterialQuantity: '' }]
    });
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
        category: newProduct.category,
        tags: newProduct.tags.map(tag => ({ id: tag.id }))
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
  
      
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Toolbar />
      <Container>
        
        
        <Typography variant="h6" component="h4" mt={4} gutterBottom>
          Product List
        </Typography>
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add New Product
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new product, please enter the product name, select a category, assign tags, and specify the raw materials with their quantities.
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
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={newProduct.category}
              onChange={(event, newValue) => {
                setNewProduct({ ...newProduct, category: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="Category" />}
              sx={{ mt: 2 }}
            />
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.name}
              value={newProduct.tags}
              onChange={(event, newValue) => {
                setNewProduct({ ...newProduct, tags: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="Tags" />}
              sx={{ mt: 2 }}
            />
            {newProduct.rawMaterials.map((material, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <Autocomplete
                    options={materialOptions}
                    getOptionLabel={(option) => option.materialName}
                    value={materialOptions.find(opt => opt.materialId === material.materialId) || null}
                    onChange={(event, newValue) => {
                      const newRawMaterials = [...newProduct.rawMaterials];
                      newRawMaterials[index].materialId = newValue ? newValue.materialId : '';
                      setNewProduct({ ...newProduct, rawMaterials: newRawMaterials });
                    }}
                    renderInput={(params) => <TextField {...params} label="Raw Material" margin="normal" />}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    name="rawMaterialQuantity"
                    value={material.rawMaterialQuantity}
                    onChange={(e) => handleInputChange(index, e)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveRawMaterial(index)} color="error">
                    <CancelPresentationIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddRawMaterial} startIcon={<AddIcon />} variant="contained">
              Add Material
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleAddProduct} color="primary">Add Product</Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
            
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <TableRow key={product.prodId} hover>
                  
                  <TableCell>{product.prodName}</TableCell>
                  <TableCell>{product.category?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {product.tags.map((tag) => (
                      <Chip key={tag.id} label={tag.name} sx={{ mr: 1 }} />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" onClick={() => fetchRawMaterials(product.prodId)}>
                      View Raw Materials
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
        {selectedProduct && (
          <>
            <Typography variant="h6" component="h4" mt={4} gutterBottom>
              Raw Materials for Selected Product
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Raw Material ID</TableCell>
                    <TableCell>Raw Material Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rawMaterials.map((material) => {
                    return (
                      <TableRow key={material.id}>
                        <TableCell>{material.rawMaterial.id || 'N/A'}</TableCell>
                        <TableCell>{material.rawMaterial.materialName || 'N/A'}</TableCell>
                        <TableCell align="right">{material.rawMaterialQuantity || 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </Box>
  </Box>
  );
};

export default Products;
