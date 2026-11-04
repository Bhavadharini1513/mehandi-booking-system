import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getBooking } from "../../services/bookingService";
import {
  createPaymentOrder,
  getPaymentConfig,
  PaymentOrder,
  verifyPayment,
} from "../../services/paymentService";

import { Booking, BookingStatus } from "../../types/Booking";

// Razorpay adds this object to the window when its script is loaded
declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [mode, setMode] = useState<"live" | "demo">("demo");
  const [loading, setLoading] = useState<boolean>(true);
  const [paying, setPaying] = useState<boolean>(false);

  // demo payment window
  const [demoOrder, setDemoOrder] = useState<PaymentOrder | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const [bookingResponse, config] = await Promise.all([
          getBooking(bookingId as string),
          getPaymentConfig(),
        ]);

        setBooking(bookingResponse.booking);
        setMode(config.mode);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Unable to load booking");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  const finish = async (
    order: PaymentOrder,
    paymentId: string,
    signature: string,
  ): Promise<void> => {
    try {
      await verifyPayment({
        bookingId: order.booking._id,
        orderId: order.orderId,
        paymentId,
        signature,
      });

      toast.success("Payment successful! Your booking is confirmed.");
      navigate("/my-bookings", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment verification failed");
    } finally {
      setPaying(false);
      setDemoOrder(null);
    }
  };

  const handlePay = async (): Promise<void> => {
    if (!booking) return;

    try {
      setPaying(true);

      const order = await createPaymentOrder(booking._id);

      // ---------- DEMO MODE ----------
      if (order.mode === "demo") {
        setDemoOrder(order);
        return;
      }

      // ---------- LIVE MODE (Razorpay) ----------
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        toast.error("Could not load Razorpay. Check your internet connection.");
        setPaying(false);
        return;
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Maruthani World",
        description: `${order.booking.service} with ${order.booking.artist}`,
        prefill: { name: order.booking.customer, email: order.booking.email },
        theme: { color: "#059669" },
        handler: (response: {
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => finish(order, response.razorpay_payment_id, response.razorpay_signature),
        modal: { ondismiss: () => setPaying(false) },
      });

      checkout.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to start payment");
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/my-bookings" className="text-emerald-700">← Back to bookings</Link>
      </div>
    );
  }

  const payable = booking.status === BookingStatus.ACCEPTED;

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8">
        <Link to="/my-bookings" className="text-emerald-700 font-semibold">
          ← My bookings
        </Link>

        <h1 className="text-3xl font-bold text-emerald-900 mt-4">Payment</h1>

        <div className="mt-6 space-y-2 text-gray-700">
          <p><strong>Service:</strong> {booking.service}</p>
          <p><strong>Artist:</strong> {booking.artist.name}</p>
          <p><strong>Date:</strong> {booking.dateKey}</p>
          <p><strong>Time:</strong> {booking.startTime} – {booking.endTime} ({booking.hours}h)</p>
          <p>
            <strong>Rate:</strong> ₹{booking.artistProfile?.pricePerHour} × {booking.hours} h
          </p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 mt-6 text-center">
          <p className="text-gray-500">Amount to pay</p>
          <p className="text-4xl font-bold text-emerald-800">₹{booking.amount}</p>
        </div>

        {mode === "demo" && (
          <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
            Demo mode: no real money is charged. Add Razorpay keys in the
            backend .env file to accept real payments.
          </p>
        )}

        {payable ? (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full mt-6 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            {paying ? "Please wait..." : `Pay ₹${booking.amount}`}
          </button>
        ) : (
          <p className="mt-6 text-center text-gray-600">
            This booking cannot be paid right now (status: {booking.status}).
          </p>
        )}
      </div>

      {/* ---------- DEMO PAYMENT WINDOW ---------- */}
      {demoOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold">Demo Payment</h3>

            <p className="text-sm text-gray-500 mt-1">
              Order {demoOrder.orderId.slice(0, 18)}…
            </p>

            <div className="space-y-3 mt-4">
              <input
                readOnly
                value="4111 1111 1111 1111"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
              />

              <div className="flex gap-3">
                <input
                  readOnly
                  value="12 / 30"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                />

                <input
                  readOnly
                  value="123"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setDemoOrder(null);
                  setPaying(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => finish(demoOrder, `pay_demo_${Date.now()}`, "demo")}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
              >
                Pay ₹{demoOrder.amount / 100}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
