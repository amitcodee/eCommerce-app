import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateProduct from "./pages/Admin/CreateProduct";
import CreateCategory from "./pages/Admin/CreateCategory";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Product from "./pages/Admin/Product";
// import UpdateProducts from "./pages/Admin/UpdateProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import ProductDisplay from "./pages/ProductDisplay";
import AllProducts from "./pages/AllProducts";
import Categories from "./components/Categories";
import AddressForm from "./pages/Address";
import CreateColor from "./pages/Admin/CreateColor";
import CreateSize from "./pages/Admin/CreateSize";
import InventoryList from "./pages/Admin/InventoryList";
import Cart from "./pages/Cart";
import OrdersPage from "./pages/order";
import OrderDetails from "./pages/OrderDetail";
import CategoryPage from "./pages/CategoryPage";
import InventoryDashboard from "./pages/Admin/InventoryDashboard";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Orders />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/create-color" element={<CreateColor />} />
          <Route path="admin/create-size" element={<CreateSize />} />
          <Route path="admin/inventory" element={<InventoryList />} />
          <Route path="admin/inventory-dashboard" element={<InventoryDashboard />} />
          {/* <Route path="admin/product/:slug" element={<UpdateProducts />} /> */}
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/products" element={<Product />} />
          <Route path="admin/users" element={<Users />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-address" element={<AddressForm />} />
        <Route path="/all-products/:slug" element={<ProductDisplay />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/order" element={<OrdersPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
