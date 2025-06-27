import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Button, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import headerImg from "../../assets/images/header.jpg";

import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddProductImg from "../../assets/images/icons/box.png";
import ProductsImg from "../../assets/images/icons/products.png";
import ReplaceImg from "../../assets/images/icons/replacement.png";
import PendingImg from "../../assets/images/icons/pending.png";
import DealerImg from "../../assets/images/icons/dealer.png";
import Footer from "../footer/footer";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function MiniDrawer() {
    const theme = useTheme();
    const [role, setRole] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const navigate = useNavigate();

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    React.useEffect(() => {
        let role = Cookies.get("role");
        setRole(role);
    });

    const handleLogout = () => {
        Cookies.remove("role");
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("id");
        navigate("/");
    };

    const handleCart = () => navigate("/home/cart");

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position='fixed' open={open} className='header'>
                <Toolbar>
                    {role != "customer" && (
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            edge='start'
                            sx={{
                                marginRight: 5,
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
                        <IconButton onClick={() => navigate("/home/products")}>
                            <HomeIcon color='secondary' />
                        </IconButton>
                        e-Corp
                    </Typography>
                    {role == "customer" && (
                        <>
                            <Button startIcon={<LocalShippingIcon />} color='inherit' onClick={() => navigate("/home/orders")}>
                                Orders
                            </Button>
                            <Button startIcon={<ShoppingCart />} color='inherit' onClick={handleCart}>
                                Cart
                            </Button>
                        </>
                    )}

                    <IconButton color='inherit' onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {role != "customer" && (
                <Drawer variant='permanent' open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} component='nav' aria-labelledby='nested-list-subheader'>
                        {role == "admin" && (
                            <>
                                <Tooltip title='Authorization' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 2}
                                        component={Link}
                                        to='dealer-authorizations'
                                        onClick={(event) => handleListItemClick(event, 2)}
                                    >
                                        <ListItemIcon>
                                            <img src={PendingImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Authorization' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                                <Tooltip title='Dealers' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 7}
                                        component={Link}
                                        to='dealers'
                                        onClick={(event) => handleListItemClick(event, 7)}
                                    >
                                        <ListItemIcon>
                                            <img src={DealerImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Dealers' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                                <Tooltip title='Products' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 5}
                                        component={Link}
                                        to='products'
                                        onClick={(event) => handleListItemClick(event, 5)}
                                    >
                                        <ListItemIcon>
                                            <img src={ProductsImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Products' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                            </>
                        )}
                        {role == "dealer" && (
                            <>
                                <Tooltip title='Add product' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 4}
                                        component={Link}
                                        to='product/add'
                                        onClick={(event) => handleListItemClick(event, 4)}
                                    >
                                        <ListItemIcon>
                                            <img src={AddProductImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Add product' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                                <Tooltip title='Products' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 5}
                                        component={Link}
                                        to='products'
                                        onClick={(event) => handleListItemClick(event, 5)}
                                    >
                                        <ListItemIcon>
                                            <img src={ProductsImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Products' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                                <Tooltip title='Replacements' arrow placement='right'>
                                    <ListItemButton
                                        selected={selectedIndex === 6}
                                        component={Link}
                                        to='replacements'
                                        onClick={(event) => handleListItemClick(event, 6)}
                                    >
                                        <ListItemIcon>
                                            <img src={ReplaceImg} width={30} />
                                        </ListItemIcon>
                                        <ListItemText primary='Replacements' color='success' />
                                    </ListItemButton>
                                </Tooltip>
                            </>
                        )}
                        <Divider />
                    </List>
                </Drawer>
            )}
            <Box component='div' className='outlet' sx={{ flexGrow: 1 }}>
                <DrawerHeader />
                <div className="outlet-w">

                <Outlet />
                </div>
                <Footer/>
            </Box>
        </Box>
    );
}
