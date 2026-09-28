
// const ProductCard = ({product}) => {
//   return (
//     <div>
//       <div className=" border-rounded border-pink-800 flex items-start flex-col ">
//        <img src={product.image} alt={product.name} />
//         <h3 className="font-sans ">{product.name}</h3>
//         <h4 className="font-bold text-green">price: {product.price}</h4>
//         <p className="font-light ">desc: {product.description}</p>
//         <p className="font-semibold text-red">left:{product.stock}</p>
//       </div>
//     </div>
//   )
// }

// export default ProductCard;


const ProductCard = ({ product, onAddToCart }) => {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl
      border border-slate-200/80 bg-white shadow-sm
      transition-all duration-500 hover:-translate-y-2
      hover:border-violet-300 hover:shadow-2xl
      hover:shadow-violet-200/40">

      {/* Image section */}
      <div className="relative m-2 overflow-hidden rounded-xl
        bg-linear-to-br from-slate-300 via-white to-violet-300
        aspect-4/3">

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
          <div className="flex h-full items-center justify-center
            text-sm text-slate-400">
            No image available
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full
            border border-white/70 bg-white/80 px-3 py-1
            text-xs font-semibold text-slate-700 shadow-sm
            backdrop-blur-md">
            {typeof product.category === "string"
              ? product.category
              : product.category.name}
          </span>
        )}

        {/* Stock badge */}
        <span className={`absolute right-3 top-3 rounded-full
          px-3 py-1 text-xs font-semibold shadow-sm ${
            outOfStock
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}>
          {outOfStock ? "Sold out" : "In stock"}
        </span>

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0
          bg-linear-to-t from-violet-950/10 to-transparent
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100" />
      </div>

      {/* Product information */}
      <div className="space-y-3 p-4 pt-2 sm:p-5">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-bold
            tracking-tight text-slate-900 sm:text-lg">
            {product.name}
          </h3>

          <p className="line-clamp-2 min-h-10 text-sm
            leading-relaxed text-slate-500">
            {product.description || "Discover this product at CartiMart."}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase
              tracking-wider text-slate-400">
              Price
            </p>
            <p className="text-xl font-extrabold tracking-tight
              text-slate-900">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(product.price)}
            </p>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-right text-xs font-medium
              text-orange-600">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
          className="flex w-full items-center justify-center gap-2
            rounded-xl bg-slate-950 px-4 py-3
            text-sm font-semibold text-white
            transition-all duration-300
            hover:bg-violet-700 hover:shadow-lg
            hover:shadow-violet-300/40
            active:scale-[0.97]
            disabled:cursor-not-allowed
            disabled:bg-slate-300 disabled:text-slate-500
            disabled:shadow-none">
          <span aria-hidden="true">＋</span>
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;


