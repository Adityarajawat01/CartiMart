import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import {
  deleteAdminProduct,
  fetchAdminDashboard,
  fetchAdminProducts,
} from "../../redux/adminSlice";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);

const ProductsManage = () => {
  const dispatch = useDispatch();
  const { products, loading, deletingProductId, errors } = useSelector(
    (state) => state.admin,
  );
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteAdminProduct(productToDelete._id)).unwrap();
      setProductToDelete(null);
      dispatch(fetchProducts());
      dispatch(fetchAdminDashboard());
    } catch {
      // Keep the confirmation open so the error is visible alongside the product.
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
              <Package size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Product catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading.products
                  ? "Loading your store catalog…"
                  : `${products.length} ${products.length === 1 ? "product" : "products"} in your store`}
              </p>
            </div>
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          >
            <Plus size={17} /> Add product
          </Link>
        </header>

        {errors.products && !productToDelete && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
          >
            {errors.products}
          </p>
        )}
        {loading.products ? (
          <div className="space-y-3 p-5 sm:p-6" aria-label="Loading products">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : products.length ? (
          <ul className="divide-y divide-slate-100">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex flex-col gap-4 p-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:px-6 sm:py-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                      className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1.5"
                    />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Package size={24} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {product.category}
                      {product.size ? ` · ${product.size}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {formatPrice(product.price)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-red-50 text-red-700"
                            : product.stock <= 5
                              ? "bg-amber-50 text-amber-800"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-800 transition hover:border-violet-400 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:flex-none"
                  >
                    <Pencil size={15} /> Edit
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${product.name}`}
                    disabled={deletingProductId === product._id}
                    onClick={() => setProductToDelete(product)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-14 text-center sm:px-6">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Package size={26} />
            </span>
            <p className="mt-4 font-bold text-slate-900">Your catalog is empty</p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first product to start selling.
            </p>
            <Link
              to="/admin/products/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800"
            >
              <Plus size={17} /> Add your first product
            </Link>
          </div>
        )}
      </section>

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingProductId) {
              setProductToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            aria-describedby="delete-product-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
              <Trash2 size={21} />
            </div>
            <h2
              id="delete-product-title"
              className="mt-4 text-lg font-extrabold text-slate-950"
            >
              Delete this product?
            </h2>
            <p
              id="delete-product-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              <span className="font-semibold text-slate-900">
                {productToDelete.name}
              </span>{" "}
              will be removed from your store. This action cannot be undone.
            </p>
            {errors.products && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errors.products}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(deletingProductId)}
                onClick={() => setProductToDelete(null)}
                className="min-h-10 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingProductId)}
                onClick={handleDelete}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              >
                <Trash2 size={15} />
                {deletingProductId ? "Deleting…" : "Yes, delete product"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProductsManage;
