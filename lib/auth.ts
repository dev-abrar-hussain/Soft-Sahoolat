import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import type { RowDataPacket } from 'mysql2/promise';
import { db } from '@/lib/db';
import type { AdminUser } from '@/lib/types';

export const SESSION_COOKIE = 'soft_admin';
const durationSeconds = 60 * 60 * 8;

function sessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(admin: AdminUser): Promise<string> {
  return new SignJWT({ username: admin.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime(`${durationSeconds}s`)
    .sign(sessionSecret());
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: durationSeconds,
  };
}

export async function sessionAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, sessionSecret());
    const id = Number(verified.payload.sub);
    if (!Number.isInteger(id) || id < 1) return null;
    const [rows] = await db().query<(AdminUser & RowDataPacket)[]>(
      'SELECT id, username, must_change_password, last_login_at FROM admins WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function requireAdmin(allowPasswordChange = false): Promise<AdminUser> {
  const admin = await sessionAdmin();
  if (!admin) redirect('/admin/login');
  if (!allowPasswordChange && admin.must_change_password === 1) redirect('/admin/account');
  return admin;
}

export async function mutationIsSameOrigin(request: Request): Promise<boolean> {
  const expected = (process.env.APP_URL || 'https://soft.sahoolat.pk').replace(/\/$/, '');
  return request.headers.get('origin') === expected;
}

