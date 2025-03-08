'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import axios from 'axios';

export default function SignInPage() {
  const [showAgreement, setShowAgreement] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      console.error('Error signing in:', result.error);
      // Optionally, display an error message.
    } else {
      try {
        const res = await axios.post("/api/keycloak/users/qrcode", {
          email,
          password,
          qrCode: token,
        });
        console.log("Sign up response:", res.data);
        // Show a success alert
        alert('Registration successful!');
      } catch (error) {
        console.error('Error signing up or Invalid QR Code:', error);
        alert('Error signing up or Invalid QR Code');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {showAgreement && (
        <ServiceAgreementModal onAccept={() => setShowAgreement(false)} />
      )}
      {!showAgreement && (
        <div className="bg-white text-black p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full border border-gray-300 p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
