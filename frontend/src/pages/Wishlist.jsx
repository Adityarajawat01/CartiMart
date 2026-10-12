
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  const { items, syncError } = useSelector((state) => state.wishlist);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {syncError && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Wishlist sync failed: {syncError} Your changes may not be available
            on other devices until saved.
          </p>
        )}
        {/* Header */}
        <header className="mb-10">
          <Link
            to="/products"
            className="mb-6 inline-flex items-center gap-2
              text-sm font-semibold text-slate-500
              transition-colors hover:text-violet-700"
          >
            <ArrowLeft size={18} />
            Continue shopping
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="mb-3 inline-flex items-center gap-2
                rounded-full bg-pink-100 px-4 py-1.5
                text-xs font-bold uppercase tracking-widest
                text-pink-700">
                <Heart size={14} fill="currentColor" />
                Your favourites
              </span>

              <h1 className="text-3xl font-black tracking-tight
                text-slate-950 sm:text-4xl lg:text-5xl">
                My{" "}
                <span className="bg-linear-to-r from-pink-600
                  to-violet-600 bg-clip-text text-transparent">
                  Wishlist.
                </span>
              </h1>

              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Keep the products you love all in one place.
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => dispatch(clearWishlist())}
                className="inline-flex items-center gap-2 rounded-xl
                  border border-red-200 bg-white px-4 py-2.5
                  text-sm font-semibold text-red-600
                  transition-all hover:bg-red-50
                  active:scale-95"
              >
                <Trash2 size={17} />
                Clear wishlist
              </button>
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2
              rounded-xl border border-violet-100
              bg-violet-50 px-4 py-2 text-sm font-semibold
              text-violet-700">
              <Heart size={16} fill="currentColor" />
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </div>
          )}
        </header>

        {/* Empty state */}
        {items.length === 0 ? (
          <section className="rounded-3xl border border-dashed
            border-slate-300 bg-white px-6 py-16 text-center
            shadow-sm sm:py-24">
            <div className="mx-auto flex h-20 w-20 items-center
              justify-center rounded-full bg-pink-50 text-pink-500">
              <Heart size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold
              tracking-tight text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm
              leading-6 text-slate-500">
              Found something you love? Tap the heart on any
              product to save it here.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center
                justify-center gap-2 rounded-xl bg-violet-700
                px-6 py-3 font-semibold text-white
                shadow-lg shadow-violet-200 transition-all
                hover:-translate-y-0.5 hover:bg-violet-800
                active:scale-95"
            >
              <ShoppingBag size={18} />
              Explore products
            </Link>
          </section>
        ) : (
          /* Wishlist grid */
          <div className="grid grid-cols-1 gap-5
            sm:grid-cols-2 sm:gap-6
            lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <article
                key={product._id}
                className="group relative overflow-hidden
                  rounded-2xl border border-slate-200/80
                  bg-white shadow-sm transition-all duration-300
                  hover:-translate-y-1 hover:border-violet-300
                  hover:shadow-xl hover:shadow-violet-200/30"
              >
                {/* Product image */}
                <Link
                  to={`/product/${product._id}`}
                  className="block"
                >
                  <div className="relative m-2 aspect-4/3
                    overflow-hidden rounded-xl
                    bg-linear-to-br from-slate-100
                    via-white to-violet-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-5
                          transition-transform duration-500
                          group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center
                        justify-center text-sm text-slate-400">
                        No image available
                      </div>
                    )}

                    <span className="absolute left-3 top-3
                      rounded-full bg-white/90 px-3 py-1
                      text-xs font-semibold text-pink-600
                      shadow-sm backdrop-blur">
                      <Heart
                        size={12}
                        fill="currentColor"
                        className="mr-1 inline"
                      />
                      Saved
                    </span>
                  </div>

                  {/* Product details */}
                  <div className="space-y-2 px-4 pb-3 pt-1">
                    <h2 className="line-clamp-1 text-base
                      font-bold text-slate-900">
                      {product.name}
                    </h2>

                    <p className="line-clamp-2 min-h-10
                      text-sm leading-relaxed text-slate-500">
                      {product.description ||
                        "Discover this product at CartiMart."}
                    </p>

                    <p className="text-xl font-extrabold
                      text-slate-900">
                      {formatPrice(product.price)}
                    </p>

                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-xs font-medium text-orange-600">
                        Only {product.stock} left
                      </p>
                    )}

                    {product.stock <= 0 && (
                      <p className="text-xs font-semibold text-red-600">
                        Currently out of stock
                      </p>
                    )}
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={() => handleAddToCart(product)}
                    className="flex flex-1 items-center
                      justify-center gap-2 rounded-xl
                      bg-slate-950 px-3 py-3 text-sm
                      font-semibold text-white
                      transition-all hover:bg-violet-700
                      active:scale-[0.97]
                      disabled:cursor-not-allowed
                      disabled:bg-slate-300
                      disabled:text-slate-500"
                  >
                    <ShoppingBag size={17} />
                    {product.stock <= 0
                      ? "Out of stock"
                      : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch(removeFromWishlist(product._id))
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove from wishlist"
                    className="flex h-11 w-11 shrink-0
                      items-center justify-center rounded-xl
                      border border-red-100 bg-red-50
                      text-red-500 transition-all
                      hover:border-red-200 hover:bg-red-100
                      active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
