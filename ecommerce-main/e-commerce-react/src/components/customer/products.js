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
import Carousel from "react-bootstrap/Carousel";
import laptopImg from "../../assets/images/laptops1.jpg";
import mobileImg from "../../assets/images/mobiles1.jpg";
import tvImg from "../../assets/images/tvs1.jpg";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export default function Products() {
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = React.useState([]);
    const [popular, setPopular] = React.useState([]);
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

    const handleAdd = () => {
        if (quantity < 5) setQuantity(quantity + 1);
        else {
            setQuantity(5);
        }
    };

    const handleRemove = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            setQuantity(1);
        }
    };

    const handleAddtoCart = () => {
        let token = Cookies.get("token");
        let id = Cookies.get("id");

        axios
            .post(
                process.env.REACT_APP_DEV_API_URL + "/cart",
                {
                    userId: id,
                    productId: product._id,
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                openAlert("success", "Product added to cart");
                setOpen(false);
                setQuantity(1);
            })
            .catch((err) => {
                console.log(err);
                openAlert("error", err.response.data.message);
                if (err.response.data.login) {
                    Cookies.remove("token");
                    Cookies.remove("email");
                    Cookies.remove("role");
                    setTimeout(() => {
                        openAlert("error", "redirecting to login");
                        navigate("/signin");
                    }, 3000);
                }
            });
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
        console.log(token);
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/product", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data.data);
                setProducts(res.data.data.products);
                setPopular(res.data.data.popularProducts);
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
                        navigate("/signin");
                    }, 3000);
                }
            });
    }, []);

    const handleEdit = (id) => {
        navigate(`/dealer/products/update?id=${id}`);
    };

    return (
        <div>
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
                                <img className='product-image' src={require(`../../assets/images/${product.image}`)} alt={product.name} />
                                <Typography variant='h5' color='text.secondary'>
                                    ${product.price}
                                    <br />
                                </Typography>
                                <Typography variant='body'>
                                    <ButtonGroup aria-label='outlined primary button group'>
                                        <Button onClick={handleRemove} variant='outlined'>
                                            <RemoveIcon />
                                        </Button>
                                        <Button>{quantity}</Button>
                                        <Button onClick={handleAdd} variant='outlined'>
                                            <AddIcon />
                                        </Button>
                                    </ButtonGroup>
                                    <br />
                                    <br />
                                </Typography>
                                <Button fullWidth onClick={handleAddtoCart} color='primary' startIcon={<AddShoppingCartIcon />} variant='contained'>
                                    Add to cart
                                </Button>
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
            <div className='products-page'>
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
                <Carousel fade>
                    <Carousel.Item interval={1500}>
                        <img className='cimage d-block w-100' src={laptopImg} alt='Image One' />
                        <Carousel.Caption>
                            <p>Laptops</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                        <img className='cimage d-block w-100' src={mobileImg} alt='Image Two' />
                        <Carousel.Caption>
                            <p>Mobile phones</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={1000}>
                        <img className='cimage d-block w-100' src={tvImg} alt='Image Two' />
                        <Carousel.Caption>
                            <p>Televisions</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <br />
                {!isLoading && (
                    <Box p={3}>
                        <br />
                        <Typography variant='h5'>Recommended products</Typography>
                        <br />
                        <div className='products popular'>
                            {popular &&
                                popular.length > 0 &&
                                popular.map((product) => (
                                    <Card className='product' key={product._id}>
                                        {/* {product._id} */}
                                        <CardMedia
                                            className='p-image'
                                            onClick={() => handleClickOpen(product)}
                                            sx={{ height: 150 }}
                                            image={require(`../../assets/images/${product.image}`)}
                                            title={product.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant='body' sx={{ fontWeight: "bold" }} component='div'>
                                                {product.name} {product.category}
                                            </Typography>
                                            <Typography variant='body' color='text.secondary'>
                                                ${product.price}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}

                            {popular.length === 0 && <Typography variant='h6'>Start placing orders and get suggestions for recommended products</Typography>}
                        </div>{" "}
                        <br />
                        <Typography variant='h5'>List of our products</Typography>
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
                        <div className='products'>
                            {filteredProducts.length > 0 &&
                                filteredProducts.map((product) => (
                                    <Card className='product' key={product._id}>
                                        {/* {product._id} */}
                                        <CardMedia
                                            onClick={() => handleClickOpen(product)}
                                            sx={{ height: 150 }}
                                            image={require(`../../assets/images/${product.image}`)}
                                            title={product.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant='body' sx={{ fontWeight: "bold" }} component='div'>
                                                {product.name} {product.category}
                                            </Typography>
                                            <Typography variant='body' color='text.secondary'>
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
