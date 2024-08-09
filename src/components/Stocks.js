import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Toolbar, Typography } from '@mui/material';

const Stocks = ({ userDetails }) => {
  const [stocks, setStocks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get('http://localhost:8080/api/rawMaterialStock')
      .then(response => {
        setStocks(response.data);
        console.log('Fetched Stocks:', response.data);
      })
      .catch(error => {
        console.error('Error fetching stocks:', error.response ? error.response.data : error.message);
      });
  }, []);

  const handleUpdate = (index) => {
    const actualIndex = page * rowsPerPage + index;
    const updatedStock = stocks[actualIndex];

    console.log('Actual Index:', actualIndex);
    console.log('Updated Stock:', updatedStock);

    if (!updatedStock.raw_material_stock_id) {
      console.error('Error: updatedStock.raw_material_stock_id is undefined');
      return;
    }

    const currentTime = new Date().toISOString();
    const payload = {
      ...updatedStock,
      dateModified: currentTime,
      modifiedBy: userDetails
    };

    console.log('Payload:', payload);

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

  const handleQuantityChange = (index, event) => {
    const newStocks = [...stocks];
    newStocks[page * rowsPerPage + index].quantity = event.target.value;
    setStocks(newStocks);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
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
                <TableRow key={stock.raw_material_stock_id}>
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
                  <TableCell>{`${stock.modifiedBy.firstName} ${stock.modifiedBy.lastName}` || `${userDetails?.firstName} ${userDetails?.lastName}`}</TableCell>
                  <TableCell>{new Date(stock.dateModified).toLocaleString()}</TableCell>
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
