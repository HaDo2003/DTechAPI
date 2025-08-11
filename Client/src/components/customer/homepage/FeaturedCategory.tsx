import React from "react";
import FCategory from "./FCategoryItem";

const FeaturedCategory: React.FC = () => {
    return (
        <div className="container">
            <h2 className="text-center mb-4 featured-category">FEATURED CATEGORIES</h2>

            <div className="category-nav">
                <div className="row text-center">
                    <FCategory label="Laptop" iconlink="laptop" path="/category/laptop" />
                    <FCategory label="Smart Phone" iconlink="mobile" path="/category/smartphone" />
                    <FCategory label="Tablet" iconlink="tablet" path="/category/tablet" />
                    <FCategory label="Headphone" iconlink="headphones" path="/category/headphone" />
                    <FCategory label="Keyboard" iconlink="keyboard" path="/category/keyboard" />
                    <FCategory label="Mouse" iconlink="computer-mouse" path="/category/mouse" />
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategory;