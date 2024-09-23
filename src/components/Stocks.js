import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Toolbar,
  Typography,
  Alert,
  Autocomplete,
  TableSortLabel
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const Stocks = ({ userDetails }) => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState(null);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:8080/api/rawMaterialStock')
      .then(response => {
        setStocks(response.data);
        setFilteredStocks(response.data); // Initialize filtered stocks

        const lowStockAlerts = response.data
          .filter(stock => stock.quantity < stock.minQuantity)
          .map(stock => `Low stock alert: ${stock.rawMaterial.materialName} is below threshold with ${stock.quantity} units remaining.`);

        setAlerts(lowStockAlerts);
      })
      .catch(error => {
        console.error('Error fetching stocks:', error.response ? error.response.data : error.message);
      });
  }, []);

  const handleUpdate = (index) => {
    const actualIndex = page * rowsPerPage + index;
    const updatedStock = filteredStocks[actualIndex];

    if (!updatedStock.raw_material_stock_id) {
      console.error('Error: updatedStock.raw_material_stock_id is undefined');
      return;
    }

    const currentTime = new Date().toISOString();
    const payload = {
      rawMaterialId: updatedStock.rawMaterial.id,
      quantity: updatedStock.quantity,
      dateModified: currentTime,
      modifiedBy: userDetails || null,
      minQuantity: updatedStock.minQuantity
    };

    axios.put(`http://localhost:8080/api/rawMaterialStock/${updatedStock.raw_material_stock_id}`, payload)
      .then(response => {
        const updatedStocks = [...stocks];
        updatedStocks[actualIndex] = response.data;
        setStocks(updatedStocks);

        const newAlerts = updatedStocks
          .filter(stock => stock.quantity < stock.minQuantity)
          .map(stock => `Low stock alert: ${stock.rawMaterial.materialName} is below threshold with ${stock.quantity} units remaining.`);

        setAlerts(newAlerts);
      })
      .catch(error => {
        console.error('Error updating stock:', error.response ? error.response.data : error.message);
      });
  };

  const handleQuantityChange = (index, event) => {
    const newStocks = [...filteredStocks];
    newStocks[page * rowsPerPage + index].quantity = Number(event.target.value);
    setFilteredStocks(newStocks);
  };

  const handleSearchChange = (event, value) => {
    setSearchValue(value);
    if (value) {
      const filtered = stocks.filter(stock =>
        stock.rawMaterial.materialName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
      setPage(0);
    } else {
      setFilteredStocks(stocks); // Reset to full list if search is cleared
    }
  };

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...filteredStocks].sort((a, b) => {
      const aValue = a.rawMaterial.materialName.toLowerCase();
      const bValue = b.rawMaterial.materialName.toLowerCase();

      if (newDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStocks(sorted);
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

        {alerts.length > 0 && (
          <Box mb={2}>
            {alerts.map((alert, index) => (
              <Alert severity="warning" key={index}>
                {alert}
              </Alert>
            ))}
          </Box>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {/* Search by Raw Material Name */}
          <Autocomplete
            options={stocks.map(stock => stock.rawMaterial.materialName)}
            value={searchValue}
            onChange={handleSearchChange}
            renderInput={(params) => (
              <TextField {...params} label="Search Raw Material" variant="outlined" style={{ width: '300px', border: '1px solid #ccc' }} />
            )}
          />

          {/* Sort by Name Button */}
          <Button
            variant="outlined"
            onClick={() => handleSort('rawMaterial')}
            style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}
          >
            Sort by Name <SwapVertIcon style={{ marginLeft: '8px' }} />
          </Button>
        </div>

        <TableContainer component={Paper} sx={{ border: '1px solid lightgray' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                <TableCell>
                  
                    Raw Material Name
                  
                </TableCell>
                <TableCell>Raw Material Quantity</TableCell>
                <TableCell>Min Quantity</TableCell>
                <TableCell>Update Quantity</TableCell>
                <TableCell>Modified By</TableCell>
                <TableCell>Time Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                <TableRow key={stock.raw_material_stock_id} sx={{ borderBottom: '1px solid lightgray' }}>
                  <TableCell>{stock.rawMaterial.materialName}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.minQuantity}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={stock.quantity}
                      onChange={(e) => handleQuantityChange(index, e)}
                      size="small" 
                      sx={{ width: '80px' }} 
                    />
                    <Button onClick={() => handleUpdate(index)} color="primary">
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>{`${stock.modifiedBy?.firstName || userDetails?.firstName} ${stock.modifiedBy?.lastName || userDetails?.lastName}`}</TableCell>
                  <TableCell>{new Date(stock.dateModified).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStocks.length}
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
