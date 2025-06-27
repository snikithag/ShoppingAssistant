import { Alert, Box, Button, ButtonGroup, LinearProgress, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";

export default function Authorization() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDealers, setPendingDealers] = React.useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
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

    const columns = [
        { id: "owner", label: "Owner name", minWidth: 170 },
        { id: "merchandise", label: "Merchandise name", minWidth: 170 },
        { id: "email", label: "Email", minWidth: 170 },
        { id: "mobile", label: "Mobile", minWidth: 170 },
        { id: "address", label: "Address", minWidth: 170 },
    ];

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_DEV_API_URL + "/dealer/pending")
            .then((res) => {
                console.log(res);
                setIsLoading(false);
                setPendingDealers(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleApproveDealer = (id) => {
        setIsApproved(true);
        console.log(id);
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/dealer/approve/" + id)
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
        setIsRejected(true);
        console.log(id);
        axios
            .post(process.env.REACT_APP_DEV_API_URL + "/dealer/reject/" + id)
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

    return (
        <div>
            <Snackbar
                open={isAlertOpen}
                autoHideDuration={2000}
                onClose={closeAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
                    Getting dealer list... please wait!
                </Box>
            )}

            {!isLoading && (
                <Paper className='pending-auth'>
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
                                {pendingDealers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => {
                                    return (
                                        <TableRow hover role='checkbox' tabIndex={-1} key={id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <ButtonGroup variant='outlined'>
                                                    {!isApproved && (
                                                        <Button onClick={() => handleApproveDealer(row._id)} color='success'>
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {isApproved && (
                                                        <LoadingButton loading loadingPosition='start' color='success' startIcon={<SaveIcon />}>
                                                            approving
                                                        </LoadingButton>
                                                    )}
                                                    {!isRejected && (
                                                        <Button onClick={() => handleRejectDealer(row._id)} color='error'>
                                                            Reject
                                                        </Button>
                                                    )}
                                                    {isRejected && (
                                                        <LoadingButton loading loadingPosition='start' color='error' startIcon={<SaveIcon />}>
                                                            rejecting
                                                        </LoadingButton>
                                                    )}
                                                </ButtonGroup>
                                            </TableCell>
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
