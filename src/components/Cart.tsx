"use client";
import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

// import { useStateContext } from "../store/StateContext";

// import { urlFor } from "../lib/client";
import Image from "next/image";

export const Cart = () => {
  const cartRef = useRef(null);
  // const {
  //   totalPrice,
  //   totalQuantities,
  //   cartItems,
  //   setShowCart,
  //   toggleCartItemQuanitity,
  //   onRemove,
  // } = useStateContext();

  const handleCheckout = async () => {
    // const stripe = await getStripe();

    // const response = await fetch("/api/stripe", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(cartItems),
    // });

    // if (response.status !== 200) {
    //   toast.error(`Failed to Proceed because of ${response.status}`);
    //   return;
    // }

    // const data = await response.json();

    toast.loading("Redirecting...");

    // stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          // onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({12} items)</span>
        </button>

        {[].length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                // onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {[].length >= 1 &&
            [].map((item, index) => (
              <div className="product" key={index}>
                <Image
                  src={"https://picsum.photos/200"}
                  className="cart-product-image"
                  alt="cart-product"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>Articulo prueba</h5>
                    <h4>${1000}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          // onClick={() =>
                          //   toggleCartItemQuanitity(item._id, "dec")
                          // }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{321}</span>
                        <span
                          className="plus"
                          // onClick={() =>
                          //   toggleCartItemQuanitity(item._id, "inc")
                          // }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      // onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {[].length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${84654654}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
