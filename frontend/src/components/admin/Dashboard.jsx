import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, IndianRupee, Package, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../redux/adminSlice";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, errors } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const stats = dashboard?.stats;
  const cards = [
    { label: "Products", value: stats?.totalProducts ?? 0, icon: Package },
    { label: "Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag },
    { label: "Paid revenue", value: money(stats?.paidRevenue), icon: IndianRupee },
    { label: "Low stock (5 or fewer)", value: stats?.lowStockProducts ?? 0, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {errors.dashboard && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errors.dashboard}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <span className="rounded-xl bg-violet-50 p-2 text-violet-700"><Icon size={19} /></span>
            </div>
            <p className="mt-5 text-2xl font-extrabold text-slate-950">
              {loading.dashboard ? "—" : value}
            </p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Recent orders</h2>
            <p className="mt-1 text-sm text-slate-500">Latest activity in your store</p>
          </div>
          <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {loading.dashboard ? (
          <p className="px-5 py-8 text-sm text-slate-500">Loading orders…</p>
        ) : dashboard?.recentOrders?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-semibold text-slate-800">#{order._id.slice(-7).toUpperCase()}</td>
                    <td className="px-5 py-4 text-slate-600">{order.userId?.name || "Customer"}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{money(order.total)}</td>
                    <td className="px-5 py-4 capitalize text-slate-600">{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-8 text-sm text-slate-500">No orders yet. New orders will appear here.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;