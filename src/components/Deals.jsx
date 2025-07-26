import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listProducts } from '../graphql/queries';

const client = generateClient();

const Deals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await client.graphql({ query: listProducts });
        const items = res?.data?.listProducts?.items || [];

        const sorted = items
          .filter(p => typeof p.price === 'number')
          .sort((a, b) => a.price - b.price)
          .slice(0, 30);

        setProducts(sorted);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
      }
    };

    fetchProducts();
  }, []);

  const styles = `
    .section-heading {
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
    .card:hover {
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    .card img {
      height: 200px;
      object-fit: contain;
      background: #f9f9f9;
      width: 100%;
    }
    .card-body {
      padding: 14px 16px;
    }
    .card-title {
      font-weight: 600;
      margin: 0 0 4px;
      font-size: 16px;
    }
    .card-price {
      font-weight: bold;
      color: #222;
      font-size: 15px;
    }
    .card-discount {
      color: #d9534f;
      font-weight: bold;
      font-size: 14px;
      margin-top: 6px;
    }
    .card-description {
      font-size: 13px;
      color: #555;
      margin-top: 8px;
    }
  `;

  return (
    <div className="container py-5">
      <style>{styles}</style>
      <div className="section-heading">💰 Top 30 Budget Deals</div>
      <div className="grid">
        {products.length > 0 ? (
          products.map(product => (
            <div className="card" key={product.id}>
              <img src={product.image || 'https://via.placeholder.com/300x240?text=No+Image'} alt={product.name} />
              <div className="card-body">
                <div className="card-title">{product.name}</div>
                <div className="card-price">₹{product.price?.toFixed(2)}</div>
                {product.discount && <div className="card-discount">💸 {product.discount}% OFF</div>}
                {product.description && <div className="card-description">{product.description}</div>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100 mt-4">Loading deals or no deals found.</p>
        )}
      </div>
    </div>
  );
};

export default Deals;
