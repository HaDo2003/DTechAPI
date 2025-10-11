import React, { useEffect, useState } from "react";
import { getHomeData, type HomePageData } from "../../services/HomeService";
import Slider from "../../components/customer/homepage/Slider";
import ProductGrid from "../../components/customer/ProductGrid";
import FeaturedCategory from "../../components/customer/homepage/FeaturedCategory";
import { useRecentlyViewed } from "../../utils/useRecentlyViewed";
import SkeletonSlider from "../../components/customer/skeleton/SkeletonSlider";
import SkeletonProductGrid from "../../components/customer/skeleton/SkeletonProductGrid";

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
      {loading ? <SkeletonSlider /> : data && <Slider advertisements={data.advertisements} />}
      {loading ? <SkeletonProductGrid /> : data && <ProductGrid products={data.hotProducts} Title="Hot Sales" />}
      <FeaturedCategory />
      {loading ? <SkeletonProductGrid /> : data && <ProductGrid products={data.laptopProducts} Title="Laptop" />}
      {loading ? <SkeletonProductGrid /> : data && <ProductGrid products={data.smartphoneProducts} Title="Smart Phone" />}
      {loading ? <SkeletonProductGrid /> : data && <ProductGrid products={data.tabletProducts} Title="Tablet" />}
      {loading ? <SkeletonProductGrid /> : data && <ProductGrid products={data.accessoriesProducts} Title="Accessory" />}
      {loading ? <SkeletonProductGrid /> : RVData.length > 0 && <ProductGrid products={RVData} Title="Recently Viewed Products" />}
    </div>
    </>
  );
};

export default HomePage;