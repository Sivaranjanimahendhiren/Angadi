import React, { useState } from 'react';

function ProductCard({ product, onBid }) {
  const [wishlisted, setWishlisted] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    return saved.some((item) => item.productId === product.id);
  });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const exists = cart.find((item) => item.productId === product.id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    alert('✅ Added to cart!');
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    alert('✅ Order placed!');
    window.location.href = '/orders';
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const isInWishlist = saved.some((item) => item.productId === product.id);
    const updated = isInWishlist
      ? saved.filter((item) => item.productId !== product.id)
      : [...saved, { productId: product.id, name: product.title, image: product.image }];
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : '/placeholder-image.png';

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
    >
      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 text-xl text-red-500 z-10"
        onClick={handleWishlistToggle}
      >
        <i className={`bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>

      {/* Image */}
      <div className="bg-gray-100 flex items-center justify-center h-48">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full object-contain p-3"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
          <p className="text-green-600 font-bold mt-1">₹{product.price?.toFixed(2) ?? '0.00'}</p>
          {product.discountPercentage && (
            <span className="text-yellow-700 text-sm font-medium">
              💸 {product.discountPercentage}% OFF
            </span>
          )}
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {product.description || 'No description available.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between items-center space-x-2">
          <button
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600"
            onClick={handleAddToCart}
          >
            🛒
          </button>
          <button
            className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full hover:bg-yellow-600"
            onClick={(e) => { e.stopPropagation(); onBid?.(product); }}
          >
            📤
          </button>
          <button
            className="bg-green-500 text-white text-sm px-3 py-1 rounded-full hover:bg-green-600"
            onClick={handleBuyNow}
          >
            ⚡
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
