import { createClient } from '@supabase/supabase-js';
import type { User, Screenshot, Payment, ContactMessage } from '@/types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser/frontend use
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Browser client for client-side use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database connection for direct SQL queries
export const getSupabaseConnection = () => {
  return {
    host: process.env.SUPABASE_POSTGRES_HOST,
    port: 5432,
    database: process.env.SUPABASE_POSTGRES_DATABASE,
    user: process.env.SUPABASE_POSTGRES_USER,
    password: process.env.SUPABASE_POSTGRES_PASSWORD,
    ssl: { rejectUnauthorized: false },
  };
};

// Helper functions for common operations
export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createScreenshot = async (screenshotData: Partial<Screenshot>): Promise<Screenshot> => {
  const { data, error } = await supabaseAdmin
    .from('screenshots')
    .insert([screenshotData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserScreenshots = async (userId: string, limit = 10): Promise<Screenshot[]> => {
  const { data, error } = await supabaseAdmin
    .from('screenshots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

export const updateUserCredits = async (userId: string, credits: number): Promise<User> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ credits })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const decrementUserCredits = async (userId: string): Promise<User> => {
  const { data, error } = await supabaseAdmin
    .rpc('decrement_user_credits', { user_id: userId });
  
  if (error) throw error;
  return data;
};

export const createPayment = async (paymentData: Partial<Payment>): Promise<Payment> => {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .insert([paymentData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createContactMessage = async (messageData: Partial<ContactMessage>): Promise<ContactMessage> => {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getScreenshotById = async (id: string): Promise<Screenshot | null> => {
  const { data, error } = await supabaseAdmin
    .from('screenshots')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const deleteScreenshot = async (id: string, userId?: string): Promise<void> => {
  let query = supabaseAdmin.from('screenshots').delete().eq('id', id);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { error } = await query;
  if (error) throw error;
};

export const updateScreenshotDownloads = async (id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .rpc('increment_screenshot_downloads', { screenshot_id: id });
  
  if (error) throw error;
};

export const getUserByApiKey = async (apiKey: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('api_key', apiKey)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};