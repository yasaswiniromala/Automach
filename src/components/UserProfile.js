// UserProfile.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const UserProfile = ({ userDetails }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="h6" component="h2">
        First Name: {userDetails.firstName}
      </Typography>
      <Typography variant="h6" component="h2">
        Last Name: {userDetails.lastName}
      </Typography>
      <Typography variant="h6" component="h2">
        Email: {userDetails.email}
      </Typography>
      <Typography variant="h6" component="h2">
        Position: {userDetails.position}
      </Typography>
      
      <Typography variant="h6" component="h2">
        Phone Number : {userDetails.phoneNumber}
      </Typography>
      
    </Box>
  );
};

export default UserProfile;
