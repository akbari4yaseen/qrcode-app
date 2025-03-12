'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import SuspenseWrapper from '@/components/SuspenseWrapper';

function ValidatePage() {
  const t = useTranslations('validation');
  const params = useParams<{ token: string }>();
  const token = params.token;
  const router = useRouter();
  const { data: session } = useSession();

  // Navigation state (to match other pages)
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);

  // Original states maintained
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false);
  const [showAgreement, setShowAgreement] = useState<boolean>(false);
  const [targetRoute, ] = useState<string>("/");

  // Validate token on mount - original logic preserved
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

  // Original handler for agreement acceptance
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
      alert(t('registrationSuccessful'));
    } catch (error) {
      console.error('[AGREEMENT] Error signing up or Invalid QR Code:', error);
      alert(t('errorSigningUp'));
    }
  };

  // Original redirection logic
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

  // Original session and agreement tracking
  useEffect(() => {
    if (session && agreementAccepted) {
      const email = session.user?.email;
      const qrcode = token;
      console.log("[SESSION] Agreement accepted and session active. Email:", email, "QR code:", qrcode);
      // Later, you can send this data to your backend server.
    }
  }, [session, agreementAccepted, token]);

  // Render common wrapper for consistent layout
  const renderPageContainer = (content: React.ReactNode) => {
    return (
      <section>
        <div className='custom-container'>
          <Navigation 
            navOpen={navOpen} 
            langOpen={langOpen} 
            setLangOpen={setLangOpen} 
            setNavOpen={setNavOpen} 
            isHovered={isHovered} 
            setIsHovered={setIsHovered} 
            isLangBtnHovered={isLangBtnHovered} 
            setIsLangBtnHovered={setIsLangBtnHovered} 
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-[50px] px-6 py-8 mx-auto lg:py-0 cera-pro-font no-65">
          {content}
        </div>
      </section>
    );
  };

  // Loading state
  if (loading) {
    console.log("[RENDER] Loading state active. Rendering loading component.");
    return renderPageContainer(
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-[#2ae8d3] border-r-[#2ae8d3] border-b-gray-200 border-l-gray-200 animate-spin"></div>
          <p className="text-gray-700 mt-4">{t('validatingToken')}</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    console.log("[RENDER] Invalid token. Rendering error message.");
    return renderPageContainer(
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">×</div>
          <h2 className="text-xl font-bold text-gray-900">{t('invalidToken')}</h2>
          <p className="text-gray-700 mb-4">{t('tokenExpired')}</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary bg-[#2ae8d3] w-full"
          >
            {t('returnToHome')}
          </button>
        </div>
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
    return renderPageContainer(
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            {t('welcome')}
          </h1>
          <p className="text-center text-gray-700 mb-6">{t('chooseContinue')}</p>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                console.log("[NAVIGATION] Redirecting to Sign In with token:", token);
                router.push(`/auth/signin?token=${token}`);
              }}
              className="btn-primary bg-[#2ae8d3] w-full"
            >
              {t('signIn')}
            </button>
            
            <button
              onClick={() => {
                console.log("[NAVIGATION] Redirecting to Sign Up with token:", token);
                router.push(`/auth/signup?token=${token}`);
              }}
              className="w-full border border-gray-300 text-gray-700 p-2.5 rounded-lg hover:bg-gray-50"
            >
              {t('signUp')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("[RENDER] Default render path reached. No additional UI to display.");
  // When a session exists or other redirection is handled, render nothing.
  return null;
}

export default function ValidatePageRoute() {
  return (
    <SuspenseWrapper>
      <ValidatePage />
    </SuspenseWrapper>
  );
}