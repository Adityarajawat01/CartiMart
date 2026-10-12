
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/userSlice";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.user);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        signupUser({ name, email, mobile, password })
      ).unwrap();

      navigate("/login");
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
              Your shopping journey starts here.
            </h1>
            <p className="mt-4 text-violet-100 leading-relaxed">
              Discover amazing products, enjoy exclusive deals and
              experience shopping like never before.
            </p>
          </div>

          <p className="text-sm text-violet-200">
            Copyright 2026 CartiMart. Everything You Need, One Cart.
          </p>
        </div>

        {/* Signup form */}
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
              CREATE ACCOUNT
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Join CartiMart
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create an account to start shopping.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <User size={19} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Aditya Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

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
                Mobile number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <User size={19} className="text-slate-400" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  pattern="[0-9]{10}"
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 py-3.5 font-bold text-white transition-all duration-300 hover:bg-violet-800 hover:shadow-lg hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-violet-700 hover:text-violet-900"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
