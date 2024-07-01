import React, { useState } from "react";
import imglogo from "./automachlogo.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const NewLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);


    const navigate = useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };


    const handleCheckboxChange = (e) => {
        setKeepMeSignedIn(e.target.checked);
    };


    const handleSubmit = (event) => {
        event.preventDefault();


        console.log("USERNAME: ", username);
        console.log("PASSWORD: ", password);


        if (username === "yromala" && password === "Anusha123") {
            alert("Successfully Loggedin 😀");
        } else {
            alert("Login Failed !!! 😡");
        }
    };

    


    const handleRegister = () => {
        navigate("/signup");
    };


    const handleForgotPassword = () => {
        alert("Navigate to forget password page");
    };


    return (
        <div className="login-container">
            <div className="header">
                <img src={imglogo} alt="Icon" className="logo" />
                <Typography variant="h4" component="h2">Welcome Back <span>👋</span></Typography>
                <Typography variant="body1">Let’s explore the app again with us.</Typography>
            </div>
            <Typography variant="h5" component="h3">Login</Typography>
            <form onSubmit={handleSubmit} className="login-form">
                <TextField
                    type="username"
                    label="Username"
                    variant="filled"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    type="password"
                    label="Password"
                    variant="filled"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Box display="flex" alignItems="center">
                    <Checkbox
                        checked={keepMeSignedIn}
                        onChange={handleCheckboxChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <Typography variant="body2">Keep Me Signed In</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ padding: '10px 20px', m: 1, fontSize: '13px' }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleRegister}
                        sx={{ padding: '10px 20px', m: 1, fontSize: '13px' }}
                        className="register-button"
                    >
                        Sign Up
                    </Button>
                </Box>
                <Button
                    variant="text"
                    onClick={handleForgotPassword}
                    sx={{ m: 1, fontSize: '13px' }}
                    className="forgot-password-button"
                >
                    Forgot Password?
                </Button>
            </form>
        </div>
    );
};


export default NewLogin;
