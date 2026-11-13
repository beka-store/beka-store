import type { UserProfile } from '@/types';

export const OWNER_EMAIL = 'abobaker096605@gmail.com';
export const OWNER_PHONE = '0114071454';

export function isOwnerProfile(profile: Pick<UserProfile, 'email' | 'phone'> | null): boolean {
  return profile?.email === OWNER_EMAIL && profile.phone === OWNER_PHONE;
}
