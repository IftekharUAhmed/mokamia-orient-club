 import { NextResponse } from 'next/server';

export function middleware(request) {
  // ১. ইউজারের ব্রাউজার থেকে 'moc_session' নামের চাবিটা (Cookie) খুঁজো
  const hasSession = request.cookies.get('moc_session');

  // ২. কেউ যদি সরাসরি /portal-এ যেতে চায়...
  if (request.nextUrl.pathname.startsWith('/portal')) {
    
    // ৩. এবং তার কাছে যদি চাবি না থাকে...
    if (!hasSession) {
      // ঘাড় ধরে /login পেজে পাঠিয়ে দাও!
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // চাবি থাকলে ভেতরে ঢুকতে দাও
  return NextResponse.next();
}