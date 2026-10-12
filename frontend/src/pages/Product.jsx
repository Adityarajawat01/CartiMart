
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDownWideNarrow } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/search/SearchBar.jsx";
import Sort from "../components/search/Sort.jsx";
import { addToCart } from "../redux/cartSlice";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Product = ({ variant = "shop", defaultSort = "newest" }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || defaultSort);

  // Category is controlled by the Navbar through the URL.
  const category = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || defaultSort;
  const isHome = variant === "home";

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setSort(sortParam);
  }, [sortParam]);

  // Search, category and sort
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );

    if (category !== "all") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, searchQuery, category, sort]);

  // Reset search, category and sorting
  const resetFilters = () => {
    setSearchQuery("");
    setSort(defaultSort);
    setSearchParams({});
  };

  const handleSortChange = (value) => {
    setSort(value);
    const params = new URLSearchParams(searchParams);

    if (value === defaultSort) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSearchParams(params);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <main className="min-h-screen bg-[#f8f9fc] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <span className="mb-3 inline-flex rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-700">
            {isHome ?  "Discover more" : "New arrivals" }
          </span>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {isHome ? "Explore" : "New" }{" "}
            <span className="bg-linear-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {isHome ? "Products." : "Arrivals."}
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            {isHome
              ?  "Find something you love. Discover products made for your everyday life." :"Browse our latest collection and discover products worth another look."
              }
          </p>

          {/* Search and Sort */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1 basis-52">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Sort Popover */}
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-auto rounded-xl border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                  />
                }
              >
                <ArrowDownWideNarrow size={18} />
                Sort
              </PopoverTrigger>

              <PopoverContent align="end" className="w-72 rounded-2xl p-4">
                <Sort sort={sort} setSort={handleSortChange} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected category */}
          {category !== "all" && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">
                Category:
              </span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                {category}
              </span>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="text-xs font-semibold text-slate-500 underline underline-offset-2 transition hover:text-violet-700"
              >
                Clear category
              </button>
            </div>
          )}
        </header>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="aspect-4/3 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-5 h-10 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <Button
              onClick={() => dispatch(fetchProducts())}
              className="mt-4 rounded-xl bg-red-600 hover:bg-red-700"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg font-bold text-slate-800">
              No products found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or sorting.
            </p>
            <Button
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800"
            >
              Reset All
            </Button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Product;
