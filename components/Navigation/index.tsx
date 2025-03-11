import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import './navigation.css';
import { routes } from '@/utils/routes';
import { IMAGE_URL } from '@/utils/image_url';
import { CiGlobe } from 'react-icons/ci';
import { Popover } from 'react-tiny-popover';
import { useState, useTransition } from 'react';
import { languages } from '@/utils/languages';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { usePathname } from 'next/navigation';

// Add language types and constants
type LocalActiveType = string;

const { Link: IntlLink, useRouter: useIntlRouter } = createSharedPathnamesNavigation({ locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt'], defaultLocale: 'en' });



interface NavigationProps {
  navOpen: boolean;
  langOpen: boolean;
  setLangOpen: (value: boolean) => void;
  setNavOpen: (value: boolean) => void;
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  isLangBtnHovered: boolean;
  setIsLangBtnHovered: (value: boolean) => void;
  locale?: string;
  changeLanguage?: (locale: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  navOpen,
  langOpen,
  setLangOpen,
  setNavOpen,
  isHovered,
  setIsHovered,
  isLangBtnHovered,
  setIsLangBtnHovered,
  locale = 'en',
 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LocalActiveType>(locale);
  const pathname = usePathname();
  const intlRouter = useIntlRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Save the selected language to state
      setSelectedLanguage(newLocale);
      
      // Get the path segments
      const pathSegments = pathname.split('/');
      
      // The current locale is likely the first segment after the initial slash
      // Remove it to get the actual route path without the locale prefix
      let routePath = pathname;
      
      // Check if the first segment is a locale
      const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt'];
      if (pathSegments.length > 1 && locales.includes(pathSegments[1])) {
        // Remove the locale segment
        routePath = '/' + pathSegments.slice(2).join('/');
      }
      
      // Navigate to the same page but with the new locale
      intlRouter.replace(routePath, { locale: newLocale });
      
      // Close the language popover
      setLangOpen(false);
    });
  };


  return (
    <nav className="dark mx-auto flex w-full items-center justify-between pr-[10px] main-nav">
      <div className="relative font-extrabold text-black">
        <Image
          alt="logo"
          height={70}
          width={120}
          className="h-[110px] w-[120px] object-contain 2xl:h-[100px] 2xl:w-[150px]"
          src={`${IMAGE_URL}/assets/day/logo.webp`}
        />
        <div
          className="absolute top-0 z-20 h-full w-full cursor-pointer rounded-full"
          onClick={() => {}}
        ></div>
      </div>

      <div className="mr-[10px] flex items-center gap-[25px]">
        {/* Language Selector */}
        <Popover
          isOpen={langOpen}
          positions={['left', 'top']}
          padding={10}
          onClickOutside={() => setLangOpen(false)}
          content={() => (
            <div className="languages-box" onClick={() => setLangOpen(false)}>
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span>{lang.label}</span>
                  <svg
                    height="1em"
                    viewBox="0 0 24 24"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M20.54 7.225 9.58 18.185l-6.12-6.12 1.415-1.414 4.705 4.706 9.546-9.546z"
                    ></path>
                  </svg>
                </div>
              ))}
            </div>
          )}
        >
          <div className={classNames('lang-btn relative cursor-pointer', { hovered: isLangBtnHovered })}>
            <div
              className="inner-lang-btn absolute z-20 h-full w-full cursor-pointer"
              onMouseEnter={() => setIsLangBtnHovered(true)}
              onMouseLeave={() => setIsLangBtnHovered(false)}
              onClick={() => setLangOpen(!langOpen)}
            ></div>
            <CiGlobe color="#000000" />
          </div>
        </Popover>

        {/* Hamburger Menu */}
        <div className={classNames('relative', 'dark', 'hamburger-container', { navOpen })}>
          <div
            className="extra-nav absolute z-20 h-full w-full rounded-full duration-[800ms]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setNavOpen(!navOpen)}
          ></div>

          <button className={classNames('menu__icon', { 'hovered-class': isHovered || navOpen })}>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={classNames('navigation', 'dark')}>
          <input
            type="checkbox"
            className="navigation__checkbox"
            checked={navOpen}
            id="navi-toggle"
            readOnly
          />

          <div className={classNames('navigation__background', { navOpen })}>&nbsp;</div>

          <nav className="navigation__nav">
            <div className="custom-container flex min-h-[130px] items-center justify-between">
              <div></div>
              <div className={classNames('relative', 'dark', 'hamburger-container', { navOpen })}>
                <div
                  className="extra-nav absolute z-20 h-20 w-20 rounded-full duration-[800ms]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setNavOpen(!navOpen)}
                ></div>

                <button
                  className={classNames('menu__icon mr-8', {
                    'hovered-class': isHovered || navOpen,
                  })}
                >
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>

            <ul className="navigation__list flex flex-col">
              <li className="navigation__item">
                <Link href={routes[selectedLanguage]['home']} className="inline-block">
                  <span className="navigation__link">Home</span>
                </Link>
              </li>
              <li className="navigation__item">
                <Link href={routes[selectedLanguage]['about-us']} className="inline-block">
                  <span className="navigation__link">About Us</span>
                </Link>
              </li>
              <li className="navigation__item">
                <Link href={routes[selectedLanguage]['our-studies']} className="inline-block">
                  <span className="navigation__link">Our Studies</span>
                </Link>
              </li>
              <li className="navigation__item">
                <Link href={routes[selectedLanguage]['terms-of-use']} className="inline-block">
                  <span className="navigation__link">Terms of Service</span>
                </Link>
              </li>
              {routes[selectedLanguage]['cookies'] && (
                <li className="navigation__item">
                  <Link href={routes[selectedLanguage]['cookies']} className="inline-block">
                    <span className="navigation__link">Cookies Policy</span>
                  </Link>
                </li>
              )}
              <li className="navigation__item">
                <Link href={routes[selectedLanguage]['privacy']} className="inline-block">
                  <span className="navigation__link">Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};