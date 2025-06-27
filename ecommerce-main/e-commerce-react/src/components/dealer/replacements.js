import { LoadingButton } from "@mui/lab";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    LinearProgress,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import Chip from "@mui/material/Chip";

export default function Replacements() {
    const [requests, setRequests] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDealers, setPendingDealers] = React.useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const openAlert = (status, message) => {
        setStatus(status);
        setErrorMessage(message);
        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
    };

    const handleApproveDealer = (id) => {
        setId(id);
        setIsApproved(true);
        console.log(id);
        axios
            .put(process.env.REACT_APP_DEV_API_URL + "/replacement/" + id + "/replaced")
            .then((res) => {
                console.log(res);
                openAlert("success", res.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                openAlert("error", err.response.data.message);
            });
    };

    const handleRejectDealer = (id) => {
        setId(id);
        setIsRejected(true);
        console.log(id);
        axios
            .put(process.env.REACT_APP_DEV_API_URL + "/replacement/" + id + "/rejected")
            .then((res) => {
                console.log(res);
                openAlert("success", res.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                openAlert("error", err.response.data.message);
            });
    };

    const columns = [
        { id: "owner", label: "#Order", minWidth: 170 },
        { id: "username", label: "Username", minWidth: 170 },
        { id: "merchandise", label: "Product", minWidth: 170 },
        { id: "email", label: "Reason for replacement", minWidth: 170 },
        { id: "email", label: "Status", minWidth: 170 },
    ];

    useEffect(() => {
        let id = Cookies.get("id");
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/replacement/" + id)
            .then((res) => {
                console.log(res);
                setIsLoading(false);
                setRequests(res.data.data);
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
                    {errorMessage}
                </Alert>
            </Snackbar>
            {isLoading && (
                <Box
                    p={5}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                    }}
                >
                    <Box sx={{ width: "100%" }}>
                        <LinearProgress />
                    </Box>
                    Getting replacements list... please wait!
                </Box>
            )}

            {!isLoading && (
                <Paper sx={{ width: "100%", overflow: "hidden" }} className='orders-page'>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
                                    return (
                                        <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                                            <TableCell>{row._id}</TableCell>
                                            <TableCell>{row.userId.username}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                                                    <img src={require(`../../assets/images/${row.productId.image}`)} width='50' height='50' />
                                                    <Typography variant='body' sx={{ fontWeight: "bold" }}>
                                                        {row.productId.name} {row.productId.category}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.reason}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    color={row.status == "pending" ? "warning" : row.status == "replaced" ? "success" : "error"}
                                                    label={row.status}
                                                    variant='outlined'
                                                />
                                            </TableCell>
                                            {row.status == "pending" && (
                                                <TableCell>
                                                    <ButtonGroup variant='outlined'>
                                                        {!isApproved && (
                                                            <Button onClick={() => handleApproveDealer(row._id)} color='success'>
                                                                Replace
                                                            </Button>
                                                        )}
                                                        {isApproved && id == row._id && (
                                                            <LoadingButton loading loadingPosition='start' color='success' startIcon={<SaveIcon />}>
                                                                approving
                                                            </LoadingButton>
                                                        )}
                                                        {!isRejected && (
                                                            <Button onClick={() => handleRejectDealer(row._id)} color='error'>
                                                                Reject
                                                            </Button>
                                                        )}
                                                        {isRejected && id == row._id && (
                                                            <LoadingButton loading loadingPosition='start' color='error' startIcon={<SaveIcon />}>
                                                                rejecting
                                                            </LoadingButton>
                                                        )}
                                                    </ButtonGroup>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component='div'
                        count={pendingDealers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </div>
    );
}
