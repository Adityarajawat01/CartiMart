import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist as toggleWishlistAction } from "../redux/wishlistSlice";


const ProductCard = ({ product, onAddToCart }) => {
  const outOfStock = product.stock <= 0;
  const dispatch = useDispatch();

  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some(
      (item) => item._id === product._id
    )
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistAction(product));
  };

  return (
    <article
      className="group relative overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white shadow-sm
        transition-all duration-500 hover:-translate-y-2
        hover:border-violet-300 hover:shadow-2xl
        hover:shadow-violet-200/40"
    >
      {/* Clickable product details */}
      <Link to={`/product/${product._id}`} className="block">
        {/* Image section */}
        <div
          className="relative m-2 overflow-hidden rounded-xl
            bg-linear-to-br from-slate-300 via-white to-violet-300
            aspect-4/3"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-5
                transition-transform duration-700
                group-hover:scale-110"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center
                text-sm text-slate-400"
            >
              No image available
            </div>
          )}

          {/* Category */}
          {product.category && (
            <span
              className="absolute left-3 top-3 rounded-full
                border border-white/70 bg-white/80 px-3 py-1
                text-xs font-semibold text-slate-700 shadow-sm
                backdrop-blur-md"
            >
              {typeof product.category === "string"
                ? product.category
                : product.category.name}
            </span>
          )}

          {/* Stock status */}
          <span
            className={`absolute right-3 top-3 rounded-full
              px-3 py-1 text-xs font-semibold shadow-sm ${
                outOfStock
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
          >
            {outOfStock ? "Sold out" : "In stock"}
          </span>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            className={`absolute bottom-3 right-3 z-10
              flex h-10 w-10 items-center justify-center
              rounded-full border shadow-md backdrop-blur-md
              transition-all duration-300 hover:scale-110
              active:scale-90 ${
                isWishlisted
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-white/80 bg-white/90 text-slate-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              }`}
          >
            <Heart
              size={20}
              fill={isWishlisted ? "currentColor" : "none"}
              className="transition-transform duration-300"
            />
          </button>

          {/* Hover overlay */}
          <div
            className="pointer-events-none absolute inset-0
              bg-linear-to-t from-violet-950/10 to-transparent
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100"
          />
        </div>

        {/* Product information */}
        <div className="space-y-3 p-4 pt-2 sm:p-5">
          <div className="space-y-1">
            <h3
              className="line-clamp-1 text-base font-bold
                tracking-tight text-slate-900 sm:text-lg"
            >
              {product.name}
            </h3>

            <p
              className="line-clamp-2 min-h-10 text-sm
                leading-relaxed text-slate-500"
            >
              {product.description ||
                "Discover this product at CartiMart."}
            </p>
          </div>

          {/* Price and stock */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <p
                className="text-xs font-medium uppercase
                  tracking-wider text-slate-400"
              >
                Price
              </p>

              <p
                className="text-xl font-extrabold tracking-tight
                  text-slate-900"
              >
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 2,
                }).format(product.price)}
              </p>
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <span
                className="text-right text-xs font-medium
                  text-orange-600"
              >
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
          className="flex w-full items-center justify-center
            gap-2 rounded-xl bg-slate-950 px-4 py-3
            text-sm font-semibold text-white
            transition-all duration-300
            hover:bg-violet-700 hover:shadow-lg
            hover:shadow-violet-300/40
            active:scale-[0.97]
            disabled:cursor-not-allowed
            disabled:bg-slate-300 disabled:text-slate-500
            disabled:shadow-none"
        >
          <span aria-hidden="true">+</span>
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
