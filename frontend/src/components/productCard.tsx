import { useState, useEffect } from "react";
import "../css/ProductCard.css";

interface Product {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  price: number;
}

export default function ProductsCards() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProduct, setVisibleProduct] = useState<number>(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/scooter.json");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleShowProducts = () => {
    setVisibleProduct(visibleProduct + 3);
  };

  return (
    <>
      <div className="Product-box">
        {products.length > 0 ? (
          <ol className="Product-list">
            {products.slice(0, visibleProduct).map((product) => (
              <li key={product.id}>
                <div className="Product-container">
                  <img
                    className="Product-image"
                    src={product.img}
                    alt={product.img}
                  />
                  {/* <Link to={`/VegView/${product.name}`}> */}
                  <div className="Product-text">
                    <h1 className="Product-title">{product.title}</h1>
                    <p>{product.subtitle}</p>
                    <p>{product.description}</p>
                    <p className="Product-price">{product.price}</p>
                  </div>

                  {/* </Link> */}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
        {visibleProduct < products.length && (
          <button onClick={handleShowProducts}>Show more</button>
        )}
      </div>
    </>
  );
}