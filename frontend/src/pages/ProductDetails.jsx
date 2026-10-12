import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleProduct, loading, error } = useSelector(
    (state) => state.products,
  );


const handleAddToCart = (product) => {
  dispatch(addToCart(product));
};

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full
          border-4 border-violet-200 border-t-violet-700"
        />
      </div>
    );
  }

  if (error || !singleProduct) {
    return (
      <div
        className="flex min-h-screen flex-col items-center
        justify-center gap-4 bg-slate-50"
      >
        <h2 className="text-2xl font-bold text-slate-800">
          {error || "Product not found"}
        </h2>
        <Link to="/" className="font-semibold text-violet-700">
          ← Back to products
        </Link>
      </div>
    );
  }

  const product = singleProduct;
  const outOfStock = product.stock <= 0;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(product.price);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          className="mb-7 flex flex-wrap items-center gap-2
          text-sm text-slate-500"
        >
          <Link to="/" className="transition hover:text-violet-700">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800">{product.category}</span>
          <span>/</span>
          <span className="max-w-48 truncate font-medium text-slate-900">
            {product.name}
          </span>
        </nav>

        {/* Main product section */}
        <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image gallery */}
          <div className="space-y-4">
            <div
              className="group relative flex min-h-[350px]
              items-center justify-center overflow-hidden
              rounded-3xl border border-slate-200
              bg-linear-to-br from-violet-100 via-white
              to-slate-100 p-8 sm:min-h-[500px]"
            >
              <span
                className="absolute left-5 top-5 rounded-full
                bg-white/80 px-4 py-2 text-xs font-bold
                uppercase tracking-wider text-violet-700
                shadow-sm backdrop-blur"
              >
                {product.category}
              </span>

              <span
                className={`absolute right-5 top-5 rounded-full
                px-4 py-2 text-xs font-bold shadow-sm ${
                  outOfStock
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {outOfStock ? "Out of stock" : "Available"}
              </span>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[420px] w-full object-contain
                    transition-transform duration-700
                    group-hover:scale-105"
                />
              ) : (
                <p className="text-slate-400">No image available</p>
              )}
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col gap-6">
            <div>
              <p
                className="mb-2 text-sm font-bold uppercase
                tracking-[0.2em] text-violet-700"
              >
                {product.category}
              </p>

              <h1
                className="text-3xl font-extrabold
                tracking-tight text-slate-950 sm:text-4xl"
              >
                {product.name}
              </h1>

              <p className="mt-4 leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Price card */}
            <div
              className="rounded-2xl border border-violet-100
              bg-violet-50/70 p-5"
            >
              <p
                className="text-xs font-semibold uppercase
                tracking-wider text-slate-500"
              >
                Current price
              </p>
              <p
                className="mt-1 text-4xl font-extrabold
                tracking-tight text-violet-800"
              >
                {formattedPrice}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Inclusive of the listed product price
              </p>
            </div>

            {/* Size and stock */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl border border-slate-200
                bg-white p-4"
              >
                <p
                  className="text-xs font-semibold uppercase
                  tracking-wider text-slate-400"
                >
                  Size
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {product.size || "Not specified"}
                </p>
              </div>

              <div
                className="rounded-2xl border border-slate-200
                bg-white p-4"
              >
                <p
                  className="text-xs font-semibold uppercase
                  tracking-wider text-slate-400"
                >
                  Stock
                </p>
                <p
                  className={`mt-2 text-lg font-bold ${
                    outOfStock ? "text-red-600" : "text-emerald-700"
                  }`}
                >
                  {outOfStock ? "Unavailable" : `${product.stock} units`}
                </p>
              </div>
            </div>

            <div
              className="flex flex-wrap items-center
              justify-between gap-4 rounded-2xl border
              border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-bold text-slate-900">Quantity</p>
                <p className="mt-1 text-xs text-slate-500">
                  Select the number of units
                </p>
              </div>

              <div
                className="flex items-center overflow-hidden
                rounded-xl border border-slate-200"
              >
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="h-11 w-11 text-lg font-bold
                    text-slate-700 transition hover:bg-violet-50
                    disabled:cursor-not-allowed
                    disabled:opacity-30"
                >
                  −
                </button>

                <span className="min-w-12 text-center font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={outOfStock || quantity >= product.stock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-11 w-11 text-lg font-bold
                    text-slate-700 transition hover:bg-violet-50
                    disabled:cursor-not-allowed
                    disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div
              className="flex items-center justify-between
              rounded-2xl bg-slate-950 p-5 text-white"
            >
              <div>
                <p className="text-sm text-slate-400">
                  Total for {quantity} {quantity === 1 ? "item" : "items"}
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                  }).format(product.price * quantity)}
                </p>
              </div>
              <span className="text-2xl text-violet-300">₹</span>
            </div>

            {/* Add to Cart */}

            <button
              type="button"
              disabled={outOfStock}
              onClick={() => handleAddToCart(product)}
              className="mt-5 flex w-full items-center justify-center gap-2
             rounded-xl bg-violet-700 px-6 py-4
             font-bold text-white transition-all duration-300
             hover:bg-violet-800 hover:shadow-lg
             active:scale-90 active:duration-100
             disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span className="text-xl">+</span>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </section>

        {/* Specifications */}
        <section
          className="mt-12 rounded-3xl border
          border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6">
            <p
              className="text-xs font-bold uppercase
              tracking-[0.2em] text-violet-700"
            >
              Product information
            </p>
            <h2
              className="mt-2 text-2xl font-extrabold
              text-slate-950"
            >
              Specifications
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="grid gap-2 py-4 sm:grid-cols-3">
              <p className="font-semibold text-slate-500">Name</p>
              <p className="font-medium text-slate-900 sm:col-span-2">
                {product.name}
              </p>
            </div>

            <div className="grid gap-2 py-4 sm:grid-cols-3">
              <p className="font-semibold text-slate-500">Category</p>
              <p className="font-medium text-slate-900 sm:col-span-2">
                {product.category}
              </p>
            </div>

            <div className="grid gap-2 py-4 sm:grid-cols-3">
              <p className="font-semibold text-slate-500">Size</p>
              <p className="font-medium text-slate-900 sm:col-span-2">
                {product.size || "Not specified"}
              </p>
            </div>

            <div className="grid gap-2 py-4 sm:grid-cols-3">
              <p className="font-semibold text-slate-500">Specifications</p>
              <p
                className="whitespace-pre-line font-medium
                leading-7 text-slate-900 sm:col-span-2"
              >
                {product.specifications || "Not specified"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
