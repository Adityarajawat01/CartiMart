import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRound,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { logout } from "../redux/userSlice";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const name = user?.name || "My Account";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="User account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1.5 transition hover:bg-violet-50"
      >  
        {isAuthenticated ? (
          <>
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-200"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700 ring-2 ring-violet-200">
                {initial}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-violet-400 hover:text-violet-700">
              <UserRound size={21} />
            </span>
            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
            {isAuthenticated ? (
              <>
                <div className="border-b border-slate-100 bg-violet-50/60 p-4">
                  <div className="flex items-center gap-3">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-200 text-lg font-bold text-violet-800">
                        {initial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Logged in
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <UserRound size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/profile/edit"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Settings size={18} />
                    Edit Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-slate-100 p-4">
                  <p className="font-bold text-slate-900">
                    Welcome to CartiMart
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Sign in to manage your account.
                  </p>
                </div>

                <div className="space-y-2 p-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
                  >
                    <LogIn size={17} />
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                  >
                    <UserPlus size={17} />
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}