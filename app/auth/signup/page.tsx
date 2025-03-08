'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import axios from 'axios';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [showAgreement, setShowAgreement] = useState<boolean>(true);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post("/api/keycloak/users/qrcode", {
        email: formData.email,
        password: formData.password,
        qrCode: token,
      });
      console.log("Sign up response:", res.data);
      // Show a success alert
      alert('Registration successful!');
    } catch (error) {
      console.error('Error signing up or Invalid QR Code:', error);
      alert('Error signing up or Invalid QR Code:');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {showAgreement && (
        <ServiceAgreementModal onAccept={() => setShowAgreement(false)} />
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full border border-gray-300 p-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="w-full border border-gray-300 p-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="w-full border border-gray-300 p-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
