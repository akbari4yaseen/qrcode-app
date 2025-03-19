"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';

// Create a schema for address fields
const addressSchema = z.object({
  streetLine1: z.string().min(1, 'Street address is required'),
  streetLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

// Extend the main sign-up schema to include address fields
const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    shippingAddress: addressSchema,
    // Billing address is optional – you can require it conditionally based on UI state.
    billingAddress: addressSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormInputs = z.infer<typeof signupSchema>;

function PageSignUp() {
  const t = useTranslations('Index');
  const tSignup = useTranslations('signup');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Initialize useForm at the top level
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  // Navigation state
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);

  // Billing address toggle state
  const [billingDifferent, setBillingDifferent] = useState(false);

  // User error state
  const [error, setError] = useState<string | null>(null);

  // Token validation state
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(token ? null : true);
  const [loading, setLoading] = useState<boolean>(token ? true : false);

  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          const res = await axios.get(`/api/validate?token=${token}`);
          setIsTokenValid(res.data.valid);
        } catch (error) {
          setIsTokenValid(false);
        } finally {
          setLoading(false);
        }
      };
      validateToken();
    }
  }, [token]);

  // Render a spinner if token is loading
  if (token && loading) {
    return (
      <section>
        <div className="custom-container">
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
        <div className="flex flex-col items-center justify-center mt-[50px] px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-xl sm:max-w-md xl:p-0">
            <div className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-[#2ae8d3] border-r-[#2ae8d3] border-b-gray-200 border-l-gray-200 animate-spin"></div>
              <p className="text-gray-700 mt-4">Validating token...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If token exists and is invalid, render an error message
  if (token && !loading && !isTokenValid) {
    return (
      <section>
        <div className="custom-container">
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
        <div className="flex flex-col items-center justify-center mt-[50px] px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow-xl sm:max-w-md xl:p-0">
            <div className="p-6 text-center space-y-4">
              <div className="text-red-500 text-5xl mb-4">×</div>
              <h2 className="text-xl font-bold text-gray-900">Invalid Token</h2>
              <p className="text-gray-700 mb-4">The token provided is invalid or has expired.</p>
              <button onClick={() => router.push('/validate')} className="btn-primary bg-[#2ae8d3] w-full">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const onFormSubmit = async (formData: SignUpFormInputs) => {
    try {
      // Adjust your payload as needed. If billing address is not provided,
      // you might want to send the shipping address or handle it on the backend.
      const res = await axios.post("/api/keycloak/users/qrcode", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        qrCode: token,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress,
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
        <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {tSignup('createAccount')}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
              {/* User fields */}
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-light text-gray-900">
                  {tSignup('firstName')}
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  placeholder={tSignup('firstNamePlaceholder')}
                  className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                  style={{ background: '#F9FAFB' }}
                />
                {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-light text-gray-900">
                  {tSignup('lastName')}
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  placeholder={tSignup('lastNamePlaceholder')}
                  className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                  style={{ background: '#F9FAFB' }}
                />
                {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-light text-gray-900">
                  {t('welcomeOrWelcomeBackPage.yourEmail')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder={t('welcomeOrWelcomeBackPage.emailPlaceholder')}
                  className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black placeholder:text-gray-500"
                  style={{ background: '#F9FAFB' }}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
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
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
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
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              {/* Shipping Address */}
              <fieldset className="border p-4">
                <legend className="text-lg font-semibold">{tSignup('shippingAddress')}</legend>

                <div>
                  <label htmlFor="shippingStreetLine1" className="block mb-2 text-sm font-light text-gray-900">
                    Street Address 1
                  </label>
                  <input
                    {...register('shippingAddress.streetLine1')}
                    type="text"
                    id="shippingStreetLine1"
                    placeholder="123 Main St"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.streetLine1 && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.streetLine1.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingStreetLine2" className="block mb-2 text-sm font-light text-gray-900">
                    Street Address 2
                  </label>
                  <input
                    {...register('shippingAddress.streetLine2')}
                    type="text"
                    id="shippingStreetLine2"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                </div>

                <div>
                  <label htmlFor="shippingCity" className="block mb-2 text-sm font-light text-gray-900">
                    City
                  </label>
                  <input
                    {...register('shippingAddress.city')}
                    type="text"
                    id="shippingCity"
                    placeholder="City"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.city && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingProvince" className="block mb-2 text-sm font-light text-gray-900">
                    Province
                  </label>
                  <input
                    {...register('shippingAddress.province')}
                    type="text"
                    id="shippingProvince"
                    placeholder="Province"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.province && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.province.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingPostalCode" className="block mb-2 text-sm font-light text-gray-900">
                    Postal Code
                  </label>
                  <input
                    {...register('shippingAddress.postalCode')}
                    type="text"
                    id="shippingPostalCode"
                    placeholder="Postal Code"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.postalCode && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingCountry" className="block mb-2 text-sm font-light text-gray-900">
                    Country
                  </label>
                  <input
                    {...register('shippingAddress.country')}
                    type="text"
                    id="shippingCountry"
                    placeholder="Country"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.country && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.country.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingPhoneNumber" className="block mb-2 text-sm font-light text-gray-900">
                    Phone Number
                  </label>
                  <input
                    {...register('shippingAddress.phoneNumber')}
                    type="text"
                    id="shippingPhoneNumber"
                    placeholder="Phone Number"
                    className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                  />
                  {errors.shippingAddress?.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.shippingAddress.phoneNumber.message}</p>
                  )}
                </div>
              </fieldset>

              {/* Toggle for billing address */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={billingDifferent}
                    onChange={() => setBillingDifferent(!billingDifferent)}
                    className="mr-2"
                  />
                  {tSignup('billingAddressDifferent')}
                </label>
              </div>

              {/* Billing Address (conditionally rendered) */}
              {billingDifferent && (
                <fieldset className="border p-4 mt-4">
                  <legend className="text-lg font-semibold">{tSignup('billingAddress')}</legend>

                  <div>
                    <label htmlFor="billingStreetLine1" className="block mb-2 text-sm font-light text-gray-900">
                      Street Address 1
                    </label>
                    <input
                      {...register('billingAddress.streetLine1')}
                      type="text"
                      id="billingStreetLine1"
                      placeholder="123 Main St"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.streetLine1 && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.streetLine1.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingStreetLine2" className="block mb-2 text-sm font-light text-gray-900">
                      Street Address 2
                    </label>
                    <input
                      {...register('billingAddress.streetLine2')}
                      type="text"
                      id="billingStreetLine2"
                      placeholder="Apartment, suite, etc. (optional)"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="billingCity" className="block mb-2 text-sm font-light text-gray-900">
                      City
                    </label>
                    <input
                      {...register('billingAddress.city')}
                      type="text"
                      id="billingCity"
                      placeholder="City"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.city && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingProvince" className="block mb-2 text-sm font-light text-gray-900">
                      Province
                    </label>
                    <input
                      {...register('billingAddress.province')}
                      type="text"
                      id="billingProvince"
                      placeholder="Province"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.province && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.province.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingPostalCode" className="block mb-2 text-sm font-light text-gray-900">
                      Postal Code
                    </label>
                    <input
                      {...register('billingAddress.postalCode')}
                      type="text"
                      id="billingPostalCode"
                      placeholder="Postal Code"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.postalCode && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.postalCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingCountry" className="block mb-2 text-sm font-light text-gray-900">
                      Country
                    </label>
                    <input
                      {...register('billingAddress.country')}
                      type="text"
                      id="billingCountry"
                      placeholder="Country"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.country && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="billingPhoneNumber" className="block mb-2 text-sm font-light text-gray-900">
                      Phone Number
                    </label>
                    <input
                      {...register('billingAddress.phoneNumber')}
                      type="text"
                      id="billingPhoneNumber"
                      placeholder="Phone Number"
                      className="bg-gray-50 border border-gray-300 sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 text-black"
                    />
                    {errors.billingAddress?.phoneNumber && (
                      <p className="mt-2 text-sm text-red-600">{errors.billingAddress.phoneNumber.message}</p>
                    )}
                  </div>
                </fieldset>
              )}

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <button type="submit" className="btn-primary bg-[#2ae8d3] w-full">
                {tSignup('signUp')}
              </button>

              <p className="text-sm font-light text-gray-700">
                {tSignup('alreadyHaveAccount')}{' '}
                <Link href={`/auth/signin?${token}`} className="font-medium text-gray-700 hover:underline">
                  {t('welcomeOrWelcomeBackPage.signIn')}
                </Link>
              </p>
            </form>
          </div>
        </div>
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