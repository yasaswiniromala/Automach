import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import axios from 'axios';
import "./Login.css";

const NewLogin = ({ setIsLoggedIn, setUserDetails }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/login', { email: username, password });

            if (response.status === 200) {
                const userDetails = response.data; // Stores the data in userDetails and this essential to pass the user details as props 
                setUserDetails(userDetails); // pass the userDetails to app component and it will update user details 
                setMessage("Successfully Logged in 😀");
                setOpen(true);
                setIsLoggedIn(true);
                setTimeout(() => navigate("/"), 1500); // Navigate after 1.5 seconds
            } else {
                setMessage("Login Failed !!! 😡");
                setOpen(true);
            }
        } catch (error) {
            setMessage("Login Failed !!! 😡");
            setOpen(true);
        }
    };

    const handleRegister = () => {
        navigate("/signup");
    };

    const handleForgotPassword = () => {
        alert("Navigate to forget password page");
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="login-container">
            <div className="header">
                <h2>Welcome Back <span>👋</span></h2>
                <p>Let’s explore the app again with us.</p>
            </div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="keepMeSignedIn"
                            checked={keepMeSignedIn}
                            onChange={handleCheckboxChange}
                        />
                        Keep Me Signed In
                    </label>
                </div>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="login-button"
                >
                    Login
                </Button>
                <br />
                <Button
                    type="button"
                    onClick={handleForgotPassword}
                    color="secondary"
                    className="forgot-password-button"
                >
                    Forgot Password?
                </Button>
            </form>
            <Button
                onClick={handleRegister}
                color="primary"
                className="register-button"
            >
                Register
            </Button>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                
                action={
                    <Button color="inherit" size="small" onClick={handleClose}>
                        Close
                    </Button>
                }
            />
        </div>
    );
};

export default NewLogin;
