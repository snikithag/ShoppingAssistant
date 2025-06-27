import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Alert, Box, Button, Chip, Divider, IconButton, LinearProgress, Paper, Snackbar, TextField, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import LaunchIcon from "@mui/icons-material/Launch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export default function Orders() {
    const [orders, setOrders] = React.useState([]);
    const [order, setOrder] = React.useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [reason, setReason] = useState("");
    const [showReason, setShowReason] = useState(false);
    const [showId, setShowId] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [progressMessage, setProgressMessage] = useState("");


    const openAlert = (status, message) => {
        setIsAlertOpen(status);
        setStatus(status)
        setStatusMessage(message);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };

    const handleClickOpen = (order) => {
        setOpen(true);
        setOrder(order);
    };

    function ccyFormat(num) {
        num = Number(num);
        return `${num.toFixed(2)}`;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
        setShowReason(false);
    }

    const handleShowReplace = (id) => {
        console.log(id);
        setShowReason(true);
        setShowId(id);
    };

    const handleReplace = (product) => {
        console.log(product, reason);
        let id = Cookies.get("id");
        let data = {
            orderId: order.orderId,
            userId: id,
            ownerId: product.product.owner,
            productId: product.product._id,
            reason,
        };
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/replacement", data)
            .then((res) => {
                setOpen(false)
                console.log(res);
                setShowReason(false);
                setReason("");
                openAlert("success", "Replacement request raised");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setShowReason(false);
                setReason("");
                openAlert("error", err.response.data.message);
            });
    };

    useEffect(() => {
        const id = Cookies.get("id");
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/order/" + id)
            .then((res) => {
                console.log(res);
                setIsLoading(false);
                setOrders(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
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
                    {statusMessage}
                </Alert>
            </Snackbar>
            <Dialog
                className='dialog-order'
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby='alert-dialog-slide-description'
            >
                <DialogTitle>
                    Order#: {order._id}
                    <Typography variant='body2'>Order date: {new Date(order.createdAt).toLocaleString()}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body'>Product details</Typography>
                    {order &&
                        order.products &&
                        order.products.map((product) => {
                            return (
                                <>
                                    <Box border={1} borderColor='#ccc' p={1} key={product.id} sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                        <img src={require(`../../assets/images/${product.product.image}`)} alt={product.product.name} width='50' height='50' />
                                        <div style={{flexGrow: 1}}>
                                            <Typography variant='body' sx={{ fontWeight: "bold" }}>
                                                {product.product.name} {product.product.category}
                                            </Typography>
                                            <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                                <Typography variant='body2'>$ {product.product.price}</Typography>
                                                <Typography variant='body2'>Qty: {product.quantity}</Typography>
                                            </Box>
                                        </div>
                                        <div>
                                            {
                                                product.status == "Ordered" &&
                                            <Chip color='success' label={product.status} variant='outlined' />
                                            }
                                            {
                                                product.status == "replaced" &&
                                            <Chip color='secondary' label={product.status} variant='outlined' />
                                            }
                                            {
                                                product.status == "rejected" &&
                                            <Chip color='error' label={product.status} variant='outlined' />
                                            }
                                            {
                                                product.status == "pending" &&
                                            <Chip color='warning' label='In progress' variant='outlined' />
                                            }
                                        </div>
                                    </Box>
                                    {product.status == "Ordered" && (
                                        <Link style={{ textDecoration: "none" }} onClick={() => handleShowReplace(product._id)}>
                                            Replace
                                        </Link>
                                    )}
                                    <br />
                                    {showReason && showId == product._id && (
                                        <>
                                            <TextField
                                                onChange={(e) => setReason(e.target.value)}
                                                fullWidth
                                                type='text'
                                                placeholder='Reason for replacement'
                                            ></TextField>
                                            <br />
                                            <Button disabled={!reason} onClick={() => handleReplace(product)}>
                                                Submit request
                                            </Button>
                                        </>
                                    )}
                                    <Divider></Divider>
                                </>
                            );
                        })}
                    <br />
                    <Typography variant='body'>Order summary</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant='body2'>Subtotal</Typography>
                        <Typography variant='body2'>$ {order.subtotal}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant='body2'>Taxes</Typography>
                        <Typography variant='body2'>$ {order.taxes}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography variant='h6'>Total</Typography>
                        <Typography variant='h6'>$ {order.total}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Paper>
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
                        Getting orders... please wait!
                    </Box>
                )}
                {!isLoading && (
                    <Box p={3} className="orders-page full">
                        <div className='orders'>
                            <Typography variant='h5'>Order placed recently</Typography>
                            {/* <Paper sx={{ overflow: "hidden" }}> */}
                            <TableContainer>
                                <Table size='small' stickyHeader aria-label='sticky table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: 40 }}>#</TableCell>
                                            <TableCell sx={{ width: 60 }}>Order ID</TableCell>
                                            <TableCell sx={{ width: 140 }}>Ordered date</TableCell>
                                            <TableCell sx={{ width: 50 }}>Items</TableCell>
                                            <TableCell sx={{ width: 50 }}>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleClickOpen(row)}>
                                                            <LaunchIcon color="primary" />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{row._id}</TableCell>
                                                    <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell>{row.products.length}</TableCell>
                                                    <TableCell>$ {ccyFormat(row.total)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component='div'
                                count={orders.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            {/* </Paper> */}
                        </div>
                    </Box>
                )}
            </Paper>
        </div>
    );
}
