import React, { useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";


const NewSignUp = () => {

    const genders = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
    ];

    const positions = [
        { label: "Supervisor", value: "supervisor" },
        { label: "Manager", value: "manager" },
        { label: "Worker", value: "worker" },
    ];

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        position: "",
        dateOfBirth: dayjs(),
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });

    const handleChange = (event) => {
        // console.log(event instanceof )
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dateOfBirth: date,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form Data: ", formData);
        // Add validation and form submission logic here
    };

    return (
        <div className="signup-container" align="center">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="First Name" variant="filled" name="firstName" 
                        value={formData.firstName}
                        onChange={handleChange}
                         />
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="Last Name" variant="filled" name="lastName" value={formData.lastName}
                        onChange={handleChange}
                         />
                    </Box>
                </div>

                <div>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="filled-select-gender"
                            select
                            label="Gender"
                            variant="filled"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            {genders.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="filled-select-position"
                            select
                            label="Position"
                            variant="filled"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        >
                            {positions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </div>
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                slotProps={{ textField: { variant: "filled" } }}
                                label="Date of Birth"
                                name="dateOfBirth"
                                onChange={handleDateChange}
                                value={formData.dateOfBirth}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>

                <div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '45ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="example@gmail.com" variant="filled" name="email" value={formData.email} />
                    </Box>
                </div>
                <div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '45ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="Password" variant="filled" name="password" value={formData.password} />
                    </Box>
                </div>
                <div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '45ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="Confirm Password" variant="filled" name="confirmPassword" value={formData.confirmPassword} />
                    </Box>
                </div>
                <div>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '45ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="filled-basic" label="Phone Number" variant="filled" name="phoneNumber" value={formData.phoneNumber} />
                    </Box>
                </div>
                <Button
                    variant="outlined"
                    type="submit"
                    sx={{ padding: '10px 20px', fontSize: '20px' }}
                >
                    Submit
                </Button>

            </form>
        </div>
    );
};

export default NewSignUp;
