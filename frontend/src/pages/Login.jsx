
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import { loadCustomerShoppingData } from "../redux/cartSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const customerId = result.user?.id || result.user?._id;
      if (customerId) {
        await dispatch(loadCustomerShoppingData(customerId));
      }
      const requestedPath = location.state?.from?.pathname;
      const destination =
        result.user.role === "admin"
          ? requestedPath?.startsWith("/admin")
            ? requestedPath
            : "/admin"
          : requestedPath && !requestedPath.startsWith("/admin")
            ? requestedPath
            : "/";
      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Left section */}
        <div className="hidden md:flex flex-col justify-between bg-linear-to-br from-violet-700 via-purple-700 to-indigo-900 p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black">
            <ShoppingBag size={30} />
            CartiMart
          </Link>

          <div>
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white/10 p-8">
                <ShoppingBag size={100} strokeWidth={1.2} />
              </div>
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to CartiMart.
            </h1>
            <p className="mt-4 leading-relaxed text-violet-100">
              Your favorite products are just a few clicks away.
              Sign in and continue shopping.
            </p>
          </div>

          <p className="text-sm text-violet-200">
            Copyright 2026 CartiMart. Everything You Need, One Cart.
          </p>
        </div>

        {/* Login form */}
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 md:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-black text-violet-700"
            >
              <ShoppingBag size={28} />
              CartiMart
            </Link>
          </div>

          <div className="mb-8">
            <span className="text-sm font-semibold text-violet-600">
              WELCOME BACK
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Mail size={19} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Lock size={19} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-violet-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 py-3.5 font-bold text-white transition-all duration-300 hover:bg-violet-800 hover:shadow-lg hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-violet-700 hover:text-violet-900"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
