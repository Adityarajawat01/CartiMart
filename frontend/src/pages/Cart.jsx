
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "@/redux/cartSlice";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShoppingCart, Tag, Truck, ShieldCheck } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, syncError } = useSelector((state) => state.cart);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const itemCount = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        {syncError && (
          <p
            role="alert"
            className="mx-auto mb-5 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Cart sync failed: {syncError}
          </p>
        )}
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
            <ShoppingBag size={42} className="text-violet-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Looks like you haven't added anything to your cart yet.
            Explore our collection and find something you love.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {syncError && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Cart sync failed: {syncError} Your changes may not be available on
            other devices until saved.
          </p>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <ShoppingCart size={17} />
              CartiMart / Shopping Cart
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            onClick={() => dispatch(clearCart())}
            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">

          {/* Products */}
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item._id}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  {/* Image */}
                  <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-32 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:min-h-32">
                    <div>
                      <h2 className="line-clamp-2 text-lg font-bold text-slate-800">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        In stock: {item.stock}
                      </p>

                      <p className="mt-2 text-lg font-extrabold text-violet-700">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Quantity */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                        <button
                          onClick={() =>
                            dispatch(decreaseQuantity(item._id))
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="p-2.5 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-10 text-center text-sm font-bold text-slate-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            dispatch(increaseQuantity(item._id))
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                          className="p-2.5 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          dispatch(removeFromCart(item._id))
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="border-t border-slate-100 pt-3 text-right sm:min-w-28 sm:border-0 sm:pt-0">
                    <p className="text-xs text-slate-400">Item total</p>
                    <p className="mt-1 text-xl font-extrabold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <Link
              to="/"
              className="inline-flex items-center gap-2 pt-2 text-sm font-bold text-violet-600 transition hover:text-violet-800"
            >
              <ArrowRight className="rotate-180" size={17} />
              Continue Shopping
            </Link>
          </section>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Order Summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review your order details
                </p>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-bold text-green-600">
                    -{formatPrice(discount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-bold text-slate-800">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {subtotal > 0 && subtotal < 999 && (
                  <div className="rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-700">
                    Add {formatPrice(999 - subtotal)} more to
                    unlock free shipping.
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-200">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{
                          width: `${Math.min((subtotal / 999) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-violet-700">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-slate-400">
                    Inclusive of applicable taxes
                  </p>
                </div>

                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={15} />
                  Secure checkout
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                  <Truck size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Free Shipping
                  </p>
                  <p className="text-xs text-slate-500">
                    On orders above ₹999
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                  <Tag size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Great Deals
                  </p>
                  <p className="text-xs text-slate-500">
                    Discover products at great prices
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
