import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard";

const Product = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
      (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-4 py-10
      sm:px-6 lg:px-10 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between
          gap-4 sm:mb-10 sm:flex-row sm:items-end">

          <div>
            <span className="mb-3 inline-flex rounded-full
              bg-violet-100 px-4 py-1.5 text-xs font-bold
              uppercase tracking-widest text-violet-700">
              Discover more
            </span>

            <h1 className="text-3xl font-black tracking-tight
              text-slate-950 sm:text-4xl lg:text-5xl">
              Explore <span className="bg-linear-to-r
                from-violet-600 to-fuchsia-500 bg-clip-text
                text-transparent">Products.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6
              text-slate-500 sm:text-base">
              Find something you love. Discover products
              made for your everyday life.
            </p>
          </div>

          {!loading && !error && (
            <div className="w-fit rounded-xl border border-slate-200
              bg-white px-4 py-2 text-sm font-semibold
              text-slate-600 shadow-sm">
              {products.length} products
            </div>
          )}
        </header>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5
            sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse
                overflow-hidden rounded-2xl border
                border-slate-200 bg-white p-3">
                <div className="aspect-4/3 rounded-xl
                  bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded
                  bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded
                  bg-slate-200" />
                <div className="mt-5 h-10 rounded-xl
                  bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200
            bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="mt-4 rounded-xl bg-red-600
                px-5 py-2.5 text-sm font-semibold
                text-white transition hover:bg-red-700">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed
            border-slate-300 bg-white p-12 text-center">
            <p className="text-lg font-bold text-slate-800">
              No products found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Products will appear here when available.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5
            sm:grid-cols-2 sm:gap-6
            lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Product;