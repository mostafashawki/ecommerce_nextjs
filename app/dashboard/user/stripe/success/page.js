"use client";
import Link from "next/link";
import useCartStore from "@/store/cart";
import { useEffect } from "react";

export default function UserStripeSuccess() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col text-center">
          <p>
            Thank you for your purchase. You can now check your order status in
            the dashboard
          </p>
          <hr />
          <Link
            className="btn btn-primary btn-raised"
            href="/dashboard/user/orders"
          >
            View Order Status
          </Link>
        </div>
      </div>
    </div>
  );
}
