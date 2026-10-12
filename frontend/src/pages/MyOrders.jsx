
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { fetchOrders } from "../redux/orderSlice";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (store) => store.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-center font-semibold text-red-600">
          {error}
        </p>
        <button
          onClick={() => dispatch(fetchOrders())}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Your ordered products and prices.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchOrders())}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-violet-500 hover:text-violet-600 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag
              size={56}
              className="mx-auto mb-4 text-slate-300"
            />
            <h2 className="text-xl font-bold text-slate-800">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your orders will appear here after checkout.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Order ID
                    </p>
                    <p className="mt-1 font-bold text-slate-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Order Status
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-4 p-5">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center gap-3 sm:gap-5"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover sm:h-20 sm:w-20"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-slate-800">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          ₹{Number(item.price).toLocaleString("en-IN")} each
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-sm font-bold text-slate-800 sm:text-base">
                        ₹
                        {(item.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="ml-auto max-w-xs space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>
                        Items (
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                        )
                      </span>
                      <span>
                        ₹{Number(order.subtotal).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Delivery</span>
                      <span>
                        {order.deliveryCharge === 0
                          ? "FREE"
                          : `₹${Number(order.deliveryCharge).toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-800">
                        Total Price
                      </span>
                      <span className="text-xl font-extrabold text-violet-700">
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;