
import { ArrowDownWideNarrow } from "lucide-react";

const Sort = ({ sort, setSort }) => {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl
      border border-slate-200 bg-white p-3 shadow-sm
      transition-all duration-300 hover:border-violet-300
      hover:shadow-md sm:w-auto">

      <div className="flex h-10 w-10 shrink-0 items-center
        justify-center rounded-xl bg-violet-100 text-violet-700">
        <ArrowDownWideNarrow size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <label
          htmlFor="sort"
          className="mb-1 block text-xs font-semibold
            text-slate-500"
        >
          Sort By
        </label>

        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full cursor-pointer bg-transparent
            text-sm font-semibold text-slate-800
            outline-none sm:min-w-40"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Old Arrivals</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default Sort;
