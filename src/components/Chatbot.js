import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { fetchChatbotResponse } from './chatbotFetching'; // Import the fetching function

const Chatbot = ({ userDetails }) => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [typing, setTyping] = useState(false); // Typing indicator state

  // Show welcome message on component mount
  useEffect(() => {
    if (userDetails) {
      const welcomeMessage = `Hello, ${userDetails.firstName} ${userDetails.lastName}, how can I assist you today?`;
      setChatHistory([{ bot: welcomeMessage }]);
    }
  }, [userDetails]);

  // Function to handle sending user messages
  const handleSendMessage = async () => {
    if (!userMessage) return; // Don't send an empty message

    setLoading(true);
    setTyping(true); // Show typing indicator
    setError(null); // Reset error

    try {
      const response = await fetchChatbotResponse(userMessage); // Get response from OpenAI
      setChatHistory([...chatHistory, { user: userMessage, bot: response }]); // Update chat history
    } catch (err) {
      setError('Something went wrong. Please try again.'); // Set error message
    } finally {
      setLoading(false);
      setTyping(false); // Hide typing indicator
      setUserMessage(''); // Clear input field
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
