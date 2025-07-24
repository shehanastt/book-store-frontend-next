import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const user = request.cookies.get('user')?.value

  let role = null;

  if(user){
    try{
      const parsedUser = JSON.parse(decodeURIComponent(user));
      role = parsedUser?.role;
    } catch (error) {
      console.log('error parsing user cookie:', error);
    }
  }

  const isAuthPage = pathname === '/login' || pathname === '/registration' || pathname === '/'
  const isPublicPage = pathname === '/' || isAuthPage
  const addBookPage = pathname ==='/add-book'

  //If NOT logged in and trying to access a protected route
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  //If logged in and trying to visit login or registration
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/books', request.url))
  }

  if(role === "buyer" && addBookPage ) {
    return NextResponse.redirect(new URL('/books', request.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|static|api).*)'
  ]
}


