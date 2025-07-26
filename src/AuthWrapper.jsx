// AuthWrapper.jsx
import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router } from 'react-router-dom';
import awsconfig from './aws-exports';
import App from './App';

// Configure Amplify
Amplify.configure(awsconfig);

const AuthWrapper = () => {
  return (
    <Authenticator
      initialState="signUp"
      variation="modal"
      formFields={{
        signUp: {
          name: {
            placeholder: 'Enter your Full Name',
            label: 'Full Name',
            isRequired: true,
          },
          birthdate: {
            placeholder: 'dd-mm-yyyy',
            label: 'Birthdate',
            isRequired: false,
          },
          gender: {
            placeholder: 'e.g., Male / Female / Other',
            label: 'Gender',
            isRequired: false,
          },
          address: {
            placeholder: 'Enter your Address',
            label: 'Address',
            isRequired: false,
          },
          age: {
            placeholder: 'Enter your Age',
            label: 'Age',
            isRequired: false,
          },
          phone_number: {
            placeholder: 'Enter your Phone Number',
            label: 'Phone Number',
            isRequired: true,
          },
          email: {
            placeholder: 'Enter your Email',
            label: 'Email',
            isRequired: true,
          },
          password: {
            placeholder: 'Enter your Password',
            label: 'Password',
            isRequired: true,
          },
          confirm_password: {
            placeholder: 'Please confirm your Password',
            label: 'Confirm Password',
            isRequired: true,
          },
          picture: {
            placeholder: 'Enter Profile Picture URL (optional)',
            label: 'Profile Picture URL',
            isRequired: false,
          },
        },
      }}
      components={{
        Header() {
          return (
            <div className="auth-header text-center mb-4">
              <h2 className="text-primary">✨ Welcome to Angadi ✨</h2>
              <p className="text-muted">Create your glittery account 🌸</p>
            </div>
          );
        },
        Footer() {
          return (
            <div className="text-center py-3 text-muted">
              <small>💖 Powered by AWS Amplify 💖</small>
            </div>
          );
        },
      }}
    >
      {({ signOut, user }) => (
        <Router>
          <App signOut={signOut} user={user} />
        </Router>
      )}
    </Authenticator>
  );
};

export default AuthWrapper;
