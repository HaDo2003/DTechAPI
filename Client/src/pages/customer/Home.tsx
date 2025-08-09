import React, { useEffect, useState } from "react";
import { getHomeData, type HomePageData } from "../../services/HomeService";
import Slider from "../../components/customer/homepage/Slider";

const HomePage: React.FC = () => {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data && <Slider advertisements={data.advertisements} />}
      {/* TODO: Add HotProducts, LaptopProducts, etc. */}
    </div>
  );
};

export default HomePage;