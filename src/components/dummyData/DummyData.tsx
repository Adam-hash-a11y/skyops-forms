import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
}

export const DummyData = () => {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await axios.get("https://dummyjson.com/products");
        const result = responseData.data;
        console.log(result);
        setData(result.products);
      } catch (error) {
        console.log("Request failed:", error);
      }
    };
    getData();
  }, []);
  return (
    <>
      {data.map((unit) => (
        <div key={unit.id}>
          <div> userId is : {unit.id}</div>
          <div> title is : {unit.title}</div>
        </div>
      ))}
    </>
  );
};
