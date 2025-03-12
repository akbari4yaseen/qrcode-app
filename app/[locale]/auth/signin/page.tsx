"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useTranslations } from 'next-intl';

import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';

// Login schema validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 8 characters long'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LOGIN_REDIRECT_PATH = '/documents';
const ERROR_MESSAGES: Partial<Record<string, string>> = {
  CREDENTIALS_NOT_FOUND: 'The email or password provided is incorrect',
  INCORRECT_EMAIL_PASSWORD: 'The email or password provided is incorrect',
  USER_MISSING_PASSWORD: 'This account appears to be using a social login method, please sign in using that method',
  INCORRECT_TWO_FACTOR_CODE: 'The two-factor authentication code provided is incorrect',
  INCORRECT_TWO_FACTOR_BACKUP_CODE: 'The backup code provided is incorrect',
  UNVERIFIED_EMAIL: 'This account has not been verified. Please verify your account before signing in.',
};

// Track initialization to prevent multiple runs
let codeRun = false;

function PageLogin() {
  const t = useTranslations('Index');
  const tLogin = useTranslations('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  // Navigation state
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  
  // User state
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [showAgreement, setShowAgreement] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!codeRun) {
      codeRun = true;

      if (typeof window !== "undefined") {
        const isReturningUser = window.localStorage.getItem('hasVisitedBefore2');
        setWelcomeBack(!!isReturningUser);
        if (!isReturningUser) {
          window.localStorage.setItem('hasVisitedBefore2', 'true');
        }
      }
    }
  }, []);

  const onFormSubmit = async ({ email, password }: LoginFormInputs) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        inapp: false,
        callbackUrl: LOGIN_REDIRECT_PATH,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = ERROR_MESSAGES[result.error] || 'An unknown error occurred';

        if (result.error === 'UNVERIFIED_EMAIL') {
          router.push(`/unverified-account`);
        }

        toast.error(tLogin('unableToSignIn'));

        setError(errorMessage);
        return;
      }

      if (!result?.url) {
        throw new Error('An unknown error occurred');
      }

      // Process QR code if token exists
      if (token) {
        try {
          const res = await axios.post("/api/keycloak/users/qrcode", {
            email,
            password,
            qrCode: token,
          });
          console.log("Sign up response:", res.data);
          alert(tLogin('registrationSuccessful'));
        } catch (error) {
          console.error('Error signing up or Invalid QR Code:', error);
          alert(tLogin('errorSigningUp'));
          return;
        }
      }

      router.push(result.url);

    } catch (err) {
      toast(tLogin('unknownError'));
      setError(tLogin('unknownErrorTryAgain'));
    }
  };

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
        {showAgreement && (
          <ServiceAgreementModal onAccept={() => setShowAgreement(false)} />
        )}
        
        {!showAgreement && (
          <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                {welcomeBack ? t('welcomeBack') : t('welcome')}
              </h1>
              
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-light text-gray-900">
                    {t('welcomeOrWelcomeBackPage.yourEmail')}
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                    placeholder={t('welcomeOrWelcomeBackPage.emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-light text-gray-900">
                    {t('welcomeOrWelcomeBackPage.password')}
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    placeholder={t('welcomeOrWelcomeBackPage.passwordPlaceholder')}
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <div className="flex items-center justify-between">
                  <div></div>
                  <Link href="/auth/signup" tabIndex={-1} className="text-gray-700 hover:underline text-sm font-medium">
                    {tLogin('noAccount')}
                  </Link>
                </div>

                <button type="submit" className="btn-primary bg-[#2ae8d3] w-full">
                  {t('welcomeOrWelcomeBackPage.signIn')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PageLoginRoute() {
  return (
    <SuspenseWrapper>
      <PageLogin />
    </SuspenseWrapper>
  );
}