import React from "react";
import { AiFillInstagram, AiOutlineTwitter } from "react-icons/ai";

export const Footer = () => {
  return (
    <div className="footer-container">
      <p>2025 CYE Tech Store All rights reserverd</p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
      </p>
    </div>
  );
};
