import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createProduct } from '../graphql/mutations';

const client = generateClient();

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    discount: '',
    category: '',
    stock: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const input = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
      discount: parseFloat(formData.discount) || 0,
      category: formData.category.trim().toLowerCase() || 'others',
      stock: parseInt(formData.stock) || 0,
    };

    if (!input.name || isNaN(input.price) || !input.image || !input.category) {
      setErrorMessage('❌ Please fill all required fields properly.');
      return;
    }

    try {
      const result = await client.graphql({
        query: createProduct,
        variables: { input },
      });

      console.log('✅ Product added:', result);
      setSuccessMessage('✅ Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        discount: '',
        category: '',
        stock: '',
      });
    } catch (error) {
      console.error('❌ Error creating product:', JSON.stringify(error, null, 2));
      setErrorMessage('❌ Failed to add product. Please check your network or schema.');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">➕ Add New Product</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        {[
          { label: 'Product Name', name: 'name' },
          { label: 'Description', name: 'description' },
          { label: 'Price (₹)', name: 'price', type: 'number', step: '0.01' },
          { label: 'Image URL', name: 'image' },
          { label: 'Discount (%)', name: 'discount', type: 'number', step: '0.01' },
          { label: 'Stock Quantity', name: 'stock', type: 'number' },
        ].map(({ label, name, type = 'text', step }) => (
          <div className="mb-3" key={name}>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
              type={type}
              step={step}
              className="form-control"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={name !== 'description' && name !== 'discount'}
            />
          </div>
        ))}

        {/* Category Dropdown */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="women">👩 Women</option>
            <option value="men">👨 Men</option>
            <option value="kids">🧒 Kids</option>
            <option value="accessories">🎒 Accessories</option>
            <option value="others">📦 Others</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          🚀 Submit Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
