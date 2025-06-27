import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
    Box,
    IconButton,
    LinearProgress,
    Snackbar,
    Modal,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Tooltip,
    ButtonGroup,
    Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export default function Products() {
    const [products, setProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [product, setProduct] = React.useState({});
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [progressMessage, setProgressMessage] = useState("Getting products");
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (product) => {
        setOpen(true);
        setProduct(product);
    };

    const handleClose = () => setOpen(false);

    const handleCategoryChange = (e) => {
        setCategory(e);
        let filtered = products.filter((product) => product.category === e);
        setFilteredProducts(filtered);
    };

    const navigate = useNavigate();

    const openAlert = (status, message) => {
        setStatus(status);
        setErrorMessage(message);
        setIsAlertOpen(true);
    };

    const closeAlert = () => setIsAlertOpen(false);
    const reset = () => {
        setCategory("");
        setFilteredProducts(products);
    };
    useEffect(() => {
        let token = Cookies.get("token");
        let id = Cookies.get("id");
        console.log(token);
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/product/byDealer/" + id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setProducts(res.data.data.products);
                setFilteredProducts(res.data.data.products);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
                openAlert("error", err.response.data.message);
                if (err.response.data.login) {
                    Cookies.remove("token");
                    Cookies.remove("email");
                    Cookies.remove("role");
                    setTimeout(() => {
                        openAlert("error", "redirecting to login");
                        navigate("/dealer-signin");
                    }, 3000);
                }
            });
    }, []);

    const handleEdit = (id) => {
        navigate(`/dealer/products/update?id=${id}`);
    };

    const handleDelete = (id) => {
        axios
            .delete(process.env.REACT_APP_DEV_API_URL + "/product/" + id)
            .then((res) => {
                openAlert("success", "Product deleted successfully");
                let filtered = products.filter((product) => product._id !== id);
                setProducts(filtered);
                setFilteredProducts(filtered);
                setStatus("success");
                setErrorMessage("Product deleted successfully");
                openAlert();
            })
            .catch((err) => {
                console.log(err);
                openAlert("error", err.response.data.message);
            });
    };

    return (
        <div className='products-page'>
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
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby='alert-dialog-slide-description'>
                <DialogTitle>
                    {product.brand} {product.name} | {product.category}
                </DialogTitle>
                <DialogContent>
                    {product && product.image && (
                        <div className='dialog-row'>
                            <div>
                                <img className='product-image' src={require(`../../../assets/images/${product.image}`)} alt={product.name} />
                                <Typography variant='h5' color='text.secondary'>
                                    ${product.price}
                                    <br />
                                </Typography>
                                <IconButton onClick={() => handleEdit(product._id)} color='primary'>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(product._id)} color='error'>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                            <div>
                                <DialogContentText id='alert-dialog-slide-description'>{product.description}</DialogContentText>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <div className=''>
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
                        <Box sx={{ width: "90%" }}>
                            <LinearProgress />
                        </Box>
                        {progressMessage}... please wait!
                    </Box>
                )}
                {!isLoading && (
                    <Box p={3}>
                        <Typography variant='h5'>Products list</Typography>
                        <br />
                        <div className='filters'>
                            <ButtonGroup variant='outlined'>
                                <Button onClick={() => handleCategoryChange("laptop")}>Laptop</Button>
                                <Button onClick={() => handleCategoryChange("mobile")}>Mobile</Button>
                                <Button onClick={() => handleCategoryChange("tv")}>TV</Button>
                            </ButtonGroup>
                            <Tooltip title='Reset filters'>
                                <IconButton onClick={reset}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <br />
                        {products.length === 0 && (
                            <Typography variant='h5' sx={{ textAlign: "center", marginTop: "20px" }}>
                                No products found
                            </Typography>
                        )}
                        <div className='products'>
                            {filteredProducts.length > 0 &&
                                filteredProducts.map((product) => (
                                    <Card className='product d-product' key={product._id}>
                                        <CardMedia className="p-image"
                                            onClick={() => handleClickOpen(product)}
                                            sx={{ height: 150 }}
                                            image={require(`../../../assets/images/${product.image}`)}
                                            title={product.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant='body' component='div'>
                                                {product.name} {product.category}
                                            </Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                ${product.price}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </Box>
                )}
            </div>
        </div>
    );
}
