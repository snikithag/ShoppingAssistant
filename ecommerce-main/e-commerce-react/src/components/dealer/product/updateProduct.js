import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import productSchema from "./productSchema";
import { useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
    const [product, setProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("");
    const [dealer, setDealer] = useState("");

    const [imageSrc, setImageSrc] = useState("");
    const navigate = useNavigate();
    const openAlert = () => {
        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Assuming only one file is selected
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more allowed types if needed
        if (file && !allowedTypes.includes(file.type)) {
            // Check if file type is allowed
            setError("File type is not allowed. Please select an image file (JPEG, PNG, GIF).");
            setFile(null);
        } else {
            setError(null);
            setFile(file);
            const image = require(`../../../assets/images/${file.name}`);
            console.log(image);
            console.log(file.name);
            setImageSrc(image);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file != null) product.image = file.name;
        console.log(product);
        productSchema
            .validate(product, { abortEarly: false })
            .then(() => {
                setIsLoading(true);
                setProgressMessage("Updating product details");
                axios
                    .put(process.env.REACT_APP_DEV_API_URL + "/product/" + product._id, product)
                    .then((res) => {
                        console.log(res);
                        setIsLoading(false);
                        setStatus("success");
                        setStatusMessage("Product updated successfully!");
                        openAlert();
                        setTimeout(() => {
                            navigate("/dealer/products")
                        }, 2000);
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        setStatus("error");
                        setStatusMessage("Failed to update product.");
                        openAlert();
                    });
            })
            .catch((validationErrors) => {
                const validationErrorMap = {};
                validationErrors.inner.forEach((error) => {
                    validationErrorMap[error.path] = error.message;
                });
                console.log(validationErrors);
                setErrors(validationErrorMap);
            });
    };

    useEffect(() => {
        let id = new URLSearchParams(window.location.search).get("id");
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/product/" + id)
            .then((res) => {
                console.log(res);
                setProduct(res.data.data.product);
                setImageSrc(require(`../../../assets/images/${res.data.data.product.image}`));
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div className='orders-page'>
            <Snackbar
                open={isAlertOpen}
                autoHideDuration={2000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert variant='filled' severity={status} onClose={closeAlert}>
                    {statusMessage}
                </Alert>
            </Snackbar>
            <div className='product-form ' elevation={5}>
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
                    <Box p={3}>
                        <Typography variant='h5'>Update product details</Typography>
                        <Divider></Divider>
                        <br />
                        {product && (
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <TextField variant='outlined' name='name' value={"Merchandise: " + product.brand} fullWidth disabled />
                                    <TextField variant='outlined' name='name' value={"Category: " + product.category} fullWidth disabled />
                                </div>
                                <br />
                                <div className='row'>
                                    <TextField
                                        label='Name'
                                        placeholder='Product name'
                                        variant='outlined'
                                        name='name'
                                        value={product.name}
                                        onChange={handleChange}
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />
                                    <TextField
                                        label='Price'
                                        placeholder='Unit price'
                                        variant='outlined'
                                        name='price'
                                        value={product.price}
                                        onChange={handleChange}
                                        fullWidth
                                        error={!!errors.price}
                                        helperText={errors.price}
                                    />
                                </div>
                                <br />
                                <div className='row'>
                                    <TextField
                                        label='Description'
                                        placeholder='Product description'
                                        variant='outlined'
                                        name='description'
                                        value={product.description}
                                        onChange={handleChange}
                                        fullWidth
                                        error={!!errors.description}
                                        helperText={errors.description}
                                    />
                                </div>
                                <br />
                                <div className='row'>
                                    <div>
                                        <input type='file' onChange={handleFileChange} accept='image/*' />
                                        {error && <div style={{ color: "red" }}>{error}</div>}
                                    </div>
                                </div>
                                <br />
                                <div>{imageSrc && <img src={imageSrc} alt='Preview' style={{ maxWidth: "30%" }} />}</div>
                                <br />

                                <Button fullWidth type='submit' variant='contained' color='primary'>
                                    Update product
                                </Button>
                            </form>
                        )}
                    </Box>
                )}
            </div>
        </div>
    );
}
