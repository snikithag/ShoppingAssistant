import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import signupSchema from "./signupSchema";

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
export default function Signup() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
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

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
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

    const handleRequestOtp = () => {
        setOtp("");
        signupSchema
            .validate({ username, email, password }, { abortEarly: false })
            .then(() => {
                setProgressMessage("Sending OTP to email");
                setIsLoading(true);
                axios
                    .post(process.env.REACT_APP_DEV_API_URL + "/auth/request-otp", { email, role: "customer" })
                    .then((res) => {
                        setIsLoading(false);
                        openAlert("success", res.data.message);
                        setShowOtp(true);
                        // setOtp(res.data.data.otp);
                        // console.log(res.data.data);
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        openAlert("error", err.response.data.message);
                        // console.log(err);
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

    const handleVerifyOtp = () => {
        setProgressMessage("Validating OTP");
        setIsLoading(true);
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/auth/verify-otp", { username, email, password, role: "customer", otp })
            .then((res) => {
                // console.log(res);
                setProgressMessage("Redirecting to login page");
                openAlert("success", res.data.message);
                setTimeout(() => {
                    navigate("/signin");
                }, 3000);
            })
            .catch((err) => {
                setIsLoading(false);
                // console.log(err);
                openAlert("error", err.response.data.message);
            });
    };
    return (
        <div className="customer-login-box">
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
                        <Box p={3}>
                            {!showOtp && (
                                <div id='create'>
                                    <Typography variant='h5'>Create Account</Typography> <br />
                                    <TextField
                                        required
                                        fullWidth
                                        type='text'
                                        value={username}
                                        id='outlined-username'
                                        error={!!errors.username}
                                        helperText={errors.username}
                                        onChange={handleUsernameChange}
                                        placeholder='First and last name'
                                    />
                                    <br /> <br />
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
                                    />
                                    <br /> <br />
                                    <TextField
                                        required
                                        fullWidth
                                        value={password}
                                        id='outlined-password'
                                        placeholder='At least 6 characters'
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
                                    <Typography variant='body2'>To verify your email, we will send you a text message with a temporary code.</Typography>
                                    <br />
                                    <Button fullWidth sx={{ backgroundColor: "#f7ca00", color: "black" }} variant='outlined' onClick={handleRequestOtp}>
                                        Verify email
                                    </Button>
                                    <br />
                                </div>
                            )}
                            {showOtp && (
                                <div id='verify'>
                                    <Typography variant='h5'>Verify OTP</Typography> <br />
                                    <TextField
                                        required
                                        fullWidth
                                        type='number'
                                        label='One Time Password'
                                        value={otp}
                                        id='outlined-otp'
                                        error={!!errors.otp}
                                        helperText={errors.otp}
                                        onChange={handleOtpChange}
                                        placeholder='6 digit OTP'
                                    />
                                    <br />
                                    <br />
                                    <Button
                                        disabled={!otp}
                                        fullWidth
                                        sx={{ backgroundColor: "#f7ca00", color: "black" }}
                                        variant='outlined'
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify OTP
                                    </Button>
                                </div>
                            )}
                            <br />
                            {!showOtp && (
                                <>
                                    <Typography variant='body2'>
                                        <br />
                                        Already have an account?{" "}
                                        <Link style={{ textDecoration: "none" }} to='/signin' underline='none'>
                                            Sign in
                                        </Link>
                                    </Typography>
                                    <Typography variant='body2'>
                                        Do business?{" "}
                                        <Link style={{ textDecoration: "none" }} to='/dealer-signup' underline='none'>
                                            Create a dealership account
                                        </Link>
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    );
}
