import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Divider from "@mui/material/Divider";
import * as yup from "yup";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { emailSchema } from "../dealer/registration/dealerSignupSchema";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const [otp, setOtp] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const navigate = useNavigate();

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

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

    const handleGetOtp = () => {
        let role = new URLSearchParams(window.location.search).get("role");
        setRole(role);
        emailSchema
            .validate({ email }, { abortEarly: false })
            .then(() => {
                setIsLoading(true);
                setProgressMessage("Sending OTP to mail");
                axios
                    .post(process.env.REACT_APP_DEV_API_URL + "/auth/forgot-password-otp", {
                        email,
                        role,
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

    const handleVerifyOtp = () => {
        setIsLoading(true);
        setProgressMessage("Verifying OTP");
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/auth/verify-reset-otp", {
                email,
                role,
                otp,
            })
            .then((response) => {
                openAlert("success", response.data.message);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/reset-password?role=" + role + "&email=" + email);
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
        <div className='box'>
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
                                    <Typography variant='h5'>Password Assistance</Typography> <br />
                                    <Typography variant='body2'>Enter the email address associated with your account.</Typography> <br />
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
                                    <Button fullWidth sx={{ backgroundColor: "#f7ca00", color: "black" }} variant='outlined' onClick={handleGetOtp}>
                                        continue
                                    </Button>
                                </Box>
                            </div>
                        )}
                        {showOtp && (
                            <div id='otp'>
                                <Box p={3}>
                                    <Typography variant='h5'>Authentication required</Typography>
                                    {email && (
                                        <>
                                            <Typography variant='body2'>
                                                {email}{" "}
                                                <Button style={{ textDecoration: "none" }} onClick={() => setShowOtp(false)}>
                                                    Change
                                                </Button>
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

                                    <Button disabled={!otp} fullWidth sx={{ backgroundColor: "#f7ca00", color: "black" }} onClick={handleVerifyOtp}>
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

export default ForgotPassword;
