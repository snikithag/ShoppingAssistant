import "../../customer/login/login.css";
import React, { useState } from "react";
import loginSchema from "../../customer/login/loginSchema";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
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

const DealerLogin = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const navigate = useNavigate();

    const openAlert = (status, message) => {
        setStatus(status);
        setErrorMessage(message);
        setIsAlertOpen(true);
    };
    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
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

    const handleRegister = () => {
        navigate("/dealer-signup");
    };

    const handleLogin = () => {
        loginSchema
            .validate({ email, password }, { abortEarly: false })
            .then(() => {
                setIsLoading(true);
                setProgressMessage("Validating credentials");

                axios
                    .post(process.env.REACT_APP_DEV_API_URL + "/auth/login", {
                        email,
                        password,
                        role: "dealer",
                    })
                    .then((response) => {
                        setIsLoading(false);
                        setShowOtp(true);
                        // setOtp(response.data.data.otp);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error("Login error:", error.response.data);
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
                role: "dealer",
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
                    navigate("/dealer/products");
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
        <div className='box dealer-login-box'>
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
                            <>
                                <Box p={3}>
                                    <Typography variant='h5'>Sign in with dealer credentials</Typography> <br />
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
                                        placeholder='Enter your password'
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
                                    <br />
                                    <Button fullWidth color='primary' variant='contained' onClick={handleLogin}>
                                        Sign in
                                    </Button>
                                    <br />
                                    <Typography variant='body2' fontWeight={550}>
                                        <br />
                                        <Link style={{ textDecoration: "none" }} to='/signin' underline='none'>
                                            Customer{" "}
                                        </Link>
                                        login
                                    </Typography>
                                </Box>
                                <Box p={3}>
                                    <Typography variant='body2'>
                                        <Divider>New to Dealership?</Divider>
                                        <br />
                                        <Button fullWidth color='inherit' variant='contained' onClick={handleRegister}>
                                            Create your dealer account
                                        </Button>
                                    </Typography>
                                </Box>
                            </>
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

export default DealerLogin;
