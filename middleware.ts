import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'; // ต้องลง npm install uuid

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  let guestId = request.cookies.get('guest-id')?.value
  if (!guestId) {
    guestId = uuidv4()
    // เซ็ต Cookie ให้ Browser จำไว้ (อยู่ได้นาน 1 ปี)
    response.cookies.set('guest-id', guestId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true, // ป้องกัน XSS
    })
  }

  return response
}