import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { fetchChatbotResponse } from './chatbotFetching'; // Import the fetching function
import axios from 'axios';

const Chatbot = ({ userDetails }) => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { bot: `Hello, ${userDetails?.firstName} ${userDetails?.lastName}, how can I assist you today?` },
  ]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [typing, setTyping] = useState(false); // Typing indicator state

  // Function to handle API calls based on URL
  const handleApiCall = async (url, queryContext = {}) => {
    try {
      let response;

      // Use switch-case to handle different URL patterns
      switch (true) {
        // Raw Materials
        case url === 'http://localhost:8080/api/rawmaterials':
          response = await axios.get(url);
          return response.data.map((material) => material.materialName || 'Unknown').join(', ');

        case url.includes('/api/rawMaterialStock/material/'):
          // Extract the material name from the URL
          const materialName = url.split('/').pop();

          // Make the API call
          response = await axios.get(url);

          // Check the user's query to determine whether it's for 'min quantity' or 'current quantity'
          const queryLower = queryContext.query.toLowerCase();

          if (queryLower.includes('min quantity')) {
            return `Material: ${response.data.rawMaterial.materialName}, Min Quantity: ${response.data.minQuantity}`;
          } else if (queryLower.includes('current quantity')) {
            return `Material: ${response.data.rawMaterial.materialName}, Current Quantity: ${response.data.quantity}`;
          } else {
            // If no specific quantity type is requested, return both
            return `Material: ${response.data.rawMaterial.materialName}, Min Quantity: ${response.data.minQuantity}, Current Quantity: ${response.data.quantity}`;
          }

        // Suppliers
        case url === 'http://localhost:8080/api/suppliers':
          // Fetch the list of suppliers
          response = await axios.get(url);
          return response.data.map((supplier) => supplier.name || 'Unknown').join(', ');

        case url.includes('/api/suppliers/supplierName/'):
          // Extract the supplier name from the URL
          const supplierName = url.split('/').pop();

          // Fetch supplier details by name
          response = await axios.get(url);

          // Check if user is asking for a specific supplier's address
          if (queryContext.query.toLowerCase().includes('address')) {
            return `Supplier: ${response.data.name}, Address: ${response.data.addressLine1}, ${response.data.addressLine2}, ${response.data.city}, ${response.data.state}, ${response.data.postalCode}`;
          } else {
            // Return general details if no specific field is asked
            return `Supplier: ${response.data.name}, Email: ${response.data.email}, Phone: ${response.data.phone}`;
          }

        default:
          // If the URL doesn't match any of the cases, return an error message
          return 'No valid API URL provided.';
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return 'Sorry, there was an issue fetching the data. Please try again later.';
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setLoading(true);
    setTyping(true);
    setError(null);

    try {
      const response = await fetchChatbotResponse(userMessage);
      console.log('Chatbot response:', response);

      // Extract URL from the chatbot response (more robust regex to handle URL within axios.get())
      const urlMatch = response.match(/axios\.get\('([^']+)'\)/);
      const url = urlMatch ? urlMatch[1] : null;

      // Extract raw material name or supplier name from the user's query (fallback to 'wood' for raw materials)
      const rawMaterialMatch = userMessage.match(/quantity of ([a-zA-Z]+)/i);
      const rawMaterial = rawMaterialMatch ? rawMaterialMatch[1].toLowerCase() : 'wood'; // Default to 'wood'

      // Extract supplier name from user's query (if applicable)
      const supplierMatch = userMessage.match(/address of ([a-zA-Z\s]+)/i);
      const supplierName = supplierMatch ? supplierMatch[1].toLowerCase() : null;

      const queryContext = {
        rawMaterial: rawMaterial,
        supplierName: supplierName,
        query: userMessage.toLowerCase(),
      };

      if (url) {
        const apiData = await handleApiCall(url, queryContext);
        setChatHistory([...chatHistory, { user: userMessage, bot: `Fetched data: ${apiData}` }]);
      } else {
        setChatHistory([...chatHistory, { user: userMessage, bot: response }]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setTyping(false);
      setUserMessage('');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: 2, maxWidth: 600, margin: '0 auto' }}
    >
      {/* Chat History */}
      <Paper elevation={3} sx={{ width: '100%', maxHeight: 400, overflowY: 'auto', padding: 2, marginBottom: 2 }}>
        {chatHistory.map((chat, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            {chat.user && <Typography variant="body1"><strong>User:</strong> {chat.user}</Typography>}
            <Typography variant="body1"><strong>Bot:</strong> {chat.bot}</Typography>
          </Box>
        ))}
        {typing && <Typography variant="body2"><em>Bot is typing...</em></Typography>}
      </Paper>

      {/* Error Message */}
      {error && <Typography color="error" variant="body2">{error}</Typography>}

      {/* Input Field and Send Button */}
      <Box display="flex" width="100%" gap={2}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={loading} // Disable input while loading
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={loading || !userMessage}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
