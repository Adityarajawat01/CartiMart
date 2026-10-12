import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Heart,
  PackageCheck,
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import Filter from "../components/search/Filter";

const Navbar = ({ cartCount = 0 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const products = useSelector((state) => state.products.products);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const isAdmin = user?.role === "admin";
  const showCustomerActions = !isAdmin;

  const categories = useMemo(
    () => [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );

  const category = searchParams.get("category") || "all";

  const handleCategoryChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    params.delete("sort");
    setSearchParams(params);
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-violet-700" : "text-slate-700 hover:text-violet-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#102A56]">Carti</span>
            <span className="text-[#FF6B00]">Mart</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink
            to="/products?sort=newest"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-violet-700"
          >
            New Arrivals
          </NavLink>

          {isAuthenticated && showCustomerActions && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}

          <div className="w-48">
            <Filter
              category={category}
              setCategory={handleCategoryChange}
              categories={categories}
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative text-slate-700 transition-colors hover:text-violet-700"
          >
            <Heart size={21} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {showCustomerActions && (
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative text-slate-700 transition-colors hover:text-violet-700"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            aria-label="Profile"
            className="flex items-center gap-3 rounded-full bg-violet-50 px-3 py-2 transition hover:bg-violet-100"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-white">
                <User size={18} />
              </div>
            )}

            <span className="text-sm font-semibold text-violet-700">
              {user?.name || "Login"}
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={18} />
                  Admin workspace
                </span>
              </NavLink>
            )}
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <Link
              to="/products?sort=newest"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-violet-700"
            >
              New Arrivals
            </Link>

            {isAuthenticated && showCustomerActions && (
              <NavLink
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                <span className="inline-flex items-center gap-2">
                  <PackageCheck size={18} />
                  My Orders
                </span>
              </NavLink>
            )}

            <div className="w-full">
              <Filter
                category={category}
                setCategory={handleCategoryChange}
                categories={categories}
              />
            </div>

            <div className="flex items-center gap-6 border-t border-slate-200 pt-4">
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Heart size={20} />
                Wishlist
              </Link>

              {showCustomerActions && (
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <ShoppingCart size={20} />
                  Cart
                  {cartCount > 0 && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4">
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user?.name || "Profile"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-700 text-white">
                    <User size={18} />
                  </div>
                )}

                <span className="font-medium text-slate-700">
                  {user?.name || "Login"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
