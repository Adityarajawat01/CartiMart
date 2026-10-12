
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, ShoppingBag } from "lucide-react";

import { clearCart } from "../redux/cartSlice";
import {
  createCODOrder,
  createPaymentOrder,
  verifyPayment,
} from "../redux/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { loading, paymentLoading, error } = useSelector(
    (state) => state.orders
  );

  const [payment, setPayment] = useState("cod");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const orderItems = items.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    try {
      if (payment === "cod") {
        await dispatch(
          createCODOrder({ items: orderItems, address })
        ).unwrap();

        dispatch(clearCart());
        navigate("/orders");
        return;
      }

      if (!window.Razorpay) {
        alert("Payment gateway is loading. Please try again.");
        return;
      }

      const data = await dispatch(
        createPaymentOrder({ items: orderItems, address })
      ).unwrap();

      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "CartiMart",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async (response) => {
          try {
            await dispatch(
              verifyPayment({
                dbOrderId: data.dbOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            dispatch(clearCart());
            navigate("/orders");
          } catch (error) {
            alert(error || "Payment verification failed");
          }
        },
      });

      razorpay.open();
    } catch (error) {
      alert(error || "Unable to place order");
    }
  };

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto mb-4" size={45} />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-lg bg-violet-600 px-6 py-3 text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
      <form onSubmit={handleCheckout} className="space-y-6 md:col-span-2">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {/* Delivery Address */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <MapPin size={22} /> Delivery Address
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Full Name"],
              ["phone", "Phone Number"],
              ["street", "Street Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                name={name}
                value={address[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full rounded-lg border p-3 outline-none focus:border-violet-600"
              />
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold">
            <CreditCard size={22} /> Payment Method
          </h2>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={payment === "cod"}
                onChange={(e) => setPayment(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={payment === "online"}
                onChange={(e) => setPayment(e.target.value)}
              />
              <span>Online Payment (Razorpay)</span>
            </label>
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || paymentLoading}
          className="w-full rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading || paymentLoading
            ? "Please wait..."
            : payment === "cod"
              ? "Place Order"
              : "Pay Now"}
        </button>
      </form>

      {/* Order Summary */}
      <aside className="h-fit rounded-xl border bg-white p-5">
        <h2 className="mb-5 text-xl font-semibold">Order Summary</h2>

        {items.map((item) => (
          <div
            key={item._id}
            className="mb-4 flex justify-between gap-3 text-sm"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="flex justify-between border-t pt-4 font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;