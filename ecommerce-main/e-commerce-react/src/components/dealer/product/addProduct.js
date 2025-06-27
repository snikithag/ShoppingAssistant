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

import axios from "axios";
import React, { useState } from "react";
import productSchema from "./productSchema";
import Cookies from "js-cookie";

export default function AddProduct() {
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
    });

    const [dealer, setDealer] = useState("");
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [imageSrc, setImageSrc] = useState("");
    const [file, setFile] = useState(null);

    // Function to handle file input change
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

    const openAlert = () => {
        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        console.log(file.name);
        e.preventDefault();
        productData.category = category;
        productData.owner = dealer._id;
        productData.brand = dealer.merchandise;
        productData.image = file.name;
        productSchema
            .validate(productData, { abortEarly: false })
            .then(() => {
                setIsLoading(true);

                console.log("Submitted data:", productData);
                axios
                    .post(process.env.REACT_APP_DEV_API_URL + "/product", productData)
                    .then((res) => {
                        setIsLoading(false);
                        setStatus("success");
                        setStatusMessage(res.data.message);
                        openAlert();
                        console.log(res);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2100);
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        setStatus("error");
                        setStatusMessage(err.response.data.message);
                        openAlert();
                        console.log(err);
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

    useState(() => {
        let email = Cookies.get("email");
        let id = Cookies.get("id");
        console.log(email);
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/dealer/" + id)
            .then((res) => {
                console.log(res.data.data);
                setDealer(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div className="orders-page">
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
                        <Typography variant='h5'>Add new product</Typography>
                        <Divider></Divider>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <TextField variant='outlined' name='name' value={"Merchandise: " + dealer.merchandise} fullWidth disabled />
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select value={category} onChange={handleCategoryChange}>
                                        <MenuItem value='laptop'>Laptop</MenuItem>
                                        <MenuItem value='mobile'>Mobile</MenuItem>
                                        <MenuItem value='tv'>TV</MenuItem>
                                    </Select>
                                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                                </FormControl>
                            </div>
                            <br />
                            <div className='row'>
                                <TextField
                                    placeholder='Product name'
                                    variant='outlined'
                                    name='name'
                                    value={productData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                                <TextField
                                    placeholder='Unit price'
                                    variant='outlined'
                                    name='price'
                                    value={productData.price}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.price}
                                    helperText={errors.price}
                                />
                            </div>
                            <br />
                            <div className='row'>
                                <TextField
                                    placeholder='Product description'
                                    variant='outlined'
                                    name='description'
                                    value={productData.description}
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
                                Add product
                            </Button>
                        </form>
                    </Box>
                )}
            </div>
        </div>
    );
}
