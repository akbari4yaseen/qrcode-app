
import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';


export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    
    // Handle internationalization
    const handleI18n = createMiddleware({
        locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt'],
        defaultLocale: 'en'
    });

    return handleI18n(new NextRequest(url, request));
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] // Ensuring the matcher excludes specific paths
};