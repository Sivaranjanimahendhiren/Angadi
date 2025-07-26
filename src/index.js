import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

// ✅ AWS Amplify Setup
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';
Amplify.configure(awsExports);

// ✅ Global Styling (Optional Enhancements)
document.documentElement.style.scrollBehavior = 'smooth';
document.body.style.margin = '0';
document.body.style.backgroundColor = '#f9f9f9';
document.body.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;

// ✅ Mount React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
