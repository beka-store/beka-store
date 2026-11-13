import { supabase } from '@/lib/supabase';
import type { Catalog, Game, Package, PaymentMethod } from '@/types';

export async function fetchCatalog(): Promise<Catalog> {
  const [games, packages, paymentMethods] = await Promise.all([
    supabase
      .from('games')
      .select('id, name_ar, name_en, accent_color, sort_order')
      .order('sort_order'),
    supabase
      .from('packages')
      .select('id, game_id, label_ar, price_sdg, sort_order')
      .order('sort_order'),
    supabase
      .from('payment_methods')
      .select('id, name_ar, account_label_ar, account_value, instructions_ar, sort_order')
      .order('sort_order'),
  ]);

  for (const result of [games, packages, paymentMethods]) {
    if (result.error) throw new Error(result.error.message);
    if (!Array.isArray(result.data)) throw new Error('Unexpected response');
  }

  return {
    games: games.data as Game[],
    packages: packages.data as Package[],
    paymentMethods: paymentMethods.data as PaymentMethod[],
  };
}
