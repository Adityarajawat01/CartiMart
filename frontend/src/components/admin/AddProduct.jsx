import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import { fetchProducts } from "../../redux/productSlice";
import {
  clearCurrentAdminProduct,
  createAdminProduct,
  fetchAdminDashboard,
  fetchAdminProduct,
  updateAdminProduct,
} from "../../redux/adminSlice";

const emptyProduct = {
  name: "",
  description: "",
  size: "",
  price: "",
  image: "",
  category: "",
  specifications: "",
  stock: "",
};

const fields = [
  { name: "name", label: "Product name", required: true },
  { name: "category", label: "Category", required: true },
  { name: "price", label: "Price (INR)", type: "number", required: true, min: "0.01", step: "0.01" },
  { name: "stock", label: "Available stock", type: "number", required: true, min: "0", step: "1" },
  { name: "size", label: "Size (optional)" },
  { name: "image", label: "Image URL", type: "url", required: true, wide: true },
  { name: "description", label: "Description", type: "textarea", required: true, wide: true },
  { name: "specifications", label: "Specifications", type: "textarea", required: true, wide: true },
];

const AddProduct = () => {
  const { id } = useParams();
  const formKey = id || "new";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ formKey, values: emptyProduct });
  const productValues =
    product.formKey === formKey ? product.values : emptyProduct;
  const { loading, savingProduct, errors } = useSelector((state) => state.admin);

  useEffect(() => {
    let active = true;
    if (!id) {
      dispatch(clearCurrentAdminProduct());
      return () => {
        active = false;
      };
    }

    dispatch(fetchAdminProduct(id))
      .unwrap()
      .then(({ product: savedProduct }) => {
        if (active) {
          setProduct({
            formKey,
            values: { ...emptyProduct, ...savedProduct },
          });
        }
      })
      .catch(() => {
        // The rejected thunk stores the server error in the admin slice.
      });

    return () => {
      active = false;
    };
  }, [dispatch, formKey, id]);

  const handleChange = (event) => {
    setProduct((current) => ({
      formKey,
      values: {
        ...(current.formKey === formKey ? current.values : emptyProduct),
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...productValues,
      price: Number(productValues.price),
      stock: Number(productValues.stock),
    };

    try {
      if (id) {
        await dispatch(updateAdminProduct({ id, product: payload })).unwrap();
      } else {
        await dispatch(createAdminProduct(payload)).unwrap();
      }
      dispatch(fetchProducts());
      dispatch(fetchAdminDashboard());
      navigate("/admin/products");
    } catch {
      // The rejected thunk stores the server error in the admin slice.
    }
  };

  if (id && loading.product) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading product…</p>;
  }

  if (id && errors.product) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p role="alert" className="text-sm font-medium text-red-700">{errors.product}</p>
        <Link to="/admin/products" className="mt-4 inline-flex text-sm font-semibold text-violet-700">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-gradient-to-br from-violet-50 to-white px-5 py-6 sm:px-7">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-700"
        >
          <ArrowLeft size={16} /> Back to product catalog
        </Link>
        <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
          {id ? "Edit product" : "Add a product"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {id
            ? `Update ${productValues.name || "this product"} and save your changes to the store.`
            : "Add the product details below. It will appear in your store after saving."}
        </p>
      </header>

      {errors.productForm && (
        <p
          role="alert"
          className="mx-5 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-7"
        >
          {errors.productForm}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
        {fields.map(({ name, label, type, required, min, step, wide }) => (
          <label key={name} className={`block ${wide ? "sm:col-span-2" : ""}`}>
            <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
              {label}
              {required && <span className="text-red-500" aria-hidden="true">*</span>}
              {required && <span className="sr-only"> (required)</span>}
            </span>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={productValues[name] || ""}
                onChange={handleChange}
                required={required}
                rows={name === "description" ? 3 : 4}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            ) : (
              <input
                name={name}
                type={type || "text"}
                value={productValues[name] || ""}
                onChange={handleChange}
                required={required}
                min={min}
                step={step}
                placeholder={
                  name === "image" ? "https://example.com/product.jpg" : ""
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            )}
            {name === "image" && productValues.image && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <img
                  src={productValues.image}
                  alt="Product preview"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                  className="h-16 w-16 rounded-lg bg-white object-contain p-1"
                />
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <ImageIcon size={15} /> Image preview
                </span>
              </div>
            )}
            {name === "stock" && (
              <p className="mt-1.5 text-xs text-slate-500">
                Enter 0 when the product is temporarily unavailable.
              </p>
            )}
          </label>
        ))}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={savingProduct}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {savingProduct
              ? id
                ? "Saving changes…"
                : "Adding product…"
              : id
                ? "Save changes"
                : "Add product"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
