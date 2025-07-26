

import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports.js';
import { getUrl } from '@aws-amplify/storage';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Blogs from './pages/Blogs.jsx';
import Orders from './pages/Orders.jsx';
import Checkout from './pages/Checkout.jsx';
import Wishlist from './pages/WishList.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';
import ProductForm from './components/ProductForm.jsx'; // ✅ This is correct
import Contact from './components/Contact.jsx';
import Category from './components/Category.jsx';
import Deals from './components/Deals.jsx';
import RecommendedSection from './components/RecommendedSection.jsx';

Amplify.configure(awsconfig);

const theme = {
  name: 'angadiTheme',
  tokens: {
    colors: {
      brand: { primary: { value: '#ff7f50' }, secondary: { value: '#ffb84d' } },
      background: { primary: { value: '#fff7f2' }, secondary: { value: '#ffe8d6' } },
    },
  },
};

const SidebarButton = ({ children, onClick }) => (
  <button className="btn btn-outline-dark w-100 mb-2" onClick={onClick}>{children}</button>
);

const AuthScreen = ({ signOut, user }) => {
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const attrs = user?.attributes || {};

  useEffect(() => {
    if (user?.username) {
      const key = `profile-pictures/${user.username}.jpg`;
      getUrl({ key, options: { accessLevel: 'protected' } })
        .then(({ url }) => setProfilePicUrl(url))
        .catch(() => {
          const stored = localStorage.getItem(`profilePicUrl-${user.username}`);
          if (stored) setProfilePicUrl(stored);
        });
    }
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      return exist
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          )
        : [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
<>
  <style>{`
    :root {
      --brand-color: #6b4f3f;
      --accent-color: #ffb84d;
    }

    body, .navbar, .nav-link, .btn, .form-control, select {
      font-family: 'Segoe UI', Roboto, sans-serif !important;
    }

    .navbar {
      background: #fff !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      z-index: 1000;
    }

    .navbar-brand {
      font-size: 1.8rem;
      color: var(--brand-color) !important;
      font-weight: bold;
    }

    .nav-link {
      color: #333;
      font-size: 1rem;
      margin-right: 12px;
    }

    .nav-link.active,
    .nav-link:hover {
      color: var(--accent-color) !important;
      text-decoration: underline;
    }

    .btn-brand {
      background-color: var(--accent-color);
      color: #000;
      font-weight: 500;
    }

    .btn-brand:hover {
      background-color: #e6a737;
    }

    .cart-icon {
      position: relative;
    }

    .cart-count {
      background: red;
      color: white;
      font-size: 0.7rem;
      border-radius: 50%;
      padding: 2px 6px;
      position: absolute;
      top: -5px;
      right: -10px;
    }
  `}</style>

  {/* FIRST NAVBAR (User Icon, Brand, Nav Links) */}
  <nav className="navbar navbar-expand-lg px-3 py-3 shadow-sm rounded-0 border-bottom">
    <div className="container-fluid">
      {/* Sidebar Avatar Trigger */}
      <button
        className="btn p-0 border-0 me-3"
        onClick={() => setSidebarOpen(true)}
        title="Toggle Sidebar"
        aria-label="User Sidebar"
      >
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt="User"
            className="rounded-circle"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        ) : (
          <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 36, height: 36 }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Brand */}
      <Link className="navbar-brand text-uppercase" to="/">Angadi</Link>

      {/* Mobile Toggler */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu Items */}
      <div className="collapse navbar-collapse" id="mainNavbar">
        <div className="navbar-nav align-items-center ms-auto gap-2">
          <Link to="/" className="nav-link">🏠 Home</Link>
          <Link to="/category" className="nav-link">📂 Categories</Link>
          <Link to="/deals" className="nav-link">🔥 Deals</Link>
          <Link to="/recommendedsection" className="nav-link">✨ Recommended</Link>
          <Link to="/contact" className="nav-link">📞 Contact</Link>
          <Link to="/blogs" className="nav-link"> Blogs</Link>
          <Link to="/add-product" className="btn btn-brand ms-2">➕ Add Product</Link>
          <Link to="/Login" className="btn btn-outline-dark ms-2">🔐 Login</Link>
        </div>
      </div>
    </div>
  </nav>

  {/* SECOND NAVBAR (Search and Sort) */}
  <nav className="navbar px-3 py-2 shadow-sm rounded-0 border-bottom">
    <div className="container-fluid justify-content-between flex-wrap">
      {/* Search */}
      <form className="d-flex my-2" onSubmit={(e) => e.preventDefault()}>
        <input
          className="form-control me-2 shadow-sm rounded-pill"
          type="search"
          placeholder="Search products, brands and more"
          style={{ minWidth: '260px' }}
        />
        <button className="btn btn-brand shadow-sm rounded-pill" type="submit">
          Search
        </button>
      </form>

      {/* Sort Dropdown */}
      <div className="d-flex align-items-center gap-2 my-2">
        <select className="form-select shadow-sm rounded-pill">
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  </nav>

      {isSidebarOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000 }} onClick={() => setSidebarOpen(false)} />
          <div className="bg-light p-3" style={{ position: 'fixed', top: 0, left: 0, width: 260, height: '100vh', zIndex: 1001 }}>
            <h5>Your Profile</h5>
            <ul className="list-unstyled small">
              {Object.entries(attrs).map(([k, v]) => (
                <li key={k}><strong>{k.replace('custom:', '')}:</strong> {v}</li>
              ))}
            </ul>
            <SidebarButton onClick={() => handleNavigation('/profile')}>👤 Profile</SidebarButton>
            <SidebarButton onClick={() => handleNavigation('/cart')}>🛒 Cart</SidebarButton>
            <SidebarButton onClick={() => handleNavigation('/wishlist')}>💖 Wishlist</SidebarButton>
            <SidebarButton onClick={() => handleNavigation('/orders')}>📦 Orders</SidebarButton>
            <SidebarButton onClick={() => handleNavigation('/track')}>🚚 Track Order</SidebarButton>
            <button className="btn btn-danger w-100 mt-3" onClick={signOut}>Sign Out</button>
          </div>
        </>
      )}

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/product/:productId" element={<ProductDetails onAddToCart={handleAddToCart} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/recommendedsection" element={<RecommendedSection />} />
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} /> {/* ✅ Category route */}
          <Route path="/deals" element={<Deals />} />
          <Route path="/blogs" element={<Blogs />} />

        </Routes>
      </div>
    </>
  );
};

export default function AppWrapper() {
  return (
    <Authenticator
      loginMechanisms={['phone_number']}
      defaultCountryCode="IN"
      variation="default"
      theme={theme}
      formFields={{
        signIn: {
          phone_number: {
            label: '📱 Mobile Number',
            placeholder: 'Enter mobile number',
            isRequired: true,
          },
        },
        signUp: {
          name: { label: '📝 Full Name', placeholder: 'Your name', isRequired: true },
          phone_number: { label: '📞 Mobile Number', placeholder: 'Enter phone number', isRequired: true },
          email: { label: '📧 Email', placeholder: 'Optional email', isRequired: false },
          birthdate: { label: '🎂 Birthdate', placeholder: 'YYYY-MM-DD', isRequired: false },
          gender: { label: '⚥ Gender', isRequired: false },
          address: { label: '🏠 Address', isRequired: false },
          age: { label: '🎈 Age', isRequired: false },
          picture: { label: '🖼️ Profile Picture URL', isRequired: false },
        },
        confirmSignUp: {
          confirmation_code: {
            label: '🔢 OTP',
            placeholder: 'Enter the OTP received',
            isRequired: true,
          },
        },
      }}
      components={{
        Header: () => (
          <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff7f50, #ffb84d)' }}>
            <div style={{ flex: 1, padding: 40, animation: 'fadeIn 1s ease' }}>
              <h1 style={{ color: '#fff', fontSize: '2.5rem' }}>✨ Welcome Back!</h1>
              <p style={{ color: '#fff', fontSize: '1.1rem' }}>Shop your favorites with style 😍</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '0 20px 20px 0', padding: 40, boxShadow: '0 0 20px rgba(0,0,0,0.1)', animation: 'slideIn 0.8s ease' }}>
              <h2 style={{ color: '#ff7f50', marginBottom: 20 }}>Sign in to Angadi</h2>
            </div>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px) } to { opacity:1; transform: translateY(0) } }
              @keyframes slideIn { from { opacity: 0; transform: translateX(100px) } to { opacity:1; transform: translateX(0) } }
            `}</style>
          </div>
        ),
        Footer: () => (
          <div className="text-center py-3 text-muted">
            <small>💖 Powered by your friendly marketplace</small>
          </div>
        ),
      }}
    >
      {({ signOut, user }) => (
        <Router>
          <AuthScreen signOut={signOut} user={user} />
        </Router>
      )}
    </Authenticator>
  );
}
