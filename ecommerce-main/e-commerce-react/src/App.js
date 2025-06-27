import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/customer/login/login";
import Signup from "./components/customer/registration/signup";
import DealerLogin from "./components/dealer/login/dealerLogin";
import DealerSignup from "./components/dealer/registration/dealerSignup";
import ForgotPassword from "./components/forgot-password/forgotPassword";
import ResetPassword from "./components/forgot-password/resetPassword";
import Adminlogin from "./components/admin/adminlogin";
import AdminDashboard from "./components/admin/adminDashboard";
import AdminHome from "./components/admin/adminHome";
import Authorization from "./components/admin/authorization";
import DealerDashboard from "./components/dealer/dealerDashboard";
import AddProduct from "./components/dealer/product/addProduct";
import Products from "./components/dealer/product/products";
import CustomerProducts from "./components/customer/products";
import UpdateProduct from "./components/dealer/product/updateProduct";
import Cart from "./components/customer/cart";
import Orders from "./components/customer/orders";
import Replacements from "./components/dealer/replacements";
import Dealers from "./components/admin/dealers";
import AllProducts from "./components/admin/allProducts";

function App() {
    const initialOptions = {
        clientId: "ARedUEMY0YDnsdzj_puxV-uyX6Jy6TTa12d5D23iji6d-0ykzW7I-Cmckp3pJ2fLjtIwe_k_GX09uepg",
        currency: "USD",
        intent: "capture",
        "disable-funding": "card",
    };
    return (
        <PayPalScriptProvider options={initialOptions}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='signin' />} />
                    <Route path='signin' element={<Login />} />
                    <Route path='al' element={<Adminlogin />} />
                    <Route path='admin' element={<AdminHome />}>
                        <Route path='dashboard' element={<AdminDashboard />} />
                        <Route path='dealer-authorizations' element={<Authorization />} />
                        <Route path='dealers' element={<Dealers />} />
                        <Route path='products' element={<AllProducts />} />
                    </Route>
                    <Route path='dealer' element={<AdminHome />}>
                        <Route path='dashboard' element={<DealerDashboard />} />
                        <Route path='product/add' element={<AddProduct />} />
                        <Route path='products' element={<Products />} />
                        <Route path='products/update' element={<UpdateProduct />} />
                        <Route path='replacements' element={<Replacements />} />
                    </Route>
                    <Route path='home' element={<AdminHome />}>
                        <Route path='products' element={<CustomerProducts />} />
                        <Route path='cart' element={<Cart />} />
                        <Route path='orders' element={<Orders />} />
                    </Route>
                    <Route path='register' element={<Signup />} />
                    <Route path='dealer-signin' element={<DealerLogin />} />
                    <Route path='dealer-signup' element={<DealerSignup />} />
                    <Route path='forgot-password' element={<ForgotPassword />} />
                    <Route path='reset-password' element={<ResetPassword />} />
                </Routes>
            </BrowserRouter>
        </PayPalScriptProvider>
    );
}

export default App;
