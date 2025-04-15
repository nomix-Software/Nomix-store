import React from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Sidebar } from "./Sidebar";

// import { useStateContext } from "../store/StateContext";
// import { Cart } from "./";

export const Navbar = () => {
  // const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">
          {" "}
          <strong>CYE TECH</strong> Tienda
        </Link>
      </p>
      <div className="w-15">
        <button
          type="button"
          className="cart-icon"
          // onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">12</span>
        </button>
        <Sidebar role="admin" isAuthenticated={true} />
      </div>
      {/* {showCart && <Cart />} */}
    </div>
  );
};
