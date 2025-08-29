import { NextResponse, type NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'pt-BR', 'es'];
const defaultLocale = 'pt-BR';

function getLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
  // Vercel recommends this to avoid issues with middleware.
  // source: https://vercel.com/docs/functions/edge-functions/edge-functions-and-nodejs
  unstable_allowDynamic: [
    '**/node_modules/negotiator/index.js',
    '**/node_modules/@formatjs/intl-localematcher/index.js'
  ]
};