'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import axios from 'axios';

export default function ValidatePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const router = useRouter();
  const { data: session } = useSession();

  // States for token, loading, and agreement acceptance
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false);

  // State to control when to show the Service Agreement Modal.
  const [showAgreement, setShowAgreement] = useState<boolean>(false);
  const [targetRoute, ] = useState<string>("/");

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      console.warn("[VALIDATION] No token provided in URL parameters.");
      return;
    }
    console.log("[VALIDATION] Starting token validation for token:", token);
    const validateToken = async () => {
      try {
        const res = await axios.get(`/api/validate?token=${token}`);
        console.log("[VALIDATION] Token validation response:", res.data);
        setIsTokenValid(res.data.valid);
      } catch (error) {
        console.error("[VALIDATION] Error validating token:", error);
        setIsTokenValid(false);
      } finally {
        setLoading(false);
        console.log("[VALIDATION] Loading state set to false.");
      }
    };
    validateToken();
  }, [token]);

  // Handler for when the service agreement is accepted.
  // It sets agreementAccepted, hides the modal, and pushes the target route.
  const handleAgreementAccept = async () => {
    if (!session?.user) {
      console.warn("[AGREEMENT] No session user available on agreement acceptance.");
      return;
    }
    console.log("[AGREEMENT] Service agreement accepted.");
    setAgreementAccepted(true);
    setShowAgreement(false);
    console.log("[AGREEMENT] Agreement accepted, redirecting to", targetRoute);
    console.log("[AGREEMENT] Session email:", session?.user?.email, "QR code:", token);
    try {
      console.log("[AGREEMENT] Sending registration request to backend.");
      const res = await axios.post(`/api/keycloak/users/qrcode`, {
        email: session.user.email,
        password: 'default-password',
        qrCode: token,
      });
      console.log("[AGREEMENT] Registration successful. Response:", res.data);
      alert('Registration successful!');
    } catch (error) {
      console.error('[AGREEMENT] Error signing up or Invalid QR Code:', error);
      alert('Error signing up or Invalid QR Code:');
    }
  };

  // Automatic redirection logic for users.
  useEffect(() => {
    console.log("[REDIRECT] Checking redirection conditions:", { loading, isTokenValid, session, agreementAccepted });
    if (!loading && isTokenValid) {
      if (session && !agreementAccepted) {
        console.log("[REDIRECT] Session exists but agreement not accepted. Showing service agreement modal.");
        setShowAgreement(true);
      } else if (session && agreementAccepted) {
        console.log("[REDIRECT] Session exists and agreement accepted. Redirecting to dashboard...");
        // Implement dashboard redirection logic here if needed
      }
    }
  }, [loading, isTokenValid, session, agreementAccepted, router]);

  // Once the session is available and the agreement is accepted,
  // retrieve the session email and qrcode, and log them.
  useEffect(() => {
    if (session && agreementAccepted) {
      const email = session.user?.email;
      const qrcode = token;
      console.log("[SESSION] Agreement accepted and session active. Email:", email, "QR code:", qrcode);
      // Later, you can send this data to your backend server.
    }
  }, [session, agreementAccepted]);

  if (loading) {
    console.log("[RENDER] Loading state active. Rendering loading component.");
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isTokenValid) {
    console.log("[RENDER] Invalid token. Rendering error message.");
    return (
      <div className="flex items-center justify-center h-screen">
        Invalid or expired token.
      </div>
    );
  }

  // Render Service Agreement Modal if showAgreement is true.
  if (showAgreement) {
    console.log("[RENDER] Showing Service Agreement Modal.");
    return <ServiceAgreementModal onAccept={handleAgreementAccept} />;
  }

  // Render Sign In / Sign Up options for non-session users.
  if (!session) {
    console.log("[RENDER] No session detected. Rendering Sign In/Sign Up options.");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Welcome to Gutricious</h1>
        <p className="mb-4">Please choose an option to continue:</p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              console.log("[NAVIGATION] Redirecting to Sign In with token:", token);
              router.push(`/auth/signin?token=${token}`);
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              console.log("[NAVIGATION] Redirecting to Sign Up with token:", token);
              router.push(`/auth/signup?token=${token}`);
            }}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  console.log("[RENDER] Default render path reached. No additional UI to display.");
  // When a session exists or other redirection is handled, render nothing.
  return null;
}
