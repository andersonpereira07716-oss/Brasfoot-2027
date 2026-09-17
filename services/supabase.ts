import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon-aqui';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const saveGameToCloud = async (userId: string, gameState: any) => {
  const { data, error } = await supabase
    .from('saves')
    .upsert({ user_id: userId, save_data: gameState, updated_at: new Date() });
  return { data, error };
};

export const loadGameFromCloud = async (userId: string) => {
  const { data, error } = await supabase
    .from('saves')
    .select('save_data')
    .eq('user_id', userId)
    .single();
  return { saveState: data?.save_data, error };
};
