import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../../redux/adminSlice";

const nextStatuses = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, updatingOrderId, errors } = useSelector(
    (state) => state.admin,
  );

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const updateStatus = async (order, status) => {
    if (
      status === "cancelled" &&
      !window.confirm(
        "Cancel this order? COD stock will be returned to inventory.",
      )
    ) {
      return;
    }

    try {
      await dispatch(
        updateAdminOrderStatus({ id: order._id, status }),
      ).unwrap();
    } catch {
      // The rejected thunk stores the server error in the admin slice.
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">Customer orders</h2>
        <p className="mt-1 text-sm text-slate-500">Review and progress orders through fulfillment.</p>
      </div>
      {errors.orders && <p role="alert" className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.orders}</p>}
      {loading.orders ? (
        <p className="px-5 py-8 text-sm text-slate-500">Loading orders…</p>
      ) : orders.length ? (
        <div className="divide-y divide-slate-100">
          {orders.map((order) => (
            <article key={order._id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900">Order #{order._id.slice(-7).toUpperCase()}</h3>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold capitalize text-violet-800">{order.orderStatus}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {order.userId?.name || "Customer"} · {order.userId?.email || "—"} · {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {order.paymentMethod === "cod" ? "Cash on delivery" : "Online"} · Payment {order.paymentStatus} · {money(order.total)}
                </p>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                Update status
                <select
                  aria-label={`Update order ${order._id} status`}
                  value=""
                  disabled={!nextStatuses[order.orderStatus]?.length || updatingOrderId === order._id}
                  onChange={(event) => updateStatus(order, event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="" disabled>{updatingOrderId === order._id ? "Updating…" : "Choose…"}</option>
                  {(nextStatuses[order.orderStatus] || [])
                    .filter((status) => !(status === "cancelled" && order.paymentStatus === "paid"))
                    .map((status) => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                    ))}
                </select>
              </label>
            </article>
          ))}
          <p className="px-5 py-3 text-xs text-slate-400">Showing the latest 100 orders.</p>
        </div>
      ) : (
        <p className="px-5 py-10 text-center text-sm text-slate-500">No orders have been placed yet.</p>
      )}
    </div>
  );
};

export default AdminOrders;