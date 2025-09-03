import React from "react";
import { type CustomerWishlist } from "../../../types/Wishlist";

type WishlistsProps = {
  wishlists?: CustomerWishlist[];
};

const Wishlist: React.FC<WishlistsProps> = ({ wishlists }) => {
  return (
    <div>
      <h5>Coupons</h5>
      <p>Total wishlits:</p>
    </div>
  );
};

export default Wishlist;