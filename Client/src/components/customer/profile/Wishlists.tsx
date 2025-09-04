import React from "react";
import { type CustomerWishlist } from "../../../types/Wishlist";

type WishlistsProps = {
  wishlists?: CustomerWishlist[];
};

const Wishlist: React.FC<WishlistsProps> = ({ wishlists }) => {
  return (
    <div>
      <h1>Coming Soon</h1>
      <p className="d-none">Total wishlits: {wishlists?.length}</p>
    </div>
  );
};

export default Wishlist;