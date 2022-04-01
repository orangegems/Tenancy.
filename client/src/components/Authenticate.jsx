import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Login.jsx';
import { Signup } from './Signup.jsx';

export function Authenticate() {
  function handleSubmit(source, data) {
    event.preventDefault();
    fetch(`/auth/${source}`, {
      method: 'POST',
      body: JSON.stringify(data),
      // Adding headers to the request
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        console.log('res --> ', res);
      })
      .catch((err) => {
        console.log('Error from hadleSubmit --> ', err);
      });
  }

  return (
    
      <div id="loginSignup">
        <Routes>
          <Route path="/" element={<Login handleSubmit={handleSubmit} />} />
          <Route path="signup" element={<Signup handleSubmit={handleSubmit} />} />
        </Routes>
      </div>
    
  );
}