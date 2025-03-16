"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useTranslations } from 'next-intl';

import ServiceAgreementModal from '@/components/ServiceAgreementModal';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';

// Signup schema validation
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignUpFormInputs = z.infer<typeof signupSchema>;

// Track initialization to prevent multiple runs
let codeRun = false;

function PageSignUp() {
  const t = useTranslations('Index');
  const tSignup = useTranslations('signup');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  // Navigation state
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  
  // User state
  const [showAgreement, setShowAgreement] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!codeRun) {
      codeRun = true;
    }
  }, []);

  const onFormSubmit = async (formData: SignUpFormInputs) => {
    try {
      const res = await axios.post("/api/keycloak/users/qrcode", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        qrCode: token,
      });
      
      toast.success(tSignup('registrationSuccessful'));
      router.push('/auth/signin');
      
    } catch (error) {
      console.error('Error signing up or Invalid QR Code:', error);
      toast.error(tSignup('errorSigningUp'));
      setError(tSignup('tryAgainLater'));
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
       
        
        {!showAgreement && (
          <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                {tSignup('createAccount')}
              </h1>
              
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-light text-gray-900">
                    {tSignup('firstName')}
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                    placeholder={tSignup('firstNamePlaceholder')}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-light text-gray-900">
                    {tSignup('lastName')}
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                    placeholder={tSignup('lastNamePlaceholder')}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

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
                    placeholder={tSignup('createPasswordPlaceholder')}
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-light text-gray-900">
                    {tSignup('confirmPassword')}
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    id="confirmPassword"
                    placeholder={tSignup('confirmPasswordPlaceholder')}
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                    style={{ background: '#F9FAFB' }}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <button type="submit" className="btn-primary bg-[#2ae8d3] w-full">
                  {tSignup('signUp')}
                </button>

                <p className="text-sm font-light text-gray-700">
                  {tSignup('alreadyHaveAccount')}{' '}
                  <Link href="/auth/signin" className="font-medium text-gray-700 hover:underline">
                    {t('welcomeOrWelcomeBackPage.signIn')}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PageSignUpRoute() {
  return (
    <SuspenseWrapper>
      <PageSignUp />
    </SuspenseWrapper>
  );
}