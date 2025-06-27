import React, { useState } from "react";
import adminSchema from "./adminSchema";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

import Snackbar from "@mui/material/Snackbar";

import {
    FormControl,
    InputLabel,
    Button,
    Select,
    MenuItem,
    Typography,
    Paper,
    Box,
    TextField,
    FormHelperText,
    IconButton,
    InputAdornment,
    LinearProgress,
} from "@mui/material";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Adminlogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const navigate = useNavigate();

    const openAlert = (status, message) => {
        setStatus(status);
        setErrorMessage(message);
        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };
    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        adminSchema
            .validate({ email, password }, { abortEarly: false })
            .then(() => {
                setIsLoading(true);
                setProgressMessage("Validating credentials");
                axios
                    .post(process.env.REACT_APP_DEV_API_URL + "/auth/login", {
                        email,
                        password,
                        role: "admin",
                    })
                    .then((response) => {
                        setIsLoading(false);
                        setShowOtp(true);
                        // setOtp(response.data.data.otp);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        openAlert("error", error.response.data.message);
                    });
            })
            .catch((validationErrors) => {
                const validationErrorMap = {};
                validationErrors.inner.forEach((error) => {
                    validationErrorMap[error.path] = error.message;
                });
                setErrors(validationErrorMap);
            });
    };

    const handleVerifyLogin = () => {
        setIsLoading(true);
        setProgressMessage("Verifying OTP");
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/auth/verify-login", {
                email,
                role: "admin",
                otp,
            })
            .then((response) => {
                openAlert("success", response.data.message);
                Cookies.set("token", response.data.data.token);
                Cookies.set("role", response.data.data.role);
                Cookies.set("email", response.data.data.email);
                Cookies.set("id", response.data.data.id);

                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/admin/products");
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                openAlert("error", err.response.data.message);
                // console.log(err);
            });
    };

    return (
        <div className='box admin-login'>
            <Snackbar
                open={isAlertOpen}
                autoHideDuration={2000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert variant='filled' severity={status} onClose={closeAlert}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Paper className='loginBox' elevation={5}>
                {isLoading && (
                    <Box
                        p={3}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ width: "100%" }}>
                            <LinearProgress />
                        </Box>
                        {progressMessage}... please wait!
                    </Box>
                )}
                {!isLoading && (
                    <>
                        {!showOtp && (
                            <div id='signin'>
                                <Box p={3}>
                                    <Typography variant='h5'>Sign in | Administrator</Typography> <br />
                                    <TextField
                                        required
                                        fullWidth
                                        type='email'
                                        value={email}
                                        id='outlined-email'
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        onChange={handleEmailChange}
                                        placeholder='Enter email address'
                                    />{" "}
                                    <br /> <br />
                                    <TextField
                                        required
                                        fullWidth
                                        value={password}
                                        id='outlined-password'
                                        placeholder='Enter password'
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        onChange={handlePasswordChange}
                                        type={showPassword ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <>
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label='toggle password visibility'
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge='end'
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                </>
                                            ),
                                        }}
                                    />
                                    <br />
                                    {/* <Typography variant='body2' fontWeight={550}>
                                        <Link style={{ textDecoration: "none" }} to='/forgot-password?role=customer' underline='none'>
                                            Forgot Password
                                        </Link>
                                    </Typography> */}
                                    <br />
                                    <Button fullWidth sx={{ backgroundColor: "#f7ca00", color: "black" }} variant='outlined' onClick={handleLogin}>
                                        Login as admin
                                    </Button>
                                    <br />
                                    {/* <Typography variant='body2' fontWeight={550}>
                                        <br />
                                        <Link style={{ textDecoration: "none" }} to='/dealer-signin' underline='none'>
                                            Dealership{" "}
                                        </Link>
                                        login
                                    </Typography> */}
                                </Box>
                            </div>
                        )}
                        {showOtp && (
                            <div id='otp'>
                                <Box p={3}>
                                    <Typography variant='h5'>Authentication required</Typography>
                                    <br />
                                    {email && (
                                        <>
                                            <Typography variant='body2'>
                                                {email}{" "}
                                                <Link style={{ textDecoration: "none" }} onClick={() => setShowOtp(false)}>
                                                    Change
                                                </Link>
                                            </Typography>
                                            <br />
                                        </>
                                    )}
                                    <Typography variant='body2'>
                                        We’ve sent a One Time Password (OTP) to the above email. Please enter it to complete verification{" "}
                                    </Typography>
                                    <br />
                                    <TextField
                                        required
                                        fullWidth
                                        type='otp'
                                        value={otp}
                                        id='outlined-otp'
                                        error={!!errors.otp}
                                        helperText={errors.otp}
                                        onChange={handleOtpChange}
                                        placeholder='Enter OTP'
                                    />
                                    <br />
                                    <br />

                                    <Button disabled={!otp} fullWidth sx={{ backgroundColor: "#f7ca00", color: "black" }} onClick={handleVerifyLogin}>
                                        continue
                                    </Button>
                                </Box>
                            </div>
                        )}
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Adminlogin;
