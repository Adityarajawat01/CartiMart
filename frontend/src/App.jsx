
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Products = lazy(() => import("./pages/Product.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const Checkout = lazy(() => import("./pages/CheckOut.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
import { useSelector } from "react-redux";
const Dashboard = lazy(() => import("./components/admin/Dashboard.jsx"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout.jsx"));
const ProductsManage = lazy(() => import("./components/admin/ProductsManage.jsx"));
const AddProduct = lazy(() => import("./components/admin/AddProduct.jsx"));
const AdminOrders = lazy(() => import("./components/admin/AdminOrders.jsx"));
const Layout = () => {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
  );

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main>
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-12 text-sm text-slate-500">
              Loading page…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Products variant="home" defaultSort="oldest" />,
      },
      {
        path: "/shop",
        element: <Products variant="shop" defaultSort="newest" />,
      },
      {
        path: "/products",
        element: <Products variant="shop" defaultSort="newest" />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),

      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute adminOnly>
            <Suspense
              fallback={
                <div className="mx-auto max-w-7xl px-4 py-12 text-sm text-slate-500">
                  Loading admin workspace…
                </div>
              }
            >
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <ProductsManage /> },
          { path: "products/new", element: <AddProduct /> },
          { path: "products/:id/edit", element: <AddProduct /> },
          { path: "orders", element: <AdminOrders /> },
        ],
      },
      {
        path: "/dashboard",
        element: <Navigate to="/admin" replace />,
      },

    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
