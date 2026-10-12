
// import { useEffect, useState } from "react";
// import { Camera, LogOut, PackageCheck, Save } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   fetchProfile,
//   logout as logoutUser,
//   setUser,
//   updateProfile,
// } from "../redux/userSlice";

//  const Profile = () => {
//   const dispatch = useDispatch();
//   const { user: currentUser, token, loading, error } = useSelector((state) => state.user);
//   const user = currentUser || {};
//   const [preview, setPreview] = useState(user.image || "");
//   const [imageLoading, setImageLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: user.name || "",
//     mobile: user.mobile || "",
//   });
//   const [success, setSuccess] = useState("");
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchProfile());
//     }
//   }, [dispatch, token]);

//   useEffect(() => {
//     setPreview(user.image || "");
//     setForm({
//       name: user.name || "",
//       mobile: user.mobile || "",
//     });
//   }, [user.image, user.mobile, user.name]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setSuccess("");
//     setForm((current) => ({
//       ...current,
//       [name]:
//         name === "mobile"
//           ? value.replace(/\D/g, "").slice(0, 10)
//           : value,
//     }));
//   };

//   const handleProfileSave = async (event) => {
//     event.preventDefault();
//     setSuccess("");

//     try {
//       await dispatch(updateProfile(form)).unwrap();
//       setSuccess("Profile updated successfully.");
//     } catch {
//       setSuccess("");
//     }
//   };

//   const handleImage = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       alert("Image must be smaller than 5 MB.");
//       return;
//     }

//     const localPreview = URL.createObjectURL(file);
//     setPreview(localPreview);

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setImageLoading(true);

//       const res = await fetch(
//         `${API_URL}/users/profile/image`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Upload failed");
//       }

//       dispatch(setUser(data.user));
//       setPreview(data.user.image || "");
//       alert("Profile image updated successfully!");
//     } catch (error) {
//       setPreview(user?.image || "");
//       alert(error.message);
//     } finally {
//       setImageLoading(false);
//       URL.revokeObjectURL(localPreview);
//       e.target.value = "";
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     window.location.href = "/login";
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-10">
//       <div className="mx-auto max-w-lg">
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <h1 className="mb-8 text-2xl font-bold text-slate-900">
//             My Profile
//           </h1>

//           <div className="flex flex-col items-center">
//             <div className="relative">
//               {preview ? (
//                 <img
//                   src={preview}
//                   alt="Profile"
//                   className="h-28 w-28 rounded-full border-4 border-violet-100 object-cover"
//                 />
//               ) : (
//                 <div className="flex h-28 w-28 items-center justify-center rounded-full bg-violet-100 text-4xl font-bold text-violet-700">
//                   {(user?.name || "U")[0].toUpperCase()}
//                 </div>
//               )}

//               <label className={`absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-white shadow-md ${imageLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-violet-800"}`}>
//                 <Camera size={18} />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImage}
//                   disabled={imageLoading}
//                 />
//               </label>
//             </div>

//             <p className="mt-3 text-xs text-slate-500">
//               {imageLoading ? "Uploading..." : "Change profile photo"}
//             </p>

//             <h2 className="mt-4 text-xl font-semibold text-slate-900">
//               {user?.name || "Your Name"}
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               {user?.email || "Your email"}
//             </p>

//             <span className="mt-3 rounded-full bg-violet-50 px-4 py-1 text-xs font-semibold capitalize text-violet-700">
//               {user?.role || "customer"} account
//             </span>
//           </div>

//           <div className="my-8 border-t border-slate-100" />

//           <Link
//             to="/orders"
//             className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
//           >
//             <PackageCheck size={18} />
//             View My Previous Orders
//           </Link>

//           <form className="space-y-4" onSubmit={handleProfileSave}>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-600">
//                 Full Name
//               </label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
//               />
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-600">
//                 Email Address
//               </label>
//               <p className="break-all rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-800">
//                 {user?.email || "Not available"}
//               </p>
//             </div>

//             <div>
//               <label className="mb-1 block text-sm font-medium text-slate-600">
//                 Mobile Number
//               </label>
//               <input
//                 name="mobile"
//                 value={form.mobile}
//                 onChange={handleChange}
//                 required
//                 pattern="[0-9]{10}"
//                 className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
//               />
//             </div>

//             {error && (
//               <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
//                 {error}
//               </p>
//             )}

//             {success && (
//               <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
//                 {success}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
//             >
//               <Save size={18} />
//               {loading ? "Saving..." : "Update Profile"}
//             </button>
//           </form>

//           <button
//             onClick={handleLogout}
//             className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;



import { useEffect, useState } from "react";
import { Camera, LogOut, PackageCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProfile,
  logout as logoutUser,
  setUser,
} from "../redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user: currentUser, token } = useSelector(
    (state) => state.user
  );

  const user = currentUser || {};

  const [preview, setPreview] = useState(user.image || "");
  const [imageLoading, setImageLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setPreview(user.image || "");
  }, [user.image]);

 const handleImage = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image.");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be smaller than 5 MB.");
    e.target.value = "";
    return;
  }

  const localPreview = URL.createObjectURL(file);
  setPreview(localPreview);

  const formData = new FormData();
  formData.append("image", file);

  try {
    setImageLoading(true);

    const res = await fetch(
      `${API_URL}/users/profile/image`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Profile image upload failed");
    }

    dispatch(setUser(data.user));
    setPreview(data.user.image || "");

    alert("Profile photo updated successfully!");
  } catch (error) {
    console.error("Profile image error:", error);

    setPreview(user.image || "");

    alert(error.message || "Upload failed");
  } finally {
    setImageLoading(false);
    URL.revokeObjectURL(localPreview);
    e.target.value = "";
  }
};

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Heading */}
          <h1 className="mb-8 text-2xl font-bold text-slate-900">
            My Profile
          </h1>

          {/* Profile */}
          <div className="flex flex-col items-center">

            {/* Image */}
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-violet-100 object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-violet-100 text-5xl font-bold text-violet-700">
                  {(user?.name || "U")[0].toUpperCase()}
                </div>
              )}

              {/* Camera */}
              <label
                className={`absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-violet-700 text-white shadow-md ${
                  imageLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-violet-800"
                }`}
              >
                <Camera size={19} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                  disabled={imageLoading}
                />
              </label>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {imageLoading ? "Uploading..." : "Click camera to change photo"}
            </p>

            {/* Name */}
            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              {user?.name || "Your Name"}
            </h2>

            {/* Email */}
            <p className="mt-1 text-sm text-slate-500">
              {user?.email || "Your email"}
            </p>

            {/* Role */}
            <span className="mt-3 rounded-full bg-violet-50 px-4 py-1 text-xs font-semibold capitalize text-violet-700">
              {user?.role || "customer"} account
            </span>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-100" />

          {/* Orders */}
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            <PackageCheck size={18} />
            View My Previous Orders
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
