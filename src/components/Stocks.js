import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, Button, Typography, Box, Toolbar
} from '@mui/material';

const Stocks = ({ userDetails }) => {
  const [stocks, setStocks] = useState([]);
//   const [materialMap, setMaterialMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     // Fetch raw materials to create a mapping of IDs to names
//     axios.get('http://localhost:8080/api/rawmaterials')
//       .then(response => {
//         const materialList = response.data;
//         const materialMap = {};
//         materialList.forEach(material => {
//           materialMap[material.id] = material.materialName;
//         });
//         setMaterialMap(materialMap);
//       })
//       .catch(error => {
//         console.error('Error fetching raw materials:', error.response ? error.response.data : error.message);
//         setError('Error fetching raw materials');
//       });
//   }, []);

  useEffect(() => {
    // if (Object.keys(materialMap).length === 0) return; // Ensure materialMap is not empty

    // Fetch stock data
    axios.get('http://localhost:8080/api/rawMaterialStock')
      .then(response => {
        const stockData = response.data.map(stock => ({
          ...stock
        }));
        setStocks(stockData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error.response ? error.response.data : error.message);
        setError('Error fetching stock data');
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleQuantityChange = (index, event) => {
    const { value } = event.target;
    const actualIndex = page * rowsPerPage + index;
    const updatedStocks = [...stocks];
    updatedStocks[actualIndex].quantity = value;
    setStocks(updatedStocks);
  };
  
  const handleUpdate = (index) => {
    const actualIndex = page * rowsPerPage + index;
    const updatedStock = stocks[actualIndex];
    const currentTime = new Date().toISOString();
  
    const payload = {
      ...updatedStock,
      timeModified: currentTime,
    };

    console.log(payload)
  
    axios.put(`http://localhost:8080/api/rawMaterialStock/${updatedStock.raw_material_stock_id}`, payload)
      .then(response => {
        const updatedStocks = [...stocks];
        updatedStocks[actualIndex] = response.data;
        setStocks(updatedStocks);
      })
      .catch(error => {
        console.error('Error updating stock:', error.response ? error.response.data : error.message);
      });
  };
  

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Toolbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Raw Material Stocks
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Raw Material Name</TableCell>
                <TableCell>Raw Material Quantity</TableCell>
                <TableCell>Update Quantity</TableCell>
                <TableCell>Modified By</TableCell>
                <TableCell>Time Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.rawMaterial.materialName}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={stock.quantity}
                      onChange={(e) => handleQuantityChange(index, e)}
                    />
                    <Button onClick={() => handleUpdate(index)} color="primary">
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>{stock.modifiedBy.firstName || userDetails?.firstName}</TableCell>
                  <TableCell>{new Date(stock.timeModified || stock.dateModified).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={stocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Stocks;
