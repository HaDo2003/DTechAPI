import React, { useEffect, useState } from "react";
import { getHomeData, type HomePageData } from "../../services/HomeService";
import Slider from "../../components/customer/homepage/Slider";
import ProductGrid from "../../components/customer/ProductGrid";
import FeaturedCategory from "../../components/customer/homepage/FeaturedCategory";
import Loading from "../../components/shared/Loading";
import { useRecentlyViewed } from "../../utils/useRecentlyViewed";

const HomePage: React.FC = () => {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const RVData = useRecentlyViewed();

  useEffect(() => {
    getHomeData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div>
        {data && <Slider advertisements={data.advertisements} />}
        {data && <ProductGrid products={data.hotProducts} Title="Hot Sales" />}
        <FeaturedCategory />
        {data && <ProductGrid products={data.laptopProducts} Title="Laptop" />}
        {data && <ProductGrid products={data.smartphoneProducts} Title="Smart Phone" />}
        {data && <ProductGrid products={data.tabletProducts} Title="Tablet" />}
        {data && <ProductGrid products={data.accessoriesProducts} Title="Accessory" />}
        {RVData.length > 0 && <ProductGrid products={RVData} Title="Recently Viewed Products" />}
      </div>
      {loading && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <Loading />
        </div>
      )}
    </>

  );
};

export default HomePage;