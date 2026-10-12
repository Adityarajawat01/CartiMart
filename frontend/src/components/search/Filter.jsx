const Filter = ({ category, setCategory, categories }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className=" flex items-baseline justify-between gap-3">
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
