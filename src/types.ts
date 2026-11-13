export interface Game {
  id: string;
  name_ar: string;
  name_en: string;
  accent_color: string;
  sort_order: number;
}

export interface Package {
  id: string;
  game_id: string;
  label_ar: string;
  price_sdg: number;
  sort_order: number;
}

export interface PaymentMethod {
  id: string;
  name_ar: string;
  account_label_ar: string;
  account_value: string;
  instructions_ar: string | null;
  sort_order: number;
}

export type TopUpMethodId = 'fawry' | 'faisal' | 'mycashi';

export type TopUpStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  photoURL: string | null;
  balance: number;
}

export interface TopUpRequest {
  id: string;
  uid: string;
  name: string;
  phone: string;
  email: string | null;
  amount: number;
  method: TopUpMethodId;
  transactionNumber: string;
  screenshot: string;
  status: TopUpStatus;
  createdAt: Date | null;
}

export interface Catalog {
  games: Game[];
  packages: Package[];
  paymentMethods: PaymentMethod[];
}
