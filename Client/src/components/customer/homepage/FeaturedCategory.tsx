import React from "react";
import FCategory from "./FCategoryItem";

const FeaturedCategory: React.FC = () => {
    return (
        <div className="container">
            <h2 className="text-center mb-4 featured-category">FEATURED CATEGORIES</h2>

            <div className="category-nav">
                <div className="row text-center">
                    <FCategory label="Laptop" iconlink="laptop" path="/laptop" />
                    <FCategory label="Smart Phone" iconlink="mobile" path="/smart-phone" />
                    <FCategory label="Tablet" iconlink="tablet" path="/tablet" />
                    <FCategory label="Headphone" iconlink="headphones" path="/headphone" />
                    <FCategory label="Keyboard" iconlink="keyboard" path="/keyboard" />
                    <FCategory label="Mouse" iconlink="computer-mouse" path="/mouse" />
                </div>
            </div>
        </div>
    );
};

export default FeaturedCategory;