import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なパスのパターン
const PROTECTED_PATHS = ['/admin', '/dashboard'];

// 環境変数に保存された認証情報
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'password';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 保護されたパスかどうかチェック
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isProtectedPath) {
    // Basic認証ヘッダーの取得
    const authHeader = request.headers.get('authorization');
    
    if (authHeader) {
      // Basic認証のデコード
      const authValue = authHeader.split(' ')[1];
      const [username, password] = atob(authValue).split(':');
      
      // 認証情報の検証
      if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
        return NextResponse.next();
      }
    }
    
    // 認証失敗時のレスポンス
    const response = new NextResponse('認証が必要です', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
