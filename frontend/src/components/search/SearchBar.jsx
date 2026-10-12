import { Search, X } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="group relative w-full max-w-2xl">
      <div
        className="flex items-center gap-3 rounded-2xl
        border border-slate-200 bg-white px-4 py-3
        shadow-sm transition-all duration-300
        hover:border-violet-300 hover:shadow-md
        focus-within:border-violet-500
        focus-within:shadow-lg
        focus-within:shadow-violet-100"
      >
        {/* Search Icon */}
        <Search
          size={22}
          className="shrink-0 text-slate-400
          transition-colors duration-300
          group-focus-within:text-violet-600"
        />

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm
          font-medium text-slate-800 outline-none
          placeholder:text-slate-400 sm:text-base"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 items-center
            justify-center rounded-full bg-slate-100
            text-slate-500 transition-all duration-200
            hover:scale-110 hover:bg-violet-100
            hover:text-violet-700 active:scale-90"
          >
            <X size={17} />
          </button>
        )}

        {/* Search Label */}
        <span
          className="hidden shrink-0 rounded-lg
          bg-violet-50 px-3 py-1.5 text-xs
          font-semibold text-violet-700 sm:block"
        >
          Search
        </span>
      </div>
    </div>
  );
};

export default SearchBar;